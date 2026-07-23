import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { POC_VARIANTS, POC_LABELS, PocVersion } from "./pocVariants";
import "./index.css";

const POC_CHOICE_KEY = "poc-versione-attiva";
const VERSIONS: PocVersion[] = ["vecchia", "nuova", "somma"];

function loadChoice(): PocVersion {
  try {
    const v = localStorage.getItem(POC_CHOICE_KEY);
    if (v === "vecchia" || v === "nuova" || v === "somma") return v;
  } catch {
    /* ignore */
  }
  return "nuova";
}

// Shell del PoC: barra flottante per scegliere la versione del questionario.
// Cambiando versione l'app viene rimontata (key sul provider) così risposte,
// storage e dataset ripartono coerenti con la variante scelta.
function PocShell() {
  const [version, setVersion] = useState<PocVersion>(loadChoice);
  const variant = POC_VARIANTS[version];

  const choose = (v: PocVersion) => {
    setVersion(v);
    try {
      localStorage.setItem(POC_CHOICE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const counts: Record<PocVersion, number> = {
    vecchia: POC_VARIANTS.vecchia.dataset.Q.length,
    nuova: POC_VARIANTS.nuova.dataset.Q.length,
    somma: POC_VARIANTS.somma.dataset.Q.length
  };

  return (
    <>
      <VariantContext.Provider key={version} value={variant}>
        <App />
      </VariantContext.Provider>

      {/* Selettore versione — barra flottante in basso al centro (solo PoC) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-forest-dark/95 text-[#F2F0E9] px-2 py-1.5 rounded-full shadow-2xl border border-white/10 backdrop-blur">
        <span className="text-[9px] font-mono-tech uppercase tracking-widest px-2 opacity-70 hidden sm:inline">
          PoC · versione
        </span>
        {VERSIONS.map((v) => (
          <button
            key={v}
            onClick={() => choose(v)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans-ui font-medium uppercase tracking-wider transition ${
              version === v
                ? "bg-[#F2F0E9] text-forest-dark shadow"
                : "text-[#F2F0E9]/80 hover:text-white hover:bg-white/10"
            }`}
            title={`${POC_LABELS[v]} — ${counts[v]} domande`}
          >
            {POC_LABELS[v]}
            <span className="ml-1.5 opacity-60 font-mono-tech text-[10px]">{counts[v]}</span>
          </button>
        ))}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PocShell />
  </StrictMode>
);
