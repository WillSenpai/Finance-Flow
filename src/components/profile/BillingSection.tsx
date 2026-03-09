import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  isNativeBillingPlatform,
  loadBillingOffers,
  loadBillingOfferingMetadata,
  presentNativePaywall,
  purchaseBillingOffer,
  restoreBillingPurchases,
  syncBillingCustomerInfo,
  type BillingOfferingMetadata,
  type BillingOffer,
} from "@/lib/billing/revenuecat";

type PlanRow = {
  plan: "free" | "pro";
  monthly_token_limit: number | null;
  grace_until: string | null;
};

type BillingSubscriptionRow = {
  status: string;
  current_period_ends_at: string | null;
  auto_renews: boolean | null;
  product_id: string | null;
};

export default function BillingSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const nativeBilling = isNativeBillingPlatform();

  const { data: planData } = useQuery({
    queryKey: ["billing-plan", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PlanRow> => {
      const { data, error } = await supabase
        .from("user_ai_plans" as never)
        .select("plan, monthly_token_limit, grace_until")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;

      const row = data as PlanRow | null;
      return {
        plan: row?.plan === "pro" ? "pro" : "free",
        monthly_token_limit: row?.monthly_token_limit ?? (row?.plan === "pro" ? 5_000_000 : 500_000),
        grace_until: row?.grace_until ?? null,
      };
    },
  });

  const { data: billingData } = useQuery({
    queryKey: ["billing-subscription", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<BillingSubscriptionRow | null> => {
      const { data, error } = await supabase
        .from("billing_subscriptions" as never)
        .select("status, current_period_ends_at, auto_renews, product_id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return (data as BillingSubscriptionRow | null) ?? null;
    },
  });

  const { data: offers } = useQuery({
    queryKey: ["billing-offers", user?.id],
    enabled: !!user && nativeBilling,
    queryFn: async (): Promise<BillingOffer[]> => {
      return loadBillingOffers(user!.id);
    },
  });

  const { data: offeringMetadata } = useQuery({
    queryKey: ["billing-offering-metadata", user?.id],
    enabled: !!user && nativeBilling,
    queryFn: async (): Promise<BillingOfferingMetadata> => {
      return loadBillingOfferingMetadata(user!.id);
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await syncBillingCustomerInfo(user.id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["billing-plan", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["billing-subscription", user?.id] }),
      ]);
      toast.success("Stato abbonamento sincronizzato.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Sync abbonamento fallita.");
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (offer: BillingOffer) => {
      if (!user) return;
      await purchaseBillingOffer(user.id, offer);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["billing-plan", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["billing-subscription", user?.id] }),
      ]);
      toast.success("Acquisto completato. Entitlement aggiornato.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Acquisto non completato.");
    },
  });

  const paywallMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      return presentNativePaywall(user.id);
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["billing-plan", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["billing-subscription", user?.id] }),
      ]);
      toast.success(`Paywall chiusa (${result ?? "OK"}). Stato abbonamento aggiornato.`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Apertura paywall non riuscita.");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await restoreBillingPurchases(user.id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["billing-plan", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["billing-subscription", user?.id] }),
      ]);
      toast.success("Ripristino completato.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito.");
    },
  });

  const isBusy =
    syncMutation.isPending || purchaseMutation.isPending || restoreMutation.isPending || paywallMutation.isPending;

  const sortedOffers = useMemo(() => {
    const highlightId = offeringMetadata?.highlight_package_identifier?.trim().toLowerCase();
    return [...(offers ?? [])].sort((a, b) => {
      if (highlightId) {
        const aHighlight = a.id.toLowerCase() === highlightId ? -1 : 0;
        const bHighlight = b.id.toLowerCase() === highlightId ? -1 : 0;
        if (aHighlight !== bHighlight) return aHighlight - bHighlight;
      }
      const rank = (kind: BillingOffer["kind"]) => (kind === "monthly" ? 0 : kind === "annual" ? 1 : 2);
      return rank(a.kind) - rank(b.kind);
    });
  }, [offers, offeringMetadata?.highlight_package_identifier]);

  if (!user) return null;

  return (
    <div className="mb-6 rounded-2xl border border-border/60 bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Abbonamento Pro</h2>
          {offeringMetadata?.paywall_title && (
            <p className="text-xs text-muted-foreground">{offeringMetadata.paywall_title}</p>
          )}
          {offeringMetadata?.paywall_subtitle && (
            <p className="text-xs text-muted-foreground">{offeringMetadata.paywall_subtitle}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Piano attuale: <span className="font-medium uppercase">{planData?.plan ?? "free"}</span>
          </p>
        </div>
        <button
          onClick={() => syncMutation.mutate()}
          disabled={isBusy || !nativeBilling}
          className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          Sincronizza
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Limite token mensile: <span className="font-medium text-foreground">{(planData?.monthly_token_limit ?? 500_000).toLocaleString("it-IT")}</span>
      </p>

      {planData?.grace_until && (
        <p className="mt-1 text-xs text-amber-600">
          Periodo di grazia attivo fino al {new Date(planData.grace_until).toLocaleString("it-IT")}
        </p>
      )}

      {billingData?.current_period_ends_at && (
        <p className="mt-1 text-xs text-muted-foreground">
          Scadenza attuale: {new Date(billingData.current_period_ends_at).toLocaleString("it-IT")}
          {billingData.auto_renews === false ? " (rinnovo disattivato)" : ""}
        </p>
      )}

      {!nativeBilling ? (
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          Gli acquisti in-app sono disponibili solo su iOS/Android nativi.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          <button
            onClick={() => paywallMutation.mutate()}
            disabled={isBusy}
            className="w-full rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {offeringMetadata?.paywall_cta ?? "Apri Paywall"}
          </button>

          {sortedOffers.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nessuna offerta disponibile. Controlla RevenueCat dashboard/config store.</p>
          ) : (
            sortedOffers.map((offer) => (
              <button
                key={offer.id}
                disabled={isBusy}
                onClick={() => purchaseMutation.mutate(offer)}
                className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-left hover:bg-muted disabled:opacity-50"
              >
                <div>
                  <p className="text-sm font-medium">{offer.title}</p>
                  <p className="text-xs text-muted-foreground">{offer.kind === "annual" ? "Annuale" : offer.kind === "monthly" ? "Mensile" : "Piano"}</p>
                </div>
                <span className="text-sm font-semibold">{offer.priceString}</span>
              </button>
            ))
          )}

          <button
            onClick={() => restoreMutation.mutate()}
            disabled={isBusy}
            className="w-full rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Ripristina acquisti
          </button>

          <p className="text-[11px] text-muted-foreground">
            Gestione rinnovo/cancellazione: App Store o Google Play (account store del dispositivo).
          </p>
        </div>
      )}
    </div>
  );
}
