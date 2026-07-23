import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  BookOpen,
  Layers,
  Users,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  CheckCircle2,
  X,
  Menu,
  Scale,
  HelpCircle,
  Sprout,
  Info,
  ChevronRight,
  ChevronDown,
  Feather,
  GitBranch,
  Flame,
  Award,
  Share2,
  Check
} from "lucide-react";

import { Question, Option, Profile } from "./data";
import SHARE_PROFILES from "./shareProfiles.json";
import PhilosopherMap, { affinityPoint, CommunityPoint } from "./PhilosopherMap";
import Leaderboard from "./Leaderboard";
import { encodeAnswers, decodeAnswers } from "./answersCodec";
import { computeAffinities } from "./affinity";
import { getLeaderboardService, getClientId } from "./leaderboard";
import { useVariant } from "./variants";

// Risposte condivise via URL (?responses=...&v=N) per uno specifico
// questionario, oppure null. Dipende dal dataset attivo (le domande e la
// versione cambiano fra legacy e v1), quindi è una funzione, non una costante.
function readUrlImport(
  questions: Question[],
  shareVersion: string
): Record<string, string> | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("responses");
    if (!encoded) return null;
    if ((params.get("v") ?? shareVersion) !== shareVersion) return null;
    const decoded = decodeAnswers(encoded, questions);
    return decoded && Object.keys(decoded).length > 0 ? decoded : null;
  } catch {
    return null;
  }
}

