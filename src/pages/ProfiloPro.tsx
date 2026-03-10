import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BillingSection from "@/components/profile/BillingSection";

const ProfiloPro = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100dvh] bg-background">
      <button
        type="button"
        onClick={() => navigate("/profilo")}
        className="absolute right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur hover:bg-accent"
        style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
        aria-label="Chiudi e torna al profilo"
      >
        <X size={17} />
      </button>
      <BillingSection fullPage />
    </div>
  );
};

export default ProfiloPro;
