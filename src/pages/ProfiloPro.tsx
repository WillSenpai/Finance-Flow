import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BillingSection from "@/components/profile/BillingSection";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } as const;
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } } as const;

const ProfiloPro = () => {
  const navigate = useNavigate();

  return (
    <motion.div className="px-5 pt-14 pb-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/profilo")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <ArrowLeft size={16} />
          Indietro
        </button>
      </motion.div>

      <motion.div variants={item}>
        <BillingSection />
      </motion.div>
    </motion.div>
  );
};

export default ProfiloPro;
