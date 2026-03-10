import { Capacitor } from "@capacitor/core";
import { Purchases, type CustomerInfo, type PurchasesOfferings, type PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI } from "@revenuecat/purchases-capacitor-ui";
import { invokeWithAuth } from "@/lib/invokeWithAuth";

let configuredForUserId: string | null = null;
let purchasesConfigured = false;
let configureQueue: Promise<void> = Promise.resolve();

export type BillingOffer = {
  id: string;
  title: string;
  priceString: string;
  kind: "monthly" | "annual" | "other";
  aPackage: PurchasesPackage;
};

export type BillingOfferingMetadata = {
  paywall_title?: string;
  paywall_subtitle?: string;
  paywall_cta?: string;
  highlight_package_identifier?: string;
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

  const configureStep = async () => {
    if (configuredForUserId === appUserId) return;

    const apiKey = getRevenueCatApiKey();
    if (!apiKey) {
      throw new Error("RevenueCat API key mancante. Configura VITE_REVENUECAT_API_KEY_IOS/ANDROID.");
    }

    if (!purchasesConfigured) {
      await Purchases.configure({ apiKey, appUserID: appUserId });
      purchasesConfigured = true;
      configuredForUserId = appUserId;
      return;
    }

    await Purchases.logIn({ appUserID: appUserId });
    configuredForUserId = appUserId;
  };

  const queued = configureQueue.then(configureStep);
  configureQueue = queued.catch(() => undefined);
  await queued;
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

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

export async function loadBillingOfferingMetadata(appUserId: string): Promise<BillingOfferingMetadata> {
  await ensureRevenueCatConfigured(appUserId);
  const offerings: PurchasesOfferings = await Purchases.getOfferings();
  const metadata = offerings.current?.metadata ?? {};

  return {
    paywall_title: readString(metadata.paywall_title),
    paywall_subtitle: readString(metadata.paywall_subtitle),
    paywall_cta: readString(metadata.paywall_cta),
    highlight_package_identifier: readString(metadata.highlight_package_identifier),
  };
}

function isAuthRelatedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /sessione scaduta|sessione non valida|jwt|unauthorized|authorization|401/i.test(message);
}

async function syncCustomerInfo(customerInfo: CustomerInfo, options?: { strict?: boolean }) {
  try {
    await invokeWithAuth("billing-sync", {
      body: { customerInfo },
    });
  } catch (error) {
    if (options?.strict) throw error;
    // Post-purchase sync is best-effort: do not surface transient auth failures as purchase errors.
    console.warn("[billing] Skipping non-blocking billing-sync error:", error);
  }
}

export async function purchaseBillingOffer(appUserId: string, offer: BillingOffer): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.purchasePackage({ aPackage: offer.aPackage });
  await syncCustomerInfo(result.customerInfo, { strict: false });
}

export async function restoreBillingPurchases(appUserId: string): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.restorePurchases();
  await syncCustomerInfo(result.customerInfo, { strict: false });
}

export async function syncBillingCustomerInfo(appUserId: string): Promise<void> {
  await ensureRevenueCatConfigured(appUserId);
  const result = await Purchases.getCustomerInfo();
  await syncCustomerInfo(result.customerInfo, { strict: true });
}

export async function presentNativePaywall(appUserId: string): Promise<string> {
  await ensureRevenueCatConfigured(appUserId);
  const requiredEntitlementIdentifier =
    (import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID as string | undefined) ?? "pro";

  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier,
  });

  try {
    await syncBillingCustomerInfo(appUserId);
  } catch (error) {
    if (!isAuthRelatedError(error)) throw error;
    console.warn("[billing] Ignoring auth error after paywall close; purchase result already handled by store/webhook.");
  }
  return String(result.result);
}
