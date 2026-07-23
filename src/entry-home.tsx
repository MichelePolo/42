import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, ArrowLeft, Sprout } from "lucide-react";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { THEME_VARIANTS } from "./datasets";
import { THEME_META, THEME_DATASETS, Theme } from "./dataThemes";
import "./index.css";

const THEMES: Theme[] = ["reale", "sapere", "agire"];
const isTheme = (s: string): s is Theme => (THEMES as string[]).includes(s);

// Routing via hash: "/" (hub) e "/#reale | #sapere | #agire".
function parseHash(): Theme | null {
  const h = window.location.hash.replace(/^#/, "");
  return isTheme(h) ? h : null;
}

// --- HOME: le tre domande fondamentali come percorsi ---
function HomePage({ go }: { go: (t: Theme) => void }) {
  return (
    <div className="min-h-screen bg-stone-bg font-body flex flex-col">
      <header className="border-b border-stone-border/70">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <span className="p-1.5 bg-forest-sage/10 text-forest-sage rounded-md flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </span>
          <div>
            <h1 className="text-lg font-light tracking-[0.2em] uppercase italic text-forest-dark leading-tight">
              Albero delle alternative
            </h1>
            <p className="text-[9px] font-mono-tech uppercase tracking-[0.25em] text-forest-light mt-0.5">
              Filosofia e Scienza
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-forest-sage font-bold">
            Il tuo personale 42
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-forest-dark leading-[1.12] tracking-tight">
            Tre domande, <span className="italic font-light">un percorso.</span>
          </h2>
          <p className="mt-6 font-serif-body text-lg text-forest-medium/95 leading-relaxed">
            La filosofia si è sempre mossa attorno a tre domande fondamentali:
            <em> che cosa esiste</em>, <em>come possiamo conoscerlo</em>,
            <em> come dobbiamo vivere</em>. Scegli da dove partire.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((key) => {
            const meta = THEME_META[key];
            const n = THEME_DATASETS[key].Q.length;
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className="text-left bg-white border border-stone-border/60 rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-forest-light/60 transition-all duration-300 group flex flex-col min-h-[220px]"
              >
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-forest-sage">
                  {meta.gloss}
                </span>
                <h3 className="mt-2 font-display font-bold text-2xl text-forest-dark group-hover:text-nature-gold transition">
                  {meta.name}
                </h3>
                <p className="mt-3 text-sm text-forest-medium font-serif-body leading-relaxed flex-1">
                  {meta.blurb}.
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-sans-ui font-semibold uppercase tracking-widest text-forest-dark">
                  Inizia · {n} domande
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-stone-border/70 py-8 text-center text-xs text-forest-sage font-serif-body">
        <p className="max-w-xl mx-auto px-4">
          « La filosofia e la scienza non sono risposte assolute, ma la cura
          metodica delle domande fondamentali. »
        </p>
      </footer>
    </div>
  );
}

// --- SHELL: hub oppure percorso tematico scelto ---
function HomeShell() {
  const [theme, setTheme] = useState<Theme | null>(parseHash);
  useEffect(() => {
    const onChange = () => setTheme(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const go = (t: Theme) => {
    window.location.hash = t;
  };

  if (!theme) return <HomePage go={go} />;

  const meta = THEME_META[theme];
  return (
    <>
      <VariantContext.Provider key={theme} value={THEME_VARIANTS[theme]}>
        <App />
      </VariantContext.Provider>

      {/* Ritorno all'hub — in basso a destra per non coprire il pager centrale */}
      <button
        onClick={() => {
          window.location.hash = "";
        }}
        className="fixed bottom-4 right-4 z-[100] flex items-center gap-1.5 bg-forest-dark/95 text-[#F2F0E9] pl-2.5 pr-3.5 py-2 rounded-full shadow-2xl border border-white/10 backdrop-blur text-xs font-sans-ui font-medium uppercase tracking-wider hover:bg-forest-dark transition"
        title="Torna alla scelta del percorso"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Percorsi
        <span className="ml-1 opacity-60 normal-case font-mono-tech text-[10px]">
          · {meta.name}
        </span>
      </button>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomeShell />
  </StrictMode>
);
