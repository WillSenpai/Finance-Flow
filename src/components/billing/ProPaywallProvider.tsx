import { ReactNode, useEffect, useState } from "react";
import { subscribeProPaywall, type PaywallReason } from "@/lib/billing/paywallEvents";
import ProPaywallModal from "@/components/billing/ProPaywallModal";

export default function ProPaywallProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<PaywallReason | null>(null);

  useEffect(() => {
    return subscribeProPaywall((nextReason) => {
      setReason(nextReason);
      setOpen(true);
    });
  }, []);

  return (
    <>
      {children}
      <ProPaywallModal open={open} onOpenChange={setOpen} reasonMessage={reason?.message} />
    </>
  );
}
