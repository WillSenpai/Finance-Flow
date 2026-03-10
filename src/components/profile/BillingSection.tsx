import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Check, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import {
  isNativeBillingPlatform,
  loadBillingOffers,
  loadBillingOfferingMetadata,
  purchaseBillingOffer,
  restoreBillingPurchases,
  syncBillingCustomerInfo,
  type BillingOfferingMetadata,
  type BillingOffer,
} from "@/lib/billing/revenuecat";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

function isAuthRelatedBillingError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /sessione scaduta|sessione non valida|jwt|unauthorized|authorization|401/i.test(message);
}

function isAllowedOffer(offer: BillingOffer): boolean {
  const text = `${offer.id} ${offer.title}`.toLowerCase();
  const hasWeekly = /week|weekly|settiman/.test(text);
  const hasTrial = /trial|free trial|prova gratuita|7 days|7-day/.test(text);
  return (offer.kind === "annual" || offer.kind === "monthly") && !hasWeekly && !hasTrial;
}

export default function BillingSection({ fullPage = false }: { fullPage?: boolean }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const nativeBilling = isNativeBillingPlatform();

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseModalTitle, setPurchaseModalTitle] = useState("Acquisto completato");
  const [purchaseModalDescription, setPurchaseModalDescription] = useState(
    "Il tuo piano Pro è attivo. Puoi continuare subito."
  );
  const prevPlanRef = useRef<"free" | "pro" | null>(null);

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

  useEffect(() => {
    const currentPlan = planData?.plan ?? null;
    const prevPlan = prevPlanRef.current;

    if (prevPlan === "free" && currentPlan === "pro") {
      setPurchaseModalTitle("Acquisto completato");
      setPurchaseModalDescription("Il tuo piano Pro è attivo. Puoi continuare subito.");
      setPurchaseModalOpen(true);
    }

    prevPlanRef.current = currentPlan;
  }, [planData?.plan]);

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
      if (isAuthRelatedBillingError(error)) return;
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
      setPurchaseModalTitle("Acquisto completato");
      setPurchaseModalDescription("Il tuo piano Pro è attivo. Puoi continuare subito.");
      setPurchaseModalOpen(true);
    },
    onError: (error) => {
      if (isAuthRelatedBillingError(error)) {
        setPurchaseModalTitle("Acquisto registrato");
        setPurchaseModalDescription("Stiamo aggiornando lo stato del piano. Potrebbero volerci pochi secondi.");
        setPurchaseModalOpen(true);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Acquisto non completato.");
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
      if (isAuthRelatedBillingError(error)) {
        toast.success("Ripristino avviato. Aggiornamento stato in corso.");
        return;
      }
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito.");
    },
  });

  const isBusy = syncMutation.isPending || purchaseMutation.isPending || restoreMutation.isPending;

  const filteredOffers = useMemo(() => {
    const highlightId = offeringMetadata?.highlight_package_identifier?.trim().toLowerCase();

    return [...(offers ?? [])]
      .filter(isAllowedOffer)
      .sort((a, b) => {
        if (highlightId) {
          const aHighlight = a.id.toLowerCase() === highlightId ? -1 : 0;
          const bHighlight = b.id.toLowerCase() === highlightId ? -1 : 0;
          if (aHighlight !== bHighlight) return aHighlight - bHighlight;
        }
        const rank = (kind: BillingOffer["kind"]) => (kind === "annual" ? 0 : 1);
        return rank(a.kind) - rank(b.kind);
      });
  }, [offers, offeringMetadata?.highlight_package_identifier]);

  useEffect(() => {
    if (!filteredOffers.length) {
      setSelectedOfferId(null);
      return;
    }

    if (selectedOfferId && filteredOffers.some((offer) => offer.id === selectedOfferId)) return;

    const annual = filteredOffers.find((offer) => offer.kind === "annual");
    setSelectedOfferId((annual ?? filteredOffers[0]).id);
  }, [filteredOffers, selectedOfferId]);

  const selectedOffer = filteredOffers.find((offer) => offer.id === selectedOfferId) ?? null;

  if (!user) return null;

  return (
    <div
      className={
        fullPage
          ? "min-h-screen overflow-hidden bg-card"
          : "mb-6 overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_16px_40px_-28px_hsl(var(--foreground)/0.5)]"
      }
    >
      <div className="bg-gradient-to-b from-primary/90 via-primary/75 to-primary/40 px-5 pb-5 pt-6 text-primary-foreground">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium">
          <Sparkles size={14} />
          Pro Access
        </div>

        <h2 className="text-2xl font-semibold leading-tight">
          {offeringMetadata?.paywall_title ?? "Sblocca Finance Flow Pro"}
        </h2>
        <p className="mt-2 text-sm text-primary-foreground/90">
          {offeringMetadata?.paywall_subtitle ?? "Più capacità AI, strumenti avanzati e uso continuo senza limiti base."}
        </p>

        <div className="mt-4 grid gap-2 text-sm">
          {[
            "Limite token AI mensile più alto",
            "Accesso completo agli strumenti avanzati",
            "Ripristino acquisti immediato",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-primary-foreground/95">
              <Check size={15} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-3 py-2 text-xs">
          <span>
            Piano attuale: <span className="font-semibold uppercase">{planData?.plan ?? "free"}</span>
          </span>
          <span className="font-medium">{(planData?.monthly_token_limit ?? 500_000).toLocaleString("it-IT")} token/mese</span>
        </div>

        {nativeBilling ? (
          <>
            {filteredOffers.length === 0 ? (
              <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                Nessuna offerta compatibile disponibile. Configura in RevenueCat almeno piano mensile o annuale (senza trial/weekly).
              </p>
            ) : (
              <div className="space-y-2">
                {filteredOffers.map((offer) => {
                  const selected = offer.id === selectedOfferId;
                  const isBest = offer.kind === "annual";

                  return (
                    <button
                      key={offer.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setSelectedOfferId(offer.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border/70 bg-background hover:border-primary/50 hover:bg-primary/5"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{offer.kind === "annual" ? "Pro Annuale" : "Pro Mensile"}</p>
                          <p className="text-xs text-muted-foreground">{offer.title}</p>
                        </div>
                        <div className="text-right">
                          {isBest && (
                            <span className="mb-1 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              MIGLIOR VALORE
                            </span>
                          )}
                          <p className="text-base font-semibold leading-none">{offer.priceString}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              disabled={!selectedOffer || isBusy}
              onClick={() => selectedOffer && purchaseMutation.mutate(selectedOffer)}
              className="h-12 w-full rounded-2xl text-sm font-semibold"
            >
              {isBusy ? "Elaborazione in corso..." : "Continua con Pro"}
            </Button>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => syncMutation.mutate()}
                disabled={isBusy}
                className="flex-1 rounded-xl border border-border px-3 py-2 text-xs hover:bg-muted disabled:opacity-50"
              >
                Sincronizza
              </button>
              <button
                type="button"
                onClick={() => restoreMutation.mutate()}
                disabled={isBusy}
                className="flex-1 rounded-xl border border-border px-3 py-2 text-xs hover:bg-muted disabled:opacity-50"
              >
                Ripristina
              </button>
            </div>

            <div className="rounded-xl bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
              <div className="mb-1 flex items-center gap-1.5 font-medium text-foreground/80">
                <ShieldCheck size={13} />
                Attivazione immediata
              </div>
              Nessuna prova gratuita e nessun piano settimanale. Rinnovo/cancellazione gestiti da App Store o Google Play.
            </div>
          </>
        ) : (
          <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            Gli acquisti in-app sono disponibili solo su iOS/Android nativi.
          </p>
        )}

        {planData?.grace_until && (
          <p className="text-xs text-amber-600">
            Periodo di grazia attivo fino al {new Date(planData.grace_until).toLocaleString("it-IT")}
          </p>
        )}

        {billingData?.current_period_ends_at && (
          <p className="text-xs text-muted-foreground">
            Scadenza attuale: {new Date(billingData.current_period_ends_at).toLocaleString("it-IT")}
            {billingData.auto_renews === false ? " (rinnovo disattivato)" : ""}
          </p>
        )}
      </div>

      <Dialog open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen}>
        <DialogContent className="max-w-[360px] rounded-3xl border-border/70 bg-background/95 p-0" aria-describedby={undefined}>
          <div className="p-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-center text-lg font-semibold">{purchaseModalTitle}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">{purchaseModalDescription}</p>
            <div className="mt-5">
              <Button className="w-full rounded-xl" onClick={() => setPurchaseModalOpen(false)}>
                Continua
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
