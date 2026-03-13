import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  isNativeBillingPlatform,
  loadBillingOffers,
  purchaseBillingOffer,
  presentNativePaywall,
  syncBillingCustomerInfo,
  type BillingOffer,
} from "@/lib/billing/revenuecat";
import { toast } from "sonner";

type ProPaywallModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasonMessage?: string;
};

function isAllowedOffer(offer: BillingOffer): boolean {
  const text = `${offer.id} ${offer.title}`.toLowerCase();
  const hasWeekly = /week|weekly|settiman/.test(text);
  const hasTrial = /trial|free trial|prova gratuita/.test(text);
  return (offer.kind === "annual" || offer.kind === "monthly") && !hasWeekly && !hasTrial;
}

export default function ProPaywallModal({ open, onOpenChange, reasonMessage }: ProPaywallModalProps) {
  const { user } = useAuth();
  const [offers, setOffers] = useState<BillingOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) ?? null,
    [offers, selectedOfferId],
  );

  async function loadOffersIfNeeded() {
    if (!user || !isNativeBillingPlatform() || offers.length > 0 || loadingOffers) return;
    setLoadingOffers(true);
    try {
      const data = await loadBillingOffers(user.id);
      const filtered = data.filter(isAllowedOffer);
      setOffers(filtered);
      if (filtered.length > 0) {
        const annual = filtered.find((o) => o.kind === "annual");
        setSelectedOfferId((annual ?? filtered[0]).id);
      }
    } catch (error) {
      console.error("Failed to load billing offers", error);
      toast.error("Impossibile caricare le offerte Pro.");
    } finally {
      setLoadingOffers(false);
    }
  }

  async function handlePurchase() {
    if (!user) {
      toast.error("Effettua il login per completare l'upgrade.");
      return;
    }

    setPurchasing(true);
    try {
      if (isNativeBillingPlatform()) {
        if (selectedOffer) {
          await purchaseBillingOffer(user.id, selectedOffer);
        } else {
          await presentNativePaywall(user.id);
        }
        await syncBillingCustomerInfo(user.id);
      }
      setCompleted(true);
      toast.success("Piano Pro attivato.");
      onOpenChange(false);
    } catch (error) {
      console.error("Purchase failed", error);
      toast.error(error instanceof Error ? error.message : "Acquisto non completato.");
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[380px] overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-background via-background to-primary/5 p-0"
        onOpenAutoFocus={() => {
          setCompleted(false);
          void loadOffersIfNeeded();
        }}
      >
        <div className="px-6 pb-6 pt-7">
          <DialogHeader className="space-y-3 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              <Sparkles size={14} />
              Coach AI Pro
            </motion.div>
            <DialogTitle className="text-2xl font-semibold leading-tight">
              Hai esaurito i crediti del Coach AI per questo mese
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {reasonMessage ?? "Passa a Pro per continuare con limiti estesi e priorità sui modelli migliori."}
            </p>
          </DialogHeader>

          <div className="mt-5 space-y-2 rounded-2xl border border-border/70 bg-card/70 p-4">
            <p className="text-sm font-medium">Con Pro ottieni:</p>
            <p className="text-xs text-muted-foreground">Più crediti AI mensili, risposte più potenti e uso continuo senza blocchi del piano base.</p>
          </div>

          <div className="mt-4 space-y-2">
            {loadingOffers ? (
              <div className="flex h-24 items-center justify-center rounded-2xl border border-border/70 bg-card/60">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : offers.length > 0 ? (
              offers.map((offer) => {
                const active = selectedOfferId === offer.id;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => setSelectedOfferId(offer.id)}
                    disabled={purchasing}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      active ? "border-primary bg-primary/10" : "border-border/70 bg-card/70"
                    }`}
                  >
                    <p className="text-sm font-semibold">{offer.kind === "annual" ? "Pro Annuale" : "Pro Mensile"}</p>
                    <p className="text-xs text-muted-foreground">{offer.title}</p>
                    <p className="mt-1 text-sm font-medium">{offer.priceString}</p>
                  </button>
                );
              })
            ) : (
              <p className="rounded-2xl border border-border/70 bg-card/70 p-3 text-xs text-muted-foreground">
                Le offerte verranno mostrate al prossimo sync RevenueCat.
              </p>
            )}
          </div>

          <Button
            onClick={() => void handlePurchase()}
            disabled={purchasing || completed}
            className="mt-5 h-12 w-full rounded-2xl text-sm font-semibold"
          >
            {purchasing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {completed ? "Piano Pro attivo" : "Passa a Pro"}
          </Button>

          <AnimatePresence>
            {completed ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mt-3 flex items-center justify-center gap-2 text-xs text-primary"
              >
                <CheckCircle2 size={14} />
                Upgrade completato
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