export default function App() {
  const variant = useVariant();
  const { CLUSTERS, Q, MATRIX, MCOL, PROFILES } = variant.dataset;
  const { enableCommunity, storageKey: ANSWERS_STORAGE_KEY, shareVersion: SHARE_VERSION } = variant;

  // Import da URL: calcolato una sola volta all'avvio per il dataset corrente.
  const URL_IMPORT = useRef(readUrlImport(Q, SHARE_VERSION)).current;

  // --- STATE ---
  type Tab = "intro" | "tree" | "matrix" | "profiles" | "map" | "ranking";
  const [activeTab, setActiveTab] = useState<Tab>(URL_IMPORT ? "profiles" : "intro");
  const [activeQuestionId, setActiveQuestionId] = useState<string>(Q[0].id);
  // Su mobile la navigazione stacked è richiudibile: parte chiusa e si
  // richiude a ogni navigazione (vedi effect su activeTab più sotto).
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  // While true, answers came from a shared URL and must not overwrite
  // the visitor's own localStorage until they interact.
  const viewingSharedResult = useRef<boolean>(URL_IMPORT !== null);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    if (URL_IMPORT) return URL_IMPORT;
    try {
      const saved = localStorage.getItem(ANSWERS_STORAGE_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      // Keep only entries that still match a valid question/option pair
      const valid: Record<string, string> = {};
      Object.entries(parsed).forEach(([qid, oid]) => {
        const question = Q.find((q) => q.id === qid);
        if (question && question.o.some((opt) => opt.id === oid)) {
          valid[qid] = oid as string;
        }
      });
      return valid;
    } catch {
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // --- DERIVED STATE ---
  const activeQuestion = useMemo(() => {
    return Q.find((q) => q.id === activeQuestionId) || Q[0];
  }, [activeQuestionId]);

  const activeQuestionIndex = useMemo(() => {
    return Q.findIndex((q) => q.id === activeQuestionId);
  }, [activeQuestionId]);

  // Handle option toggling (if already selected, deselect; otherwise select)
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    viewingSharedResult.current = false;
    setAnswers((prev) => {
      const updated = { ...prev };
      if (updated[questionId] === optionId) {
        delete updated[questionId];
      } else {
        updated[questionId] = optionId;
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    if (window.confirm("Sei sicuro di voler azzerare tutte le risposte date finora?")) {
      viewingSharedResult.current = false;
      setAnswers({});
    }
  };

  // Qualunque navigazione (tab, vettore 𝒲, sidebar) richiude il menu mobile.
  useEffect(() => {
    setIsNavOpen(false);
  }, [activeTab]);

  // Al cambio di domanda riallinea la pagina all'inizio del contenuto, così
  // dopo aver risposto in fondo non serve risalire a mano. Il target è <main>
  // (sempre montato, a differenza dei pannelli animati); lo scroll-margin-top
  // sul <main> compensa l'altezza dell'header sticky. Niente scroll al primo
  // render: solo sui cambi successivi.
  const prevQuestionIdRef = useRef<string>(activeQuestionId);
  useEffect(() => {
    if (prevQuestionIdRef.current === activeQuestionId) return;
    prevQuestionIdRef.current = activeQuestionId;
    if (activeTab !== "tree") return;
    document
      .getElementById("main-content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeQuestionId, activeTab]);

  // Strip share params from the address bar after import, so a refresh
  // doesn't re-import and the visitor can share their own link later.
  useEffect(() => {
    if (URL_IMPORT) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("responses");
        url.searchParams.delete("v");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch {
        // ignore: cosmetic only
      }
    }
  }, []);

  // Persist answers across sessions
  useEffect(() => {
    if (viewingSharedResult.current) return;
    try {
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // storage unavailable (private mode / quota): keep working in-memory only
    }
  }, [answers]);

  // Keyboard Navigation for questions in Tree view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // ignore typing in search

      if (activeTab === "tree") {
        if (e.key === "ArrowRight" && activeQuestionIndex < Q.length - 1) {
          e.preventDefault();
          setActiveQuestionId(Q[activeQuestionIndex + 1].id);
        } else if (e.key === "ArrowLeft" && activeQuestionIndex > 0) {
          e.preventDefault();
          setActiveQuestionId(Q[activeQuestionIndex - 1].id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, activeQuestionIndex]);

  // Search filtering logic
  const filteredClusters = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CLUSTERS;

    return CLUSTERS.map((cluster) => {
      const matchingQuestions = Q.filter(
        (q) =>
          q.c === cluster.id &&
          (q.t.toLowerCase().includes(query) ||
            q.note?.toLowerCase().includes(query) ||
            q.o.some(
              (opt) =>
                opt.l.toLowerCase().includes(query) ||
                opt.b.toLowerCase().includes(query)
            ))
      );
      return {
        ...cluster,
        questions: matchingQuestions
      };
    }).filter((cluster) => cluster.questions && cluster.questions.length > 0);
  }, [searchQuery]);

  // Real-time calculation of affinity with the profiles of this dataset
  const profileAffinities = useMemo(
    () => computeAffinities(answers, PROFILES),
    [answers, PROFILES]
  );

  // Le ultime 10 compilazioni degli altri visitatori, proiettate sul piano
  // della mappa (caricate quando si apre il tab; la propria è esclusa
  // perché già rappresentata dal punto "TU" in tempo reale).
  const [communityPoints, setCommunityPoints] = useState<CommunityPoint[]>([]);
  useEffect(() => {
    if (!enableCommunity || activeTab !== "map") return;
    let cancelled = false;
    const myId = getClientId();
    getLeaderboardService({
      dataset: variant.dataset,
      apiUrl: variant.leaderboardApiUrl,
      version: variant.leaderboardVersion
    })
      .recent(11) // una in più: se c'è la mia, resta comunque spazio per 10 altrui
      .then((results) => {
        if (cancelled) return;
        const points = results
          .filter((r) => r.clientId !== myId)
          .slice(0, 10)
          .flatMap((r) => {
            const decoded = decodeAnswers(r.responses, Q);
            if (!decoded) return [];
            const point = affinityPoint(computeAffinities(decoded, PROFILES));
            return point ? [{ nickname: r.nickname, ...point }] : [];
          });
        setCommunityPoints(points);
      })
      .catch(() => {
        // mappa comunque utilizzabile senza i punti della community
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, enableCommunity, Q, PROFILES]);

  // Answer status summary per cluster
  const clusterProgress = useMemo(() => {
    const progress: Record<string, { answered: number; total: number }> = {};
    CLUSTERS.forEach((c) => {
      const qInCluster = Q.filter((q) => q.c === c.id);
      const ansInCluster = qInCluster.filter((q) => !!answers[q.id]);
      progress[c.id] = {
        answered: ansInCluster.length,
        total: qInCluster.length
      };
    });
    return progress;
  }, [answers]);

  // Botanical background color mapping for option cards. Dieci temi: le
  // domande della versione Somma possono avere più di cinque risposte, quindi
  // servono colori distinti oltre i primi cinque (poi si cicla con il modulo).
  const optionColors = [
    {
      theme: "earth-ochre",
      border: "border-earth-ochre/30 hover:border-earth-ochre/70",
      activeBg: "bg-earth-ochre/10",
      activeBorder: "border-earth-ochre",
      badge: "bg-earth-ochre text-white",
      text: "text-earth-ochre",
      ring: "ring-earth-ochre/35",
    },
    {
      theme: "nature-teal",
      border: "border-nature-teal/30 hover:border-nature-teal/70",
      activeBg: "bg-nature-teal/10",
      activeBorder: "border-nature-teal",
      badge: "bg-nature-teal text-white",
      text: "text-nature-teal",
      ring: "ring-nature-teal/35",
    },
    {
      theme: "nature-violet",
      border: "border-nature-violet/30 hover:border-nature-violet/70",
      activeBg: "bg-nature-violet/10",
      activeBorder: "border-nature-violet",
      badge: "bg-nature-violet text-white",
      text: "text-nature-violet",
      ring: "ring-nature-violet/35",
    },
    {
      theme: "nature-rose",
      border: "border-nature-rose/30 hover:border-nature-rose/70",
      activeBg: "bg-nature-rose/10",
      activeBorder: "border-nature-rose",
      badge: "bg-nature-rose text-white",
      text: "text-nature-rose",
      ring: "ring-nature-rose/35",
    },
    {
      theme: "nature-sky",
      border: "border-nature-sky/30 hover:border-nature-sky/70",
      activeBg: "bg-nature-sky/10",
      activeBorder: "border-nature-sky",
      badge: "bg-nature-sky text-white",
      text: "text-nature-sky",
      ring: "ring-nature-sky/35",
    },
    {
      theme: "nature-gold",
      border: "border-nature-gold/30 hover:border-nature-gold/70",
      activeBg: "bg-nature-gold/10",
      activeBorder: "border-nature-gold",
      badge: "bg-nature-gold text-white",
      text: "text-nature-gold",
      ring: "ring-nature-gold/35",
    },
    {
      theme: "earth-clay",
      border: "border-earth-clay/30 hover:border-earth-clay/70",
      activeBg: "bg-earth-clay/10",
      activeBorder: "border-earth-clay",
      badge: "bg-earth-clay text-white",
      text: "text-earth-clay",
      ring: "ring-earth-clay/35",
    },
    {
      theme: "forest-sage",
      border: "border-forest-sage/30 hover:border-forest-sage/70",
      activeBg: "bg-forest-sage/10",
      activeBorder: "border-forest-sage",
      badge: "bg-forest-sage text-white",
      text: "text-forest-sage",
      ring: "ring-forest-sage/35",
    },
    {
      theme: "earth-bark",
      border: "border-earth-bark/30 hover:border-earth-bark/70",
      activeBg: "bg-earth-bark/10",
      activeBorder: "border-earth-bark",
      badge: "bg-earth-bark text-white",
      text: "text-earth-bark",
      ring: "ring-earth-bark/35",
    },
    {
      theme: "forest-light",
      border: "border-forest-light/30 hover:border-forest-light/70",
      activeBg: "bg-forest-light/10",
      activeBorder: "border-forest-light",
      badge: "bg-forest-light text-white",
      text: "text-forest-light",
      ring: "ring-forest-light/35",
    }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-stone-bg flex flex-col selection:bg-forest-pale/40 selection:text-forest-dark font-body">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-stone-bg/90 backdrop-blur-md border-b border-stone-border/70">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3">

          {/* Prima riga: brand + firma vettoriale 𝒲. Stacked su mobile,
              affiancati da tablet in su. La navigazione va sempre a capo. */}
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-stone-accent border border-stone-border transition"
              aria-label="Apri menu domande"
              id="mobile-menu-btn"
            >
              <Menu className="w-5 h-5 text-forest-sage" />
            </button>
            
            <div className="flex items-baseline gap-2.5">
              <span className="p-1.5 bg-forest-sage/10 text-forest-sage rounded-md flex items-center justify-center shrink-0">
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

            {/* Empty block on mobile for spacing */}
            <div className="w-8 lg:hidden"></div>
          </div>

          {/* Core Interactive Signature Vector "𝒲" */}
          <div className="flex items-center justify-center gap-1.5 bg-stone-card px-3.5 py-2.5 rounded-xl border border-stone-border/80 shadow-xs w-full sm:w-auto max-w-full whitespace-nowrap overflow-x-auto md:overflow-x-hidden shrink-0">
            <span className="font-mono-tech text-forest-light text-sm mr-1 hidden sm:inline whitespace-nowrap">𝒲 = ⟨</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0" id="vector-signature">
              {CLUSTERS.map((cl) => {
                const prog = clusterProgress[cl.id];
                const hasAnswers = prog.answered > 0;
                const isComplete = prog.answered === prog.total;
                const fillPercent = Math.round((prog.answered / prog.total) * 100);

                return (
                  <button
                    key={cl.id}
                    onClick={() => {
                      setActiveTab("tree");
                      const firstQOfCluster = Q.find((q) => q.c === cl.id);
                      if (firstQOfCluster) {
                        setActiveQuestionId(firstQOfCluster.id);
                      }
                    }}
                    className={`relative w-8 h-8 rounded-lg font-mono-tech text-xs font-semibold flex items-center justify-center border transition-all duration-300 overflow-hidden group ${
                      isComplete
                        ? "border-nature-gold bg-nature-gold/10 text-forest-dark"
                        : hasAnswers
                        ? "border-forest-sage bg-[#EBEBE4] text-forest-dark"
                        : "border-stone-border/80 bg-[#F5F4ED] text-forest-light/80 hover:border-forest-light hover:text-forest-dark"
                    }`}
                    title={`${cl.name} · ${prog.answered}/${prog.total} risposte`}
                  >
                    {/* Floating Vertical Liquid Fill representing commitment progress */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-500 pointer-events-none opacity-20 ${
                        isComplete ? "bg-nature-gold" : "bg-forest-sage"
                      }`}
                      style={{ height: `${fillPercent}%` }}
                    />
                    
                    <span className="relative z-10 select-none uppercase">{cl.id}</span>

                    {/* Desktop Tooltip */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-forest-dark text-[#FAF9F5] text-[10px] font-sans-ui py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      {cl.name}: <span className="font-mono-tech">{prog.answered}/{prog.total}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <span className="font-mono-tech text-forest-light text-sm ml-1 hidden sm:inline">⟩</span>
          </div>

          </div>{/* fine prima riga */}

          {/* Navigation Tabs — sempre a capo, riga a tutta larghezza.
              Su mobile: barra compatta col tab attivo, elenco richiudibile
              che si chiude a ogni navigazione. Da tablet in su: riga con wrap. */}
          {(() => {
            const navTabs = [
              { id: "intro", label: "Introduzione", icon: BookOpen },
              { id: "tree", label: "Albero", icon: Sprout },
              { id: "matrix", label: "Matrice", icon: Layers },
              { id: "profiles", label: "Profili", icon: Users },
              ...(enableCommunity
                ? [
                    { id: "map", label: "Mappa", icon: Compass },
                    { id: "ranking", label: "Classifiche", icon: Award }
                  ]
                : [])
            ];
            const current = navTabs.find((t) => t.id === activeTab) ?? navTabs[0];
            const CurrentIcon = current.icon;

            return (
              <nav className="bg-stone-accent/60 p-1 rounded-xl border border-stone-border/80 w-full">
                {/* Barra compatta (solo mobile): tab attivo + toggle */}
                <button
                  onClick={() => setIsNavOpen((open) => !open)}
                  className="sm:hidden w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-stone-border/40 shadow-xs"
                  aria-expanded={isNavOpen}
                  aria-controls="main-nav-tabs"
                  aria-label={isNavOpen ? "Chiudi la navigazione" : "Apri la navigazione"}
                >
                  <span className="flex items-center gap-1.5 font-sans-ui text-xs font-medium uppercase tracking-wider text-forest-dark">
                    <CurrentIcon className="w-3.5 h-3.5" />
                    {current.label}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-forest-sage transition-transform duration-200 ${
                      isNavOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Elenco tab: nascosto su mobile finché chiuso, sempre visibile da sm in su */}
                <div
                  id="main-nav-tabs"
                  className={`${
                    isNavOpen ? "flex" : "hidden"
                  } sm:flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-1 mt-1 sm:mt-0`}
                >
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsSidebarOpen(false);
                        }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-sans-ui text-xs font-medium uppercase tracking-wider transition ${
                          isActive
                            ? "bg-white text-forest-dark shadow-xs border border-stone-border/40"
                            : "text-forest-sage hover:text-forest-dark"
                        }`}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            );
          })()}

        </div>
      </header>

      {/* --- SIDEBAR DRAWER (MOBILE) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-stone-bg border-r border-stone-border z-50 p-6 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-semibold text-lg text-forest-dark">Indice Domande</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-stone-accent rounded-lg border border-stone-border/50"
                >
                  <X className="w-4 h-4 text-forest-sage" />
                </button>
              </div>
              <SidebarContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredClusters={filteredClusters}
                activeQuestionId={activeQuestionId}
                setActiveQuestionId={setActiveQuestionId}
                setActiveTab={setActiveTab}
                answers={answers}
                onSelectClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SHELL LAYOUT --- */}
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block bg-stone-card/30 border border-stone-border/60 p-5 rounded-2xl sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto shadow-xs">
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredClusters={filteredClusters}
            activeQuestionId={activeQuestionId}
            setActiveQuestionId={setActiveQuestionId}
            setActiveTab={setActiveTab}
            answers={answers}
            onSelectClose={() => {}}
          />
        </aside>

        {/* --- MAIN INTERACTION AREA --- */}
        <main
          className="w-full min-w-0 scroll-mt-52 sm:scroll-mt-44 md:scroll-mt-36"
          id="main-content"
        >
          
          <AnimatePresence mode="wait">
            
            {/* TAB 0: INTRODUZIONE / INFORMAZIONI */}
            {activeTab === "intro" && (
              <motion.div
                key="intro-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 max-w-3xl mx-auto"
              >
                {/* Hero Minimal Style header */}
                <div className="border-b border-stone-border/60 pb-8 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-forest-sage font-bold mb-4 block">
                    Introduzione
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-serif text-forest-dark leading-[1.15] mb-6 tracking-tight">
                    Il Significato della Vita, <br />
                    <span className="italic font-light">l'Universo e il nostro</span> <br />
                    personale 42.
                  </h1>
                </div>

                {/* Main Prose Grid/Style */}
                <div className="font-serif-body text-base text-forest-medium/95 leading-relaxed space-y-8">
                  
                  {/* Highlighted Quote / Dicotomia */}
                  <div className="bg-stone-card border border-stone-border/60 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-forest-sage/5 rounded-full blur-xl" />
                    <span className="text-[10px] font-mono-tech uppercase tracking-widest text-forest-sage font-bold block mb-3">
                      Dicotomia
                    </span>
                    <blockquote className="text-lg md:text-xl font-serif italic text-forest-dark leading-relaxed">
                      "L'umanità si divide in due categorie: chi ha letto Guida Galattica per Autostoppisti e chi non l'ha letto ( né visto il film )."
                    </blockquote>
                  </div>

                  <p>
                    Nel romanzo di Douglas Adams l'umanità costruisce un super computer chiamato <strong>"Pensiero Profondo"</strong>. <br />
                    Per una volta in tutta la storia finalmente l'umanità è d'accordo. Trovandosi di fronte a tanta potenza di calcolo, si decide di usare tutta questa potenza di calcolo per l'unica domanda significativa da farsi: <em>"Qual'è la risposta definitiva alla vita, all'universo e a tutto quanto?"</em>
                  </p>

                  <p>
                    Il numero <strong>42</strong> è la risposta definitiva e il super computer Pensiero Profondo impiega 7 milioni e mezzo di anni di calcoli per ottenere il risultato.
                  </p>

                  <p>
                    La vera ironia del romanzo sta nel fatto che, dopo 7 milioni e mezzo di anni di calcoli per ottenere il risultato, gli esseri intelligenti scoprono che la risposta è del tutto inutile perché non hanno la più pallida idea di quale fosse la domanda posta inizialmente! <br />
                    È così che la domanda più importante, il significato della vita, ottiene una risposta quando non c'è più nessuno a coglierne il valore.
                  </p>

                  <p>
                    Douglas Adams ha rivelato in diverse interviste che la scelta è ricaduta sul 42 semplicemente perché si tratta di un numero qualunque, ordinario e dal suono buffo. Non c'è un significato filosofico o matematico nascosto dietro il numero in sé.
                  </p>

                  <p className="font-sans-ui text-sm uppercase tracking-wider text-forest-sage font-semibold pt-4">
                    Ora se volessimo porre la stessa domanda a un LLM, a un'intelligenza artificiale, cosa ci risponderebbe? 42?
                  </p>

                  <p>
                    A mio parere non è importante la risposta di una calcolatrice. Probabilmente Claude, Chatgpt, Gemini, risponderebbero su una mediana delle opinioni della popolazione umana. <br />
                    Il Cristianesimo è la religione più praticata sul pianeta con 2,4 miliardi di fedeli o forse il Buddhismo che negli ultimi anni è più in hype? <br />
                    Il Darwinismo a me piace tanto.
                  </p>

                  <p>
                    Il fatto è che le domande importanti nella vita quasi mai ci mettono di fronte a una dicotomia. Dobbiamo spesso scegliere tra bianco, grigio, azzurro, verde, viola, nero, e mille altre sfumature.
                  </p>

                  {/* Call to action section */}
                  <div className="bg-stone-card border border-stone-border/70 rounded-2xl p-6 md:p-8 space-y-6 mt-10 shadow-xs">
                    <h3 className="text-xl font-serif text-forest-dark italic">
                      E Tu quale interpretazione dai alla vita?
                    </h3>
                    <p className="text-sm text-forest-sage leading-relaxed font-sans-ui">
                      A seguire un'operazione insiemistica: <strong>{Q.length} domande</strong> cercheranno di individuare il Tuo centro, il Tuo personale <strong>42</strong>.
                    </p>
                    <p className="text-sm text-forest-sage leading-relaxed font-sans-ui">
                      Se Ti va di condividete il risultato, nella condivisione e nella discussione con gli altri sta probabilmente il valore della conoscenza. <br />
                      In ogni caso ricorda: le risposte che diamo tendono a sembrarci quelle più corrette.
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4">
                      <button
                        onClick={() => setActiveTab("tree")}
                        className="px-8 py-3 bg-[#2D302A] text-[#F2F0E9] text-[10px] uppercase tracking-widest hover:bg-[#3D4238] transition-colors font-sans-ui font-semibold flex items-center gap-2 group"
                      >
                        Inizia l'Indagine <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setActiveTab("matrix")}
                        className="px-6 py-3 border border-stone-border/80 text-forest-medium text-[10px] uppercase tracking-widest hover:bg-stone-accent/35 transition-colors font-sans-ui font-semibold"
                      >
                        Vedi la Matrice
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 1: ALBERO DELLE ALTERNATIVE (TREE VIEW) */}
            {activeTab === "tree" && (
              <motion.div
                key="tree-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Eyebrow & Status */}
                <div className="border-b border-stone-border/60 pb-5">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tech text-forest-light tracking-wider uppercase mb-3">
                    <span className="px-2 py-0.5 bg-forest-sage/10 text-forest-sage rounded border border-forest-sage/20 uppercase font-semibold">
                      {activeQuestion.c}
                    </span>
                    <span>
                      {CLUSTERS.find((c) => c.id === activeQuestion.c)?.name}
                    </span>
                    <span className="text-stone-border">•</span>
                    <span className="text-nature-gold font-semibold">
                      Domanda {activeQuestionIndex + 1} di {Q.length}
                    </span>
                    <span className="text-stone-border">•</span>
                    <span className="italic text-forest-sage/80 lowercase">
                      {CLUSTERS.find((c) => c.id === activeQuestion.c)?.gloss}
                    </span>
                  </div>

                  {/* Main Display Title */}
                  <div className="flex items-start gap-4 md:gap-6 mt-4">
                    <span className="font-display font-light text-5xl md:text-6xl text-forest-pale select-none border-r border-stone-border/40 pr-4 md:pr-6 leading-none">
                      {String(activeQuestionIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display font-semibold text-2xl md:text-3.5xl lg:text-4xl text-forest-dark leading-tight tracking-tight mt-1">
                      {activeQuestion.t}
                    </h2>
                  </div>

                  {/* Mathematical/State Formula */}
                  {activeQuestion.f && (
                    <div className="mt-4 font-mono-tech text-xs text-nature-teal bg-nature-teal/5 border-l-2 border-nature-teal/40 px-4 py-2 rounded-r-lg max-w-xl overflow-x-auto select-all">
                      {activeQuestion.f}
                    </div>
                  )}

                  {/* Context Note */}
                  {activeQuestion.note && (
                    <p className="mt-4 text-forest-sage font-body text-base max-w-3xl leading-relaxed italic">
                      {activeQuestion.note}
                    </p>
                  )}
                </div>

                {/* Literary Guide: "Come Orientarsi" */}
                {activeQuestion.g && (
                  <div className="bg-stone-card rounded-2xl border border-stone-border/60 p-6 md:p-8 shadow-xs relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-forest-sage/5 rounded-full blur-xl group-hover:bg-forest-sage/10 transition duration-500" />
                    
                    <span className="text-[10px] font-mono-tech uppercase tracking-widest text-nature-gold flex items-center gap-1.5 mb-3 font-semibold">
                      <HelpCircle className="w-3.5 h-3.5" /> Come Orientarsi
                    </span>
                    
                    <p className="text-forest-dark/90 font-serif-body text-base leading-relaxed max-w-4xl">
                      {activeQuestion.g}
                    </p>

                    {/* Analogy subbox */}
                    {activeQuestion.an && (
                      <div className="mt-5 pt-5 border-t border-stone-border/50 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3 items-baseline">
                        <span className="font-mono-tech text-[10px] uppercase tracking-widest text-forest-light font-medium">
                          Analogia:
                        </span>
                        <p className="text-forest-sage font-serif-body text-sm italic leading-relaxed">
                          {activeQuestion.an}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Option Branches (Le Alternative) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-medium text-lg text-forest-dark">
                      Scegli un Ramo (Le Alternative)
                    </h3>
                    {answers[activeQuestion.id] && (
                      <button
                        onClick={() => handleAnswerSelect(activeQuestion.id, answers[activeQuestion.id])}
                        className="text-xs text-forest-light hover:text-nature-rose font-mono-tech transition flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Rimuovi scelta
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {activeQuestion.o.map((opt, idx) => {
                      const colorConfig = optionColors[idx % optionColors.length];
                      const isPicked = answers[activeQuestion.id] === opt.id;
                      const hasAnyAnswer = !!answers[activeQuestion.id];

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleAnswerSelect(activeQuestion.id, opt.id)}
                          className={`group relative border rounded-2xl p-5 md:p-6 cursor-pointer transition-all duration-300 ${
                            isPicked
                              ? `${colorConfig.activeBorder} ${colorConfig.activeBg} shadow-sm ring-1 ring-offset-2 ring-offset-[#FAF9F5] ${colorConfig.ring}`
                              : colorConfig.border
                          } ${
                            hasAnyAnswer && !isPicked
                              ? "opacity-55 hover:opacity-90 bg-white/70"
                              : "bg-white"
                          }`}
                        >
                          {/* Left colored border highlight on hover/active */}
                          <div
                            className={`absolute left-0 top-4 bottom-4 w-1 rounded-r transition-all duration-300 ${
                              isPicked
                                ? "opacity-100 h-auto"
                                : "opacity-0 group-hover:opacity-60 h-8"
                            }`}
                            style={{ backgroundColor: `var(--color-${colorConfig.theme})` }}
                          />

                          <div className="flex items-start gap-4">
                            {/* Alphabet Badge */}
                            <span
                              className={`w-7 h-7 rounded-lg font-mono-tech text-xs font-bold flex items-center justify-center shrink-0 uppercase transition-all ${
                                isPicked
                                  ? colorConfig.badge
                                  : "bg-stone-accent text-forest-sage group-hover:bg-forest-pale/50 group-hover:text-forest-dark"
                              }`}
                            >
                              {opt.id}
                            </span>

                            <div className="flex-1 space-y-2">
                              {/* Option title and pick status */}
                              <div className="flex items-baseline justify-between gap-4">
                                <h4 className="font-display font-semibold text-lg md:text-xl text-forest-dark tracking-tight">
                                  {opt.l}
                                </h4>
                                <span
                                  className={`text-[10px] font-mono-tech uppercase tracking-widest font-semibold transition-opacity duration-300 ${
                                    isPicked ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                                  } ${colorConfig.text}`}
                                >
                                  {isPicked ? "✓ Scelto" : "Scegli"}
                                </span>
                              </div>

                              {/* Option code/math formula */}
                              {opt.f && (
                                <p className="font-mono-tech text-[11px] text-forest-light tracking-wide select-all">
                                  {opt.f}
                                </p>
                              )}

                              {/* Body explanation */}
                              <p className="text-forest-medium/95 font-serif-body text-base leading-relaxed pt-1">
                                {opt.b}
                              </p>

                              {/* Examples/Schools of thought */}
                              {opt.ex && opt.ex.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {opt.ex.map((item) => (
                                    <span
                                      key={item}
                                      className="font-mono-tech text-[10px] bg-stone-accent/60 text-forest-sage px-2 py-0.5 rounded-md hover:bg-stone-accent transition"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Implications and Costs */}
                              {(opt.im || opt.co) && (
                                <div className="mt-4 pt-4 border-t border-stone-border/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {opt.im && (
                                    <div className="space-y-1">
                                      <span className="font-mono-tech text-[9px] uppercase tracking-widest text-forest-light font-bold flex items-center gap-1">
                                        <GitBranch className="w-3 h-3 text-nature-teal" /> Implica
                                      </span>
                                      <p className="text-xs text-forest-sage leading-relaxed">
                                        {opt.im}
                                      </p>
                                    </div>
                                  )}
                                  {opt.co && (
                                    <div className="space-y-1">
                                      <span className="font-mono-tech text-[9px] uppercase tracking-widest text-forest-light font-bold flex items-center gap-1">
                                        <Scale className="w-3 h-3 text-nature-rose" /> Costo Filosofico
                                      </span>
                                      <p className="text-xs text-forest-sage leading-relaxed">
                                        {opt.co}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question Pager / Navigation Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-border/60">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => {
                      if (activeQuestionIndex > 0) {
                        setActiveQuestionId(Q[activeQuestionIndex - 1].id);
                      }
                    }}
                    className="flex-1 flex items-start gap-3 p-4 border border-stone-border/50 rounded-2xl bg-white hover:border-forest-sage/60 hover:bg-stone-card/25 transition text-left group disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-5 h-5 text-forest-light group-hover:-translate-x-1 transition-transform shrink-0 mt-1" />
                    <div>
                      <small className="block font-mono-tech text-[10px] uppercase tracking-widest text-forest-light mb-1">
                        Precedente
                      </small>
                      <span className="font-display font-medium text-sm text-forest-dark line-clamp-1">
                        {activeQuestionIndex > 0 ? Q[activeQuestionIndex - 1].t : "Inizio dell'Albero"}
                      </span>
                    </div>
                  </button>

                  <button
                    disabled={activeQuestionIndex === Q.length - 1}
                    onClick={() => {
                      if (activeQuestionIndex < Q.length - 1) {
                        setActiveQuestionId(Q[activeQuestionIndex + 1].id);
                      }
                    }}
                    className="flex-1 flex items-start justify-end gap-3 p-4 border border-stone-border/50 rounded-2xl bg-white hover:border-forest-sage/60 hover:bg-stone-card/25 transition text-right group disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <div>
                      <small className="block font-mono-tech text-[10px] uppercase tracking-widest text-forest-light mb-1">
                        Successiva
                      </small>
                      <span className="font-display font-medium text-sm text-forest-dark line-clamp-1">
                        {activeQuestionIndex < Q.length - 1 ? Q[activeQuestionIndex + 1].t : "Fine dell'Albero"}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-forest-light group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                  </button>
                </div>

                {/* Affinity Resonance at footer of Tree View */}
                <AffinitySection
                  profileAffinities={profileAffinities}
                  handleClearAll={handleClearAll}
                  answers={answers}
                  setActiveTab={setActiveTab}
                  setActiveQuestionId={setActiveQuestionId}
                />

              </motion.div>
            )}

            {/* TAB 2: MATRICE MINIMA (MATRIX VIEW) */}
            {activeTab === "matrix" && (
              <motion.div
                key="matrix-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 animate-fade-in"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-forest-light tracking-wider uppercase mb-2">
                    <span>§ 29</span>
                    <span className="text-stone-border">•</span>
                    <span>Le Grandi Biforcazioni</span>
                  </div>
                  <h2 className="font-display font-semibold text-3xl tracking-tight text-forest-dark">
                    Matrice Minima
                  </h2>
                  <p className="mt-3 text-forest-sage text-base max-w-3xl leading-relaxed">
                    {MATRIX.length} domande fondamentali ridotte alla loro essenza binaria con la terza uscita sempre in luce. Le celle evidenziate indicano le tue scelte correnti. Clicca sul testo di una domanda per approfondirla nella visualizzazione ad albero.
                  </p>
                </div>

                {/* Table container with nature accents */}
                <div className="border border-stone-border/60 rounded-2xl overflow-hidden bg-white shadow-xs max-w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[760px] text-sm font-sans-ui">
                    <thead>
                      <tr className="bg-stone-card/80 border-b border-stone-border/50 text-forest-sage uppercase text-[10px] tracking-wider font-mono-tech">
                        <th className="py-4 px-6 font-semibold">Domanda</th>
                        <th className="py-4 px-5 font-semibold">Risposta A</th>
                        <th className="py-4 px-5 font-semibold">Risposta B</th>
                        <th className="py-4 px-5 font-semibold">Terza Possibilità</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-border/40 text-forest-dark">
                      {MATRIX.map((row) => {
                        const question = Q.find((q) => q.id === row.qid)!;
                        const userAns = answers[row.qid];

                        return (
                          <tr key={row.qid} className="hover:bg-stone-bg/40 transition">
                            {/* Question Title Linking back to tree */}
                            <td
                              onClick={() => {
                                setActiveQuestionId(row.qid);
                                setActiveTab("tree");
                              }}
                              className="py-4.5 px-6 font-serif-body text-base cursor-pointer hover:text-nature-gold transition group max-w-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono-tech text-[10px] text-forest-light">
                                  {Q.findIndex((q) => q.id === row.qid) + 1}
                                </span>
                                <span className="group-hover:underline">{question.t}</span>
                              </div>
                            </td>

                            {/* Option Columns */}
                            {[row.a, row.b, row.c].map((optLabel, k) => {
                              const optionId = MCOL[row.qid][k];
                              const isSelected = optionId && userAns === optionId;
                              const colColor = optionColors[k % optionColors.length];

                              return (
                                <td key={k} className="py-4 px-5">
                                  {optionId ? (
                                    <button
                                      onClick={() => handleAnswerSelect(row.qid, optionId)}
                                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 font-sans-ui ${
                                        isSelected
                                          ? `${colColor.badge} ${colColor.activeBorder} font-medium scale-102 shadow-xs`
                                          : "bg-stone-card/40 hover:bg-[#EAE8DD] border-stone-border/60 text-forest-sage hover:text-forest-dark"
                                      }`}
                                    >
                                      {optLabel}
                                    </button>
                                  ) : (
                                    <span className="text-stone-border select-none">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Affinity resonance component */}
                <AffinitySection
                  profileAffinities={profileAffinities}
                  handleClearAll={handleClearAll}
                  answers={answers}
                  setActiveTab={setActiveTab}
                  setActiveQuestionId={setActiveQuestionId}
                />

              </motion.div>
            )}

            {/* TAB 3: PROFILI CLASSICI (PROFILES GRID) */}
            {activeTab === "profiles" && (
              <motion.div
                key="profiles-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 animate-fade-in"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-forest-light tracking-wider uppercase mb-2">
                    <span>§ 30</span>
                    <span className="text-stone-border">•</span>
                    <span>La Coerenza delle Scuole di Pensiero</span>
                  </div>
                  <h2 className="font-display font-semibold text-3xl tracking-tight text-forest-dark">
                    Tradizioni e Profili Filosofici
                  </h2>
                  <p className="mt-3 text-forest-sage text-base max-w-3xl leading-relaxed">
                    Ogni corrente di pensiero rappresenta una combinazione caratteristica di impegni ontologici ed etici. I cartoncini sottostanti mostrano la tua risonanza intellettuale con le grandi menti del passato. Le celle evidenziate in <span className="text-nature-gold font-semibold underline decoration-2 decoration-nature-gold/40">oro</span> indicano dove le tue risposte si sovrappongono alle loro posizioni storiche.
                  </p>
                </div>

                {/* Bento-style Grid of profiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {profileAffinities.map(({ profile, percentage, hitCount, compareCount }) => {
                    return (
                      <div
                        key={profile.n}
                        className="bg-white border border-stone-border/60 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-forest-light/60 transition-all duration-300 relative overflow-hidden group"
                      >
                        {/* Botanical green decorative accent card background */}
                        <div className="absolute right-0 top-0 w-20 h-20 bg-forest-sage/5 rounded-bl-full group-hover:bg-forest-sage/10 transition duration-500" />

                        <div>
                          {/* Header of Profile */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-display font-bold text-xl text-forest-dark flex items-center gap-2 group-hover:text-nature-gold transition">
                                <Feather className="w-4 h-4 text-forest-light shrink-0" /> {profile.n}
                              </h3>
                              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-forest-light">
                                {profile.era}
                              </span>
                            </div>

                            {/* Percentage Badge */}
                            <div className="text-right">
                              <span className="block font-mono-tech text-xl font-bold text-forest-dark">
                                {compareCount > 0 ? `${percentage}%` : "—"}
                              </span>
                              <span className="block text-[9px] font-mono-tech text-forest-light uppercase tracking-wider">
                                {compareCount > 0 ? `${hitCount}/${compareCount} match` : "Nessun dato"}
                              </span>
                            </div>
                          </div>

                          {/* Matching bar */}
                          <div className="w-full bg-stone-bg border border-stone-border/40 h-2 rounded-full overflow-hidden mb-5">
                            <div
                              className="h-full bg-gradient-to-r from-forest-light to-nature-gold transition-all duration-1000"
                              style={{ width: `${compareCount > 0 ? percentage : 0}%` }}
                            />
                          </div>

                          {/* Sample Positions defined by this profile */}
                          <div className="space-y-2.5">
                            <span className="block font-mono-tech text-[9px] uppercase tracking-widest text-forest-light font-bold">
                              Posizioni Rilevanti:
                            </span>
                            <ul className="space-y-1.5 font-sans-ui text-xs text-forest-medium">
                              {Object.keys(profile.m).slice(0, 7).map((qid) => {
                                const question = Q.find((q) => q.id === qid)!;
                                const optionCode = profile.m[qid];
                                const option = question.o.find((opt) => opt.id === optionCode)!;
                                const isMatchedWithUser = answers[qid] === optionCode;

                                return (
                                  <li
                                    key={qid}
                                    className={`flex items-center justify-between gap-2.5 py-1 px-2 rounded transition ${
                                      isMatchedWithUser
                                        ? "bg-nature-gold/5 border border-nature-gold/20"
                                        : "bg-transparent border border-transparent"
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="font-mono-tech text-[9px] text-forest-light bg-stone-accent/60 px-1 py-0.5 rounded uppercase">
                                        {question.c}
                                      </span>
                                      <span className="truncate italic">
                                        {question.t}
                                      </span>
                                    </div>
                                    <span
                                      className={`font-mono-tech font-semibold uppercase text-[10px] shrink-0 ${
                                        isMatchedWithUser
                                          ? "text-nature-gold"
                                          : "text-forest-sage"
                                      }`}
                                    >
                                      {option.l}
                                    </span>
                                  </li>
                                );
                              })}
                              {Object.keys(profile.m).length > 7 && (
                                <li className="text-[10px] font-mono-tech text-forest-light text-center pt-1.5">
                                  + altri {Object.keys(profile.m).length - 7} impegni filosofici
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Card metadata info */}
                        <div className="mt-5 pt-4 border-t border-stone-border/40 flex items-center justify-between text-[10px] font-mono-tech text-forest-light">
                          <span>{Object.keys(profile.m).length} posizioni note</span>
                          {compareCount > 0 && percentage >= 70 && (
                            <span className="text-nature-teal font-semibold flex items-center gap-1 uppercase tracking-widest">
                              <Award className="w-3 h-3" /> Forte risonanza
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 4: MAPPA DEI FILOSOFI */}
            {enableCommunity && activeTab === "map" && (
              <motion.div
                key="map-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 animate-fade-in"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-forest-light tracking-wider uppercase mb-2">
                    <span>§ 31</span>
                    <span className="text-stone-border">•</span>
                    <span>La Geografia del Pensiero</span>
                  </div>
                  <h2 className="font-display font-semibold text-3xl tracking-tight text-forest-dark">
                    Mappa dei Filosofi
                  </h2>
                  <p className="mt-3 text-forest-sage text-base max-w-3xl leading-relaxed">
                    Le otto tradizioni disposte su due assi interpretativi —{" "}
                    <em>Immanenza / Trascendenza</em> e <em>Ragione / Esperienza</em>.
                    Il tuo punto è il baricentro delle tue affinità: più rispondi, più si assesta.
                  </p>
                </div>
                <PhilosopherMap
                  profileAffinities={profileAffinities}
                  communityPoints={communityPoints}
                />
              </motion.div>
            )}

            {/* TAB 5: CLASSIFICHE */}
            {enableCommunity && activeTab === "ranking" && (
              <motion.div
                key="ranking-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 animate-fade-in"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-forest-light tracking-wider uppercase mb-2">
                    <span>§ 32</span>
                    <span className="text-stone-border">•</span>
                    <span>La Gratificazione Immediata</span>
                  </div>
                  <h2 className="font-display font-semibold text-3xl tracking-tight text-forest-dark">
                    Classifiche
                  </h2>
                  <p className="mt-3 text-forest-sage text-base max-w-3xl leading-relaxed">
                    I top 10 per risonanza col proprio profilo dominante — dell&apos;anno, del mese,
                    della settimana e di oggi. Filtra per tradizione per scoprire i migliori
                    Darwinisti, Platonici o Buddhisti del momento.
                  </p>
                </div>
                <Leaderboard
                  dominantProfileName={
                    profileAffinities[0]?.compareCount > 0 ? profileAffinities[0].profile.n : null
                  }
                  dominantPercentage={profileAffinities[0]?.percentage ?? 0}
                  answeredCount={Object.keys(answers).length}
                  responsesEncoded={encodeAnswers(answers, Q)}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-card border-t border-stone-border/80 py-12 mt-16 text-center text-xs text-forest-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 font-serif-body text-base">
          <p className="max-w-2xl mx-auto text-forest-medium/90">
            « La filosofia e la scienza non sono risposte assolute, ma la cura metodica delle domande fondamentali attraverso la biforcazione delle alternative umane. »
          </p>
          <div className="pt-4 font-mono-tech text-[10px] uppercase tracking-widest text-forest-light space-x-4">
            <span>Albero delle Alternative</span>
            <span className="text-stone-border">•</span>
            <span>Estetica Minimalista e Naturale</span>
            <span className="text-stone-border">•</span>
            <span>AI Redesign 2026</span>
            <span className="text-stone-border">•</span>
            <span>
              Autore:{" "}
              <a
                href="https://michelepolo.github.io/Journey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-sage hover:text-nature-gold underline decoration-forest-light/40 hover:decoration-nature-gold transition-colors"
              >
                Michele Polo
              </a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANLINESS ---

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredClusters: any[];
  activeQuestionId: string;
  setActiveQuestionId: (id: string) => void;
  setActiveTab: (tab: any) => void;
  answers: Record<string, string>;
  onSelectClose: () => void;
}

function SidebarContent({
  searchQuery,
  setSearchQuery,
  filteredClusters,
  activeQuestionId,
  setActiveQuestionId,
  setActiveTab,
  answers,
  onSelectClose
}: SidebarProps) {
  const { Q } = useVariant().dataset;
  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forest-light pointer-events-none" />
        <input
          type="text"
          value={searchQuery === " " ? "" : searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca una domanda..."
          className="w-full pl-9 pr-8 py-2 border border-stone-border bg-white rounded-xl text-xs font-sans-ui text-forest-dark placeholder-forest-light focus:outline-hidden focus:ring-1 focus:ring-forest-sage focus:border-forest-sage transition"
        />
        {searchQuery.trim() !== "" && (
          <button
            onClick={() => setSearchQuery(" ")}
            className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 rounded hover:bg-stone-accent"
          >
            <X className="w-3.5 h-3.5 text-forest-light" />
          </button>
        )}
      </div>

      {/* Categories list */}
      <div className="space-y-4 overflow-y-auto flex-1 pr-1" id="sidebar-scroller">
        {filteredClusters.map((cluster) => {
          const matchingQs = cluster.questions || Q.filter((q) => q.c === cluster.id);
          const answeredCount = matchingQs.filter((q: any) => !!answers[q.id]).length;
          const totalCount = matchingQs.length;

          return (
            <div key={cluster.id} className="space-y-1.5">
              {/* Cluster Header */}
              <div className="flex items-center justify-between px-2 py-1 bg-stone-accent/35 rounded-lg border border-stone-border/30">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-4.5 h-4.5 bg-forest-sage text-[#FAF9F5] rounded text-[9px] font-mono-tech uppercase font-bold flex items-center justify-center shrink-0">
                    {cluster.id}
                  </span>
                  <span className="font-display font-semibold text-xs text-forest-medium truncate">
                    {cluster.name}
                  </span>
                </div>
                <span className="font-mono-tech text-[10px] text-forest-light font-medium shrink-0">
                  {answeredCount}/{totalCount}
                </span>
              </div>

              {/* Questions within cluster */}
              <div className="space-y-0.5 pl-1">
                {matchingQs.map((q: Question) => {
                  const globalIndex = Q.findIndex((item) => item.id === q.id) + 1;
                  const isActive = activeQuestionId === q.id;
                  const isAnswered = !!answers[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQuestionId(q.id);
                        setActiveTab("tree");
                        onSelectClose();
                      }}
                      className={`w-full text-left flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg transition text-xs font-sans-ui ${
                        isActive
                          ? "bg-forest-sage text-white font-medium"
                          : "text-forest-medium hover:bg-stone-accent/60 hover:text-forest-dark"
                      }`}
                    >
                      <span
                        className={`font-mono-tech text-[9px] shrink-0 mt-0.5 ${
                          isActive ? "text-white/80" : "text-forest-light"
                        }`}
                      >
                        {String(globalIndex).padStart(2, "0")}
                      </span>
                      <span className="flex-1 truncate line-clamp-2 leading-tight">
                        {q.t}
                      </span>
                      {isAnswered && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isActive ? "text-white" : "text-nature-teal"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredClusters.length === 0 && (
          <p className="text-center text-xs text-forest-light py-8 font-sans-ui italic">
            Nessun risultato corrispondente.
          </p>
        )}
      </div>
    </div>
  );
}

// --- SHARE BUTTON ("Condividi il TUO 42") ---

function ShareButton({
  answers,
  answeredCount
}: {
  answers: Record<string, string>;
  answeredCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const variant = useVariant();
  const { PROFILES, Q } = variant.dataset;

  const buildShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    let target = base;

    // Solo la versione legacy ha le pagine share statiche per-profilo con
    // anteprima Open Graph: il profilo dominante decide quale pagina linkare.
    if (variant.useProfileSharePages) {
      let best: { name: string; pct: number } | null = null;
      PROFILES.forEach((profile) => {
        let hit = 0;
        let cmp = 0;
        Object.keys(answers).forEach((qid) => {
          const choice = profile.m[qid];
          if (choice) {
            cmp++;
            if (choice === answers[qid]) hit++;
          }
        });
        const pct = cmp > 0 ? hit / cmp : -1;
        if (pct >= 0 && (!best || pct > best.pct)) best = { name: profile.n, pct };
      });
      const slug = best
        ? (SHARE_PROFILES as Record<string, { slug: string }>)[best.name]?.slug
        : undefined;
      if (slug) target = `${base}share/${slug}/`;
    }

    const url = new URL(target);
    url.searchParams.set("responses", encodeAnswers(answers, Q));
    url.searchParams.set("v", variant.shareVersion);
    // Preserva l'eventuale hash (es. #reale): serve alla home tematica per
    // riaprire il percorso giusto prima che App importi le risposte.
    url.hash = window.location.hash;
    return url.toString();
  };

  const handleShare = async () => {
    const shareUrl = buildShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable (e.g. insecure context): let the user copy manually
      window.prompt("Copia il link per condividere il tuo 42:", shareUrl);
    }
  };

  return (
    <button
      onClick={handleShare}
      title={`Condivide un link con le tue ${answeredCount} risposte su ${Q.length}`}
      className={`text-xs font-mono-tech transition flex items-center gap-1.5 uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
        copied
          ? "text-nature-teal border-nature-teal/40 bg-nature-teal/5"
          : "text-forest-sage border-stone-border/70 hover:text-forest-dark hover:border-forest-sage/60 bg-white"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" /> Link copiato
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" /> Condividi il TUO 42
          <span className="text-forest-light normal-case">({answeredCount}/{Q.length})</span>
        </>
      )}
    </button>
  );
}

// --- AFFINITY RESONANCE PANEL ---

interface AffinityProps {
  profileAffinities: any[];
  handleClearAll: () => void;
  answers: Record<string, string>;
  setActiveTab: (tab: any) => void;
  setActiveQuestionId: (id: string) => void;
}

function AffinitySection({
  profileAffinities,
  handleClearAll,
  answers,
  setActiveTab,
  setActiveQuestionId
}: AffinityProps) {
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-stone-card rounded-2xl border border-stone-border/60 p-6 md:p-8 mt-12 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-border/50 pb-4 mb-4">
        <div>
          <h3 className="font-display font-semibold text-xl text-forest-dark flex items-center gap-2">
            <Flame className="w-5 h-5 text-nature-gold shrink-0 animate-pulse" /> La Tua Risonanza Intellettuale
          </h3>
          <p className="text-xs text-forest-sage mt-1 font-sans-ui">
            {answeredCount === 0
              ? "Effettua le tue scelte per misurare la risonanza del tuo pensiero con le 8 grandi tradizioni filosofiche."
              : `Calcolata in tempo reale sulle ${answeredCount} ${
                  answeredCount === 1 ? "risposta data" : "risposte date"
                }.`}
          </p>
        </div>
        {answeredCount > 0 && (
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <ShareButton answers={answers} answeredCount={answeredCount} />
            <button
              onClick={handleClearAll}
              className="text-xs text-nature-rose hover:text-earth-clay font-mono-tech transition flex items-center gap-1.5 uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Scelte
            </button>
          </div>
        )}
      </div>

      {/* Grid of affinities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {profileAffinities.map(({ profile, percentage, compareCount }) => {
          const hasData = compareCount > 0;
          return (
            <div
              key={profile.n}
              onClick={() => {
                setActiveTab("profiles");
              }}
              className="bg-white border border-stone-border/40 p-4 rounded-xl hover:border-forest-light/60 cursor-pointer transition-all hover:translate-y-[-1px] space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="block font-display font-bold text-sm text-forest-dark line-clamp-1">
                  {profile.n}
                </span>
                <span className="block text-[9px] font-mono-tech text-forest-light tracking-wide">
                  {profile.era}
                </span>
              </div>

              {/* Matching status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-forest-medium">
                  <span>Match:</span>
                  <span className="font-semibold">{hasData ? `${percentage}%` : "—"}</span>
                </div>

                <div className="w-full bg-stone-bg border border-stone-border/30 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-light to-nature-gold transition-all duration-700"
                    style={{ width: `${hasData ? percentage : 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
