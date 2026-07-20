import { useState, useMemo, useEffect } from "react";
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
  Feather,
  GitBranch,
  Flame,
  Award
} from "lucide-react";

import {
  CLUSTERS,
  Q,
  MATRIX,
  MCOL,
  PROFILES,
  Question,
  Option,
  Profile
} from "./data";

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"intro" | "tree" | "matrix" | "profiles">("intro");
  const [activeQuestionId, setActiveQuestionId] = useState<string>("q1");
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
      setAnswers({});
    }
  };

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

  // Real-time calculation of affinity with 8 profiles
  const profileAffinities = useMemo(() => {
    const totalAnswered = Object.keys(answers).length;

    return PROFILES.map((profile) => {
      let hitCount = 0;
      let compareCount = 0;

      // Only count questions where the user has provided an answer AND the profile defines a position
      Object.keys(answers).forEach((qid) => {
        const profileChoice = profile.m[qid];
        if (profileChoice) {
          compareCount++;
          if (profileChoice === answers[qid]) {
            hitCount++;
          }
        }
      });

      const percentage = compareCount > 0 ? Math.round((hitCount / compareCount) * 100) : 0;

      return {
        profile,
        percentage,
        hitCount,
        compareCount,
        totalAnswered
      };
    }).sort((a, b) => b.percentage - a.percentage || b.compareCount - a.compareCount);
  }, [answers]);

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

  // Botanical background color mapping for option cards
  const optionColors = [
    {
      theme: "earth-ochre",
      border: "border-earth-ochre/30 hover:border-earth-ochre/70",
      activeBg: "bg-earth-ochre/10",
      activeBorder: "border-earth-ochre",
      badge: "bg-earth-ochre text-white",
      text: "text-earth-ochre",
    },
    {
      theme: "nature-teal",
      border: "border-nature-teal/30 hover:border-nature-teal/70",
      activeBg: "bg-nature-teal/10",
      activeBorder: "border-nature-teal",
      badge: "bg-nature-teal text-white",
      text: "text-nature-teal",
    },
    {
      theme: "nature-violet",
      border: "border-nature-violet/30 hover:border-nature-violet/70",
      activeBg: "bg-nature-violet/10",
      activeBorder: "border-nature-violet",
      badge: "bg-nature-violet text-white",
      text: "text-nature-violet",
    },
    {
      theme: "nature-rose",
      border: "border-nature-rose/30 hover:border-nature-rose/70",
      activeBg: "bg-nature-rose/10",
      activeBorder: "border-nature-rose",
      badge: "bg-nature-rose text-white",
      text: "text-nature-rose",
    },
    {
      theme: "nature-sky",
      border: "border-nature-sky/30 hover:border-nature-sky/70",
      activeBg: "bg-nature-sky/10",
      activeBorder: "border-nature-sky",
      badge: "bg-nature-sky text-white",
      text: "text-nature-sky",
    }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-stone-bg flex flex-col selection:bg-forest-pale/40 selection:text-forest-dark font-body">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-stone-bg/90 backdrop-blur-md border-b border-stone-border/70">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
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

          {/* Navigation Tabs */}
          <div className="flex bg-stone-accent/60 p-1 rounded-xl border border-stone-border/80 w-full lg:w-auto overflow-x-auto lg:overflow-x-hidden whitespace-nowrap">
            {[
              { id: "intro", label: "Introduzione", icon: BookOpen },
              { id: "tree", label: "Albero", icon: Sprout },
              { id: "matrix", label: "Matrice", icon: Layers },
              { id: "profiles", label: "Profili", icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-sans-ui text-xs font-medium uppercase tracking-wider transition shrink-0 ${
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
        <main className="w-full min-w-0" id="main-content">
          
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
                      A seguire un'operazione insiemistica: <strong>37 domande</strong> cercheranno di individuare il Tuo centro, il Tuo personale <strong>42</strong>.
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
                              ? `${colorConfig.activeBorder} ${colorConfig.activeBg} shadow-sm ring-1 ring-offset-2 ring-offset-[#FAF9F5] ${
                                  idx === 0 ? "ring-earth-ochre/35" : idx === 1 ? "ring-nature-teal/35" : idx === 2 ? "ring-nature-violet/35" : idx === 3 ? "ring-nature-rose/35" : "ring-nature-sky/35"
                                }`
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
                    Ventidue domande fondamentali ridotte alla loro essenza binaria con la terza uscita sempre in luce. Le celle evidenziate indicano le tue scelte correnti. Clicca sul testo di una domanda per approfondirla nella visualizzazione ad albero.
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
          <button
            onClick={handleClearAll}
            className="text-xs text-nature-rose hover:text-earth-clay font-mono-tech transition flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Scelte
          </button>
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
