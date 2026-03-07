import { ArrowLeft, Shield, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const Privacy = () => {
  const navigate = useNavigate();
  const [shareData, setShareData] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>
      <h1 className="text-2xl font-semibold mb-6">Privacy 🔒</h1>

      <div className="space-y-4 mb-8">
        {[
          { icon: Eye, label: "Condivisione dati anonimi", desc: "Aiutaci a migliorare l'app", value: analytics, set: setAnalytics },
          { icon: Shield, label: "Condivisione con partner", desc: "Condividi dati con servizi di terze parti", value: shareData, set: setShareData },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <Switch checked={item.value} onCheckedChange={item.set} />
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-2">I tuoi dati</h2>
        <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            I dati del tuo account e i dati che inserisci nell'app vengono salvati in modo sicuro su infrastruttura cloud (Supabase) per
            consentire autenticazione, sincronizzazione e backup.
          </p>
          <p>
            Usiamo solo i dati necessari al funzionamento delle funzionalita dell'app. Non vendiamo dati personali a terze parti.
          </p>
          <p>
            Puoi richiedere la modifica o la cancellazione dei tuoi dati in qualsiasi momento dalle impostazioni account.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;
