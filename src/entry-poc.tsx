import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, ArrowLeft, Compass, Layers } from "lucide-react";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { POC_VARIANTS, POC_LABELS, PocVersion } from "./pocVariants";
import { THEME_META, THEME_DATASETS, Theme } from "./dataThemes";
import "./index.css";

const THEMES: Theme[] = ["reale", "sapere", "agire"];
const VERSIONS: PocVersion[] = ["vecchia", "nuova", "somma"];
const PATHS = new Set<PocVersion>([...THEMES, ...VERSIONS]);

// Routing via hash: /poc/#temi (hub) e /poc/#reale|#sapere|#agire|#vecchia|…
function parseHash(): PocVersion | "temi" {
  const h = window.location.hash.replace(/^#/, "");
  return PATHS.has(h as PocVersion) ? (h as PocVersion) : "temi";
}

function useHashRoute(): [PocVersion | "temi", (p: PocVersion | "temi") => void] {
  const [route, setRoute] = useState<PocVersion | "temi">(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const go = (p: PocVersion | "temi") => {
    window.location.hash = p;
  };
  return [route, go];
}

// --- PAGINA TEMI (hub navigabile) ---
function TemiPage({ go }: { go: (p: PocVersion | "temi") => void }) {
  const count = (v: PocVersion) => POC_VARIANTS[v].dataset.Q.length;
  return (
    <div className="min-h-screen bg-stone-bg font-body">
      <header className="border-b border-stone-border/70 bg-stone-bg/90 backdrop-blur-md">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-forest-sage font-bold">
            Albero delle alternative · PoC
          </span>
          <h1 className="mt-2 font-display font-semibold text-4xl tracking-tight text-forest-dark">
            Temi
          </h1>
          <p className="mt-3 text-forest-sage font-serif-body text-base max-w-2xl leading-relaxed">
            Tre percorsi tematici sul pool completo delle domande, uno per ciascuna
            delle tre domande fondamentali della filosofia: <em>che cosa c'è</em>,
            <em> che cosa posso sapere</em>, <em>che cosa devo fare</em>.
          </p>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Card dei tre temi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((key) => {
            const meta = THEME_META[key];
            const n = THEME_DATASETS[key].Q.length;
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className="text-left bg-white border border-stone-border/60 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-forest-light/60 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display font-bold text-2xl text-forest-dark group-hover:text-nature-gold transition">
                    {meta.name}
                  </h2>
                  <span className="font-mono-tech text-xs text-forest-light">{n} domande</span>
                </div>
                <p className="mt-1 text-[11px] font-mono-tech uppercase tracking-widest text-forest-sage">
                  {meta.gloss}
                </p>
                <p className="mt-4 text-sm text-forest-medium font-serif-body leading-relaxed flex-1">
                  {meta.blurb}.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-sans-ui font-semibold uppercase tracking-widest text-forest-dark">
                  Inizia il percorso
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Specchietto della ripartizione */}
        <section>
          <h3 className="font-display font-semibold text-lg text-forest-dark mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-sage" /> La ripartizione
          </h3>
          <div className="border border-stone-border/60 rounded-2xl overflow-hidden bg-white shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-sans-ui min-w-[640px]">
              <thead>
                <tr className="bg-stone-card/80 border-b border-stone-border/50 text-forest-sage uppercase text-[10px] tracking-wider font-mono-tech">
                  <th className="py-3.5 px-5 font-semibold">Gruppo</th>
                  <th className="py-3.5 px-5 font-semibold">Di cosa parla</th>
                  <th className="py-3.5 px-5 font-semibold">Ambiti che confluiscono</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Domande</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-border/40 text-forest-dark">
                {THEMES.map((key) => {
                  const meta = THEME_META[key];
                  const ds = THEME_DATASETS[key];
                  return (
                    <tr key={key} className="hover:bg-stone-bg/40 transition">
                      <td className="py-4 px-5">
                        <span className="font-display font-bold">{meta.name}</span>
                        <span className="block text-[10px] font-mono-tech text-forest-light italic">
                          {meta.gloss}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-forest-medium">{meta.blurb}</td>
                      <td className="py-4 px-5 text-forest-sage text-xs">
                        {ds.CLUSTERS.map((c) => c.name).join(", ")}
                      </td>
                      <td className="py-4 px-5 text-right font-mono-tech font-bold">
                        {ds.Q.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-forest-sage font-sans-ui leading-relaxed max-w-3xl">
            23 / 16 / 15 su 54 — bilanciato. Ricalca la tripartizione classica{" "}
            <strong>metafisica → gnoseologia → etica</strong>: che cosa esiste, come
            lo conosco, come vivo.
          </p>
        </section>

        {/* Percorsi per versione (le tre versioni intere) */}
        <section>
          <h3 className="font-display font-semibold text-lg text-forest-dark mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-forest-sage" /> Oppure per versione
          </h3>
          <div className="flex flex-wrap gap-3">
            {VERSIONS.map((v) => (
              <button
                key={v}
                onClick={() => go(v)}
                className="flex items-center gap-2 bg-white border border-stone-border/60 rounded-xl px-4 py-2.5 shadow-xs hover:border-forest-light/60 transition"
              >
                <span className="font-display font-semibold text-sm text-forest-dark">
                  {POC_LABELS[v]}
                </span>
                <span className="font-mono-tech text-[10px] text-forest-light">
                  {count(v)} domande
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-border/70 py-8 text-center">
        <p className="text-[10px] font-mono-tech uppercase tracking-widest text-forest-light">
          PoC · pagina di test non pubblicizzata
        </p>
      </footer>
    </div>
  );
}

// --- SHELL: hub Temi oppure questionario scelto ---
function PocShell() {
  const [route, go] = useHashRoute();

  if (route === "temi") return <TemiPage go={go} />;

  const variant = POC_VARIANTS[route];
  return (
    <>
      <VariantContext.Provider key={route} value={variant}>
        <App />
      </VariantContext.Provider>

      {/* Barra flottante: ritorno all'hub Temi + percorso corrente.
          In basso a destra per non coprire il pager centrale della vista Albero. */}
      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 bg-forest-dark/95 text-[#F2F0E9] pl-1.5 pr-3 py-1.5 rounded-full shadow-2xl border border-white/10 backdrop-blur">
        <button
          onClick={() => go("temi")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans-ui font-medium uppercase tracking-wider bg-[#F2F0E9] text-forest-dark hover:opacity-90 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Temi
        </button>
        <span className="px-2 text-xs font-sans-ui uppercase tracking-wider">
          {POC_LABELS[route]}
          <span className="ml-1.5 opacity-60 font-mono-tech text-[10px]">
            {variant.dataset.Q.length}
          </span>
        </span>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PocShell />
  </StrictMode>
);
