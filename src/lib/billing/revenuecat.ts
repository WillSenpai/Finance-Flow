import { Capacitor } from "@capacitor/core";
import { Purchases, type CustomerInfo, type PurchasesOfferings, type PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { invokeWithAuth } from "@/lib/invokeWithAuth";

let configuredForUserId: string | null = null;

export type BillingOffer = {
  id: string;
  title: string;
  priceString: string;
  kind: "monthly" | "annual" | "other";
  aPackage: PurchasesPackage;
};

export function isNativeBillingPlatform(): boolean {
  if (!Capacitor.isNativePlatform()) return false;
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
}

function getRevenueCatApiKey(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "ios") {
    return (import.meta.env.VITE_REVENUECAT_API_KEY_IOS as string | undefined) ?? "";
  }
  if (platform === "android") {
    return (import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID as string | undefined) ?? "";
  }

  return (import.meta.env.VITE_REVENUECAT_API_KEY as string | undefined) ?? "";
}

export async function ensureRevenueCatConfigured(appUserId: string): Promise<void> {
  if (!isNativeBillingPlatform()) return;
  if (configuredForUserId === appUserId) return;

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    throw new Error("RevenueCat API key mancante. Configura VITE_REVENUECAT_API_KEY_IOS/ANDROID.");
  }

  await Purchases.configure({ apiKey, appUserID: appUserId });
  await Purchases.logIn({ appUserID: appUserId });
  configuredForUserId = appUserId;
}

export async function loadBillingOffers(appUserId: string): Promise<BillingOffer[]> {
  await ensureRevenueCatConfigured(appUserId);

  const offerings: PurchasesOfferings = await Purchases.getOfferings();
  const current = offerings.current;
  const packages = current?.availablePackages ?? [];

  return packages.map((pkg) => {
    const id = `${pkg.identifier}`.toLowerCase();
    const kind: BillingOffer["kind"] = id.includes("annual") || id.includes("year")
      ? "annual"
      : id.includes("month")
        ? "monthly"
        : "other";

    return {
      id: pkg.identifier,
      title: pkg.product.title,
      priceString: pkg.product.priceString,
      kind,
      aPackage: pkg,
    };
  });
}

async function syncCustomerInfo(customerInfo: CustomerInfo) {
  await invokeWithAuth("billing-sync", {
    body: { customerInfo },
  });
}

export async function purchaseBillingOffer(appUserId: string, offer: BillingOffer): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.purchasePackage({ aPackage: offer.aPackage });
  await syncCustomerInfo(result.customerInfo);
}

export async function restoreBillingPurchases(appUserId: string): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.restorePurchases();
  await syncCustomerInfo(result.customerInfo);
}

export async function syncBillingCustomerInfo(appUserId: string): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.getCustomerInfo();
  await syncCustomerInfo(result.customerInfo);
}
