// Dataset "Completa" — derivato dall'analisi "Visioni del mondo, della vita
// e dell'uomo" (file nella root del repo). 10 cluster / 31 domande:
// i cluster O,D,S,R,E,V,M,U,K seguono gli assi del documento (§3–§10, §13);
// il cluster C (Il Cosmo) conserva le 5 domande cosmologiche della versione
// precedente ("light", src/data.ts), che resta disponibile e intatta.
// I testi delle domande corrispondenti alla vecchia versione sono riusati
// per non perdere dati, citazioni né autori.

import { Cluster, Question, MatrixRow, Profile } from "./data";

export const CLUSTERS_V2: Cluster[] = [
  { id: "o", name: "Il Fondamento", gloss: "quante realtà fondamentali?" },
  { id: "d", name: "Il Principio e il Divino", gloss: "da dove deriva il mondo?" },
  { id: "s", name: "La Struttura", gloss: "di che cosa è composto il reale?" },
  { id: "r", name: "Realtà e conoscente", gloss: "il mondo esiste senza di noi?" },
  { id: "e", name: "Le vie della conoscenza", gloss: "ragione, esperienza, metodo, intuizione" },
  { id: "v", name: "La Vita", gloss: "che cosa distingue il vivente?" },
  { id: "m", name: "La Mente", gloss: "coscienza, computazione, anima" },
  { id: "u", name: "L'Essere Umano", gloss: "organismo, persona, esistenza" },
  { id: "c", name: "Il Cosmo", gloss: "origine, fine, legge, caso" },
  { id: "k", name: "Simbolo e Sacro", gloss: "le quattro tesi sul significato" }
];

export const Q_V2: Question[] = [
  // ============ O — IL FONDAMENTO (§3) ============
  {
    id: "o1",
    c: "o",
    t: "Quanti fondamenti possiede il reale?",
    f: "𝓞₍₁₎ | 𝓞₍₂₎ | 𝓞₍ₙ₎",
    note: "Il primo asse dell'analisi: monismo, dualismo, pluralismo. Una stessa dottrina può appartenere a più insiemi.",
    g: "Criterio pratico per decidere: il monismo è più economico e paga il conto sulle differenze qualitative — come fa la materia a sentire? Il dualismo rispetta l'esperienza e paga sull'interazione — dove esattamente si toccano? Il pluralismo è il più fedele ai fenomeni e il meno unificato. Nessuna delle tre è gratis: scegli quale debito preferisci.",
    an: "Un solo tipo primitivo con tutto derivato, due tipi non convertibili, oppure molti tipi primitivi. Il primo è elegante finché non devi rappresentare qualcosa che non ci sta dentro.",
    o: [
      {
        id: "a",
        l: "Monismo",
        f: "𝓞₍₁₎ = { il reale possiede un solo fondamento }",
        b: "Un solo tipo di realtà fondamentale, da cui ogni differenza è derivata.",
        ex: ["Parmenide", "Spinoza", "Hegel", "fisicalismo"],
        im: "Che ogni differenza sia derivata, non fondamentale.",
        co: "Le qualità dell'esperienza restano difficili da ricavare dal principio unico."
      },
      {
        id: "b",
        l: "Dualismo",
        f: "𝓞₍₂₎ : mente ≢ materia",
        b: "Due ordini fondamentali irriducibili: res extensa e res cogitans, materia e mente.",
        ex: ["Cartesio", "platonismo (in parte)", "dualismo delle proprietà"],
        im: "Due generi irriducibili l'uno all'altro.",
        co: "Il problema dell'interazione causale non ha mai ricevuto una soluzione soddisfacente."
      },
      {
        id: "c",
        l: "Pluralismo",
        f: "𝓞₍ₙ₎ = { molti principi irriducibili }",
        b: "Molti principi o generi di enti fondamentali, fino ai livelli di realtà.",
        ex: ["radici di Empedocle", "semi e Nous di Anassagora", "atomi di Democrito", "monadi di Leibniz"],
        im: "Che il reale non sia riducibile a un principio.",
        co: "Rinunci al potere unificante che è il motivo per cui si fa metafisica."
      }
    ]
  },
  {
    id: "o2",
    c: "o",
    t: "Se il fondamento è uno, di che natura è?",
    f: "Mondo → materia | spirito | X",
    note: "Le tre grandi famiglie del monismo: materialista, idealista, neutrale.",
    g: "La scelta decide da dove parte la spiegazione: dal basso — materia → vita → mente → cultura — o dall'alto — Spirito → natura → coscienza finita. Il monismo neutrale è la mossa più sottile: mente e materia come due organizzazioni dello stesso fondamento X, che non è originariamente né l'una né l'altra. Elegante, ma poi devi dire che cos'è X senza usare i termini che volevi derivare.",
    an: "Stack che parte dall'hardware, stack che parte dal modello, oppure un'unica sorgente compilata in due target: fisico e mentale.",
    o: [
      {
        id: "a",
        l: "Monismo materialista",
        f: "materia → vita → mente → coscienza → cultura",
        b: "Tutto ciò che esiste è materiale o fisico; le proprietà superiori sono aggregati, funzioni o proprietà emergenti.",
        ex: ["Leucippo", "Democrito", "epicureismo", "fisicalismo", "naturalismo scientifico"],
        im: "Nessun ordine di realtà oltre il fisico.",
        co: "Coscienza e significato restano i casi più ostici da derivare."
      },
      {
        id: "b",
        l: "Monismo idealista",
        f: "Spirito o Idea → natura → coscienza finita",
        b: "La realtà fondamentale non è la materia ma una dimensione mentale, spirituale o ideale.",
        ex: ["letture di Parmenide e Platone", "Berkeley", "idealismo tedesco", "Hegel"],
        im: "Che la natura sia manifestazione dello spirito.",
        co: "Devi spiegare la resistenza e la regolarità del mondo fisico."
      },
      {
        id: "c",
        l: "Monismo neutrale",
        f: "X → aspetto fisico + aspetto mentale",
        b: "Il fondamento X non è originariamente né mentale né materiale: mente e materia sono due sue organizzazioni.",
        ex: ["Spinoza (letture)", "William James", "Russell", "informazione ontologica"],
        im: "Che soggetto e oggetto siano derivati da un campo unico.",
        co: "Difficile dire che cosa sia X senza usare i termini che volevi derivare."
      }
    ]
  },
  {
    id: "o3",
    c: "o",
    t: "Come interagiscono mente e corpo?",
    f: "mente ↔ corpo",
    note: "Nel dualismo forte il problema centrale diventa l'interazione fra i due ordini.",
    g: "È il tallone d'Achille di ogni dualismo e il test di serietà di ogni monismo. Se mente e corpo sono due sostanze, serve un punto di contatto che non appartenga a nessuna delle due; se il problema ti sembra insolubile, forse la colpa è della premessa: non due cose che devono toccarsi, ma una realtà descritta in due vocabolari.",
    an: "Due processi che comunicano hanno bisogno di un canale; se il canale non può esistere, forse erano lo stesso processo con due interfacce.",
    o: [
      {
        id: "a",
        l: "Interazione causale",
        f: "mente → corpo ∧ corpo → mente",
        b: "I due ordini si influenzano realmente: le decisioni muovono il corpo, il corpo condiziona la mente.",
        ex: ["Cartesio", "dualismo interazionista"],
        im: "Che il mentale abbia potere causale sul fisico.",
        co: "Dove e come avvenga il contatto non è mai stato spiegato."
      },
      {
        id: "b",
        l: "Parallelismo",
        f: "mente ∥ corpo",
        b: "I due ordini procedono coordinati senza influenzarsi causalmente.",
        ex: ["Leibniz (armonia prestabilita)", "occasionalismo"],
        im: "Una coordinazione da giustificare senza contatto.",
        co: "Serve un garante esterno della sincronia, e questo sposta il problema."
      },
      {
        id: "c",
        l: "Il problema è mal posto",
        f: "¬(due sostanze) ⇒ ¬(problema dell'interazione)",
        b: "Mente e corpo non sono due cose: sono due descrizioni o due aspetti della stessa realtà.",
        ex: ["Spinoza", "monismo del doppio aspetto"],
        im: "Che la domanda vada dissolta, non risolta.",
        co: "Resta da spiegare perché le due descrizioni siano così diverse."
      }
    ]
  },

  // ============ D — IL PRINCIPIO E IL DIVINO (§4, §7.5) ============
  {
    id: "d1",
    c: "d",
    t: "Il fondamento del mondo è interno o esterno al mondo?",
    f: "fondamento ⊆ mondo | fondamento ⊄ mondo",
    note: "L'asse della dipendenza ontologica: immanentismo e trascendentismo, con panteismo e panenteismo come casi di confine.",
    g: "È la domanda sul confine. Se il principio è interno, il mondo non richiede una causa esterna e la natura è già tutto; se il mondo dipende da qualcosa che lo oltrepassa, resta il problema del contatto. Panteismo e panenteismo tengono insieme le due esigenze in modi diversi: il primo chiude la distanza, il secondo la conserva dentro Dio.",
    an: "Contenitore, contenuto, oppure contenuto che eccede il contenitore. Tre relazioni di appartenenza diverse, con conseguenze diverse su che cosa può accadere dentro.",
    o: [
      {
        id: "a",
        l: "Immanentismo",
        f: "fondamento del mondo ⊆ mondo",
        b: "Il principio della realtà è interno alla realtà stessa: il mondo non richiede una causa esterna.",
        ex: ["naturalismo", "materialismo", "Spinoza", "processualismo", "auto-organizzazione"],
        im: "Che ogni spiegazione resti interna alla natura.",
        co: "Resta aperto perché ci sia qualcosa invece di nulla, e perché proprio queste leggi."
      },
      {
        id: "b",
        l: "Trascendentismo",
        f: "mondo ⇐ ciò che lo oltrepassa",
        b: "Il mondo dipende da qualcosa che lo eccede: Dio, l'Uno, l'Assoluto.",
        ex: ["teismo classico", "neoplatonismo"],
        im: "Che il mondo non basti a spiegare se stesso.",
        co: "Come fa il totalmente altro a toccare il mondo senza diventarne parte?"
      },
      {
        id: "c",
        l: "Panteismo",
        f: "Dio = Natura",
        b: "Il divino non è esterno al mondo: natura e divino sono la stessa realtà.",
        ex: ["Spinoza — Deus sive Natura", "stoicismo"],
        im: "Che la natura sia l'unica cosa che c'è, e sia divina.",
        co: "Difficile distinguerlo da un ateismo con vocabolario religioso."
      },
      {
        id: "d",
        l: "Panenteismo",
        f: "mondo ⊂ Dio ∧ Dio ≠ solo il mondo",
        b: "Il mondo è in Dio, ma Dio eccede il mondo.",
        ex: ["teologia del processo", "alcune mistiche"],
        im: "Che il mondo sia reale in Dio senza esaurirlo.",
        co: "Il rapporto fra i due termini resta difficile da precisare."
      }
    ]
  },
  {
    id: "d2",
    c: "d",
    t: "Come procede il mondo dal principio?",
    f: "𝒟⁺ → W",
    note: "Creazionismo, emanazionismo e demiurgismo vanno distinti: non sono lo stesso modello causale.",
    g: "Quattro modelli causali diversi, e ciascuno decide quanto il mondo sia contingente. La creazione introduce discontinuità e libertà; l'emanazione introduce gradi e continuità necessaria; l'ordinamento demiurgico presuppone una materia già data e limita la responsabilità del principio; l'immanenza dissolve il problema chiudendo la distanza.",
    an: "Istanziare da zero, derivare per livelli successivi, compilare da sorgenti preesistenti, oppure riconoscere che sorgente ed eseguibile sono la stessa cosa vista in due modi.",
    o: [
      {
        id: "a",
        l: "Creazione",
        f: "Dio —creazione→ mondo",
        b: "Il mondo non è Dio e dipende da un atto creatore libero.",
        ex: ["creazionismo metafisico", "teologia classica"],
        im: "Un atto libero, e quindi la contingenza radicale del mondo.",
        co: "Che cosa significa causare l'esistenza, e non solo la forma?"
      },
      {
        id: "b",
        l: "Emanazione",
        f: "Uno → Intelletto → Anima → mondo",
        b: "Il molteplice procede dall'Uno per gradi successivi di realtà.",
        ex: ["Plotino", "neoplatonismo"],
        im: "Una gerarchia continua di gradi di realtà.",
        co: "Se tutto procede necessariamente, il principio non è libero."
      },
      {
        id: "c",
        l: "Ordinamento demiurgico",
        f: "Demiurgo + modelli intelligibili + materia → cosmo ordinato",
        b: "Il Demiurgo non crea dal nulla: ordina un materiale preesistente secondo modelli intelligibili. Non coincide col Dio creatore della teologia cristiana.",
        ex: ["il Timeo di Platone"],
        im: "Un limite alla potenza del principio: la materia resiste.",
        co: "Da dove viene la materia preesistente?"
      },
      {
        id: "d",
        l: "Non ne procede",
        f: "fondamento ⊆ mondo",
        b: "Non c'è alcun atto originante distinto: il mondo non richiede una causa esterna.",
        ex: ["Spinoza", "naturalismo"],
        im: "Nessuna origine da spiegare.",
        co: "Sparisce ogni distinzione fra fondamento e fondato."
      }
    ]
  },
  {
    id: "d3",
    c: "d",
    t: "Che rapporto c'è tra fede e ragione?",
    f: "fede > ragione | fede ∥ ragione | fede + ragione | ragione → ¬rivelazione",
    note: "Nelle teologie classiche fede e ragione non sono sempre antagoniste.",
    g: "Quattro relazioni possibili, e nessuna è banale. La subordinazione della ragione protegge il mistero e paga in dialogo; la separazione degli ambiti dà pace ai due contendenti e lascia scoperta la zona di frontiera; l'alleanza è il programma delle teologie classiche; la negazione razionalista deve a sua volta giustificare il proprio criterio.",
    an: "Due sistemi: uno può fare override dell'altro, possono girare in namespace separati, integrarsi via API, oppure uno dichiara l'altro deprecato.",
    o: [
      {
        id: "a",
        l: "La fede eccede la ragione",
        f: "fede > ragione",
        b: "Le verità ultime superano ciò che la ragione può stabilire da sola.",
        ex: ["fideismo", "Tertulliano", "Kierkegaard"],
        im: "Un accesso alla verità non subordinato all'argomento.",
        co: "Come distingui la fede autentica dalla credulità, senza tornare alla ragione?"
      },
      {
        id: "b",
        l: "Ambiti paralleli",
        f: "fede ∥ ragione",
        b: "Fede e ragione rispondono a domande diverse e non confliggono se restano nei rispettivi ambiti.",
        ex: ["dottrina dei magisteri non sovrapposti"],
        im: "Pace fra i due, al prezzo della separazione.",
        co: "I confini fra gli ambiti sono proprio il punto conteso."
      },
      {
        id: "c",
        l: "Alleate",
        f: "fede + ragione",
        b: "La ragione prepara, chiarisce e difende ciò che la fede accoglie.",
        ex: ["Agostino", "Tommaso d'Aquino", "teologia classica"],
        im: "Che credere e capire si rafforzino a vicenda.",
        co: "Nei conflitti concreti una delle due deve comunque cedere."
      },
      {
        id: "d",
        l: "La ragione nega la rivelazione",
        f: "ragione → negazione della rivelazione",
        b: "L'esame razionale conduce a rifiutare ogni conoscenza rivelata.",
        ex: ["razionalismo illuminista", "critica della religione"],
        im: "Solo la ragione come tribunale della verità.",
        co: "Anche questo criterio esclusivo va giustificato, e non può autogiustificarsi."
      }
    ]
  },

  // ============ S — LA STRUTTURA DEL REALE (§5) ============
  {
    id: "s1",
    c: "s",
    t: "Di che cosa è fatto, in ultima analisi, il mondo?",
    f: "Mondo → { sostanze | atomi | forma+materia | processi | informazione }",
    note: "L'atomismo filosofico antico non coincide con la fisica atomica moderna: l'idea comune è la riduzione del complesso a unità fondamentali.",
    g: "Cinque candidati al ruolo di mattone ultimo, e la scelta cambia che cosa significhi « spiegare ». Le sostanze permangono nei mutamenti; le unità elementari riducono il complesso al semplice; la forma rende una cosa il tipo di cosa che è; i processi fanno degli enti stabilizzazioni temporanee; l'informazione fa del reale differenze e relazioni codificabili.",
    an: "Oggetti con identità, primitive indivisibili, tipo + istanza, event stream, oppure puri bit: cinque modelli di dati per lo stesso dominio.",
    o: [
      {
        id: "a",
        l: "Sostanze",
        f: "sostanza = ciò che permane attraverso i mutamenti",
        b: "Le cose hanno un nucleo che resta mentre le proprietà mutano.",
        ex: ["sostanze aristoteliche", "materia e mente cartesiane", "sostanza unica spinoziana", "monadi leibniziane"],
        im: "Che ci sia un portatore delle proprietà.",
        co: "La sostanza non si osserva mai: si postula sotto le proprietà osservate."
      },
      {
        id: "b",
        l: "Unità elementari",
        f: "Mondo → { unità elementari }",
        b: "Atomi, particelle, campi quantistici, eventi elementari, bit o qubit: il complesso ridotto a unità fondamentali.",
        ex: ["atomi antichi", "particelle della fisica", "campi quantistici", "ontologie informazionali"],
        im: "Che spiegare sia scomporre fino al semplice.",
        co: "La composizione — perché le unità formino proprio questi interi — resta da spiegare."
      },
      {
        id: "c",
        l: "Materia e forma",
        f: "ente concreto = materia + forma",
        b: "La forma non è la configurazione geometrica: è il principio che rende una cosa il tipo di cosa che è. Un organismo non è un mucchio di materia.",
        ex: ["Aristotele", "ilemorfismo"],
        im: "Che il tipo preceda l'aggregato.",
        co: "Che statuto hanno le forme, se non sono né materia né idea separata?"
      },
      {
        id: "d",
        l: "Processi",
        f: "enti = stabilizzazioni temporanee di processi",
        b: "La realtà fondamentale non è fatta di cose statiche ma di trasformazioni: ciò che chiamiamo oggetto è un ritmo lento.",
        ex: ["Eraclito", "Bergson", "Whitehead", "fisica relazionale", "sistemi dinamici"],
        im: "Che la stabilità sia un effetto, non un dato di partenza.",
        co: "Se tutto scorre, perché parliamo con tanto successo di cose che restano?"
      },
      {
        id: "e",
        l: "Informazione",
        f: "informazione → materia, vita, mente",
        b: "Nella versione forte l'informazione è il fondamento del reale: materia e mente sono strutture informative.",
        ex: ["it from bit", "ontologie informazionali"],
        im: "Che il reale sia differenze e relazioni codificabili.",
        co: "Informazione per chi? Senza un interprete il concetto rischia di svuotarsi."
      }
    ]
  },
  {
    id: "s2",
    c: "s",
    t: "Un ente complesso è la somma delle sue parti?",
    f: "organismo ≠ Σ parti ?",
    note: "Per Aristotele un organismo non è un mucchio di materia, ma materia organizzata da una forma vitale.",
    g: "La domanda distingue tre gradi di impegno: riduzione completa, emergenza di proprietà dall'organizzazione, priorità del tutto sulle parti. Non è un esercizio astratto: decide se la spiegazione delle componenti basta a spiegare il sistema — in biologia, in psicologia, in sociologia.",
    an: "Conoscere ogni funzione di un sistema non ti dà l'architettura. La riduzione al modulo è vera e insufficiente: manca il livello in cui il sistema mantiene se stesso.",
    o: [
      {
        id: "a",
        l: "Sì, un aggregato",
        f: "tutto = Σ parti",
        b: "Il complesso è riducibile alle componenti e alle loro interazioni.",
        ex: ["riduzionismo", "atomismo"],
        im: "Che spiegare le parti sia spiegare il tutto.",
        co: "L'organizzazione resta da spiegare, non solo da elencare componente per componente."
      },
      {
        id: "b",
        l: "No: proprietà emergenti",
        f: "tutto > Σ parti",
        b: "Dall'organizzazione nascono proprietà che le parti isolate non possiedono.",
        ex: ["emergentismo", "sistemi complessi"],
        im: "Che il livello del tutto abbia potere esplicativo.",
        co: "La parola emergenza nomina il problema più di quanto lo risolva."
      },
      {
        id: "c",
        l: "No: la forma precede le parti",
        f: "organismo = materia organizzata da una forma",
        b: "Il tutto non risulta dalle parti: le parti sono tali solo dentro il tutto che le organizza.",
        ex: ["Aristotele", "organicismo"],
        im: "Che il tipo di cosa venga prima dei suoi componenti.",
        co: "Rischia di restare descrittivo se non specifica come il tutto agisca sulle parti."
      }
    ]
  },

  // ============ R — REALTÀ E CONOSCENTE (§6) ============
  {
    id: "r1",
    c: "r",
    t: "Il mondo esiste indipendentemente da chi lo conosce?",
    f: "realtà ⟂ osservatore ?",
    note: "Il noumeno kantiano non è il creatore del mondo e non va associato al Demiurgo: è un concetto epistemologico, un limite della conoscenza.",
    g: "È la domanda che decide che cosa fa una teoria scientifica: descrive strutture reali o organizza al meglio le nostre esperienze? Attenzione a non caricare troppo l'idealismo: quello trascendentale non nega il mondo esterno, dice che il mondo conosciuto porta sempre le impronte dello strumento che lo conosce. Il costruttivismo non implica che la realtà esterna non esista; la fenomenologia sospende la domanda e riparte dall'esperienza.",
    an: "Il database esiste anche quando nessuna sessione è aperta, ma tu vedi sempre e solo il risultato di una query, mai la tabella nuda. Il realista dice che le righe ci sono; l'idealista studia lo schema del client.",
    o: [
      {
        id: "a",
        l: "Realismo",
        f: "realtà ⟂ osservatore",
        b: "Il mondo possiede strutture indipendenti dalla mente umana; le migliori teorie le descrivono almeno approssimativamente.",
        ex: ["realismo ingenuo", "realismo scientifico", "realismo critico", "realismo strutturale", "realismo platonico"],
        im: "Che l'errore sia possibile perché c'è qualcosa che ti smentisce.",
        co: "Non puoi mai confrontare la rappresentazione con il reale non rappresentato."
      },
      {
        id: "b",
        l: "Idealismo trascendentale",
        f: "esperienza = dati sensibili + forme e categorie del soggetto",
        b: "Il mondo conosciuto dipende dalle condizioni del soggetto: fenomeno è la cosa come appare, noumeno la cosa pensata fuori da quelle condizioni.",
        ex: ["Kant"],
        im: "Che le condizioni del conoscere siano parte dell'oggetto conosciuto.",
        co: "La cosa in sé resta inaccessibile per costruzione."
      },
      {
        id: "c",
        l: "Costruttivismo",
        f: "mondo conosciuto = f(realtà, organismo, linguaggio, cultura)",
        b: "La conoscenza non è una fotografia passiva ma una costruzione — cognitiva, sociale, linguistica.",
        ex: ["costruttivismo cognitivo", "costruttivismo sociale", "epistemologia genetica", "teoria dei sistemi"],
        im: "Che ogni conoscenza porti la firma del costruttore.",
        co: "Devi spiegare la resistenza del mondo e l'accordo fra soggetti diversi."
      },
      {
        id: "d",
        l: "Fenomenologia",
        f: "punto di partenza = mondo come si manifesta alla coscienza",
        b: "Si sospende la domanda metafisica e si studiano intenzionalità, esperienza vissuta, corpo proprio, temporalità, intersoggettività: il mondo come orizzonte dell'esperienza.",
        ex: ["Husserl", "fenomenologia"],
        im: "Che il primo dato sia l'esperienza, non l'oggetto.",
        co: "La sospensione non può durare per sempre: prima o poi la metafisica bussa."
      }
    ]
  },

  // ============ E — LE VIE DELLA CONOSCENZA (§7) ============
  {
    id: "e1",
    c: "e",
    t: "Qual è la fonte primaria della conoscenza?",
    f: "𝓔 = { ragione, esperienza, metodo, intuizione, interpretazione }",
    note: "",
    g: "La contrapposizione secca è didattica: nessun empirista nega la logica, nessun razionalista ignora l'esperienza. Il punto vero è quale fonte abbia l'ultima parola in caso di conflitto. Il metodo scientifico aggiunge il controllo pubblico; l'ermeneutica ricorda che ogni conoscere parte da una situazione storica e linguistica.",
    an: "Dati contro schema. L'empirista dice che lo schema si inferisce dai dati; il razionalista che senza schema i dati non sono nemmeno leggibili.",
    o: [
      {
        id: "a",
        l: "La ragione",
        f: "conoscenza → ragione",
        b: "La ragione può raggiungere verità non derivate interamente dai sensi.",
        ex: ["Platone", "Cartesio", "Spinoza", "Leibniz"],
        im: "Strutture conoscitive non ricavate dai sensi.",
        co: "Rischio di scambiare abitudini concettuali per necessità del pensiero."
      },
      {
        id: "b",
        l: "L'esperienza sensibile",
        f: "conoscenza → esperienza sensibile",
        b: "Ogni conoscenza significativa deriva dall'esperienza.",
        ex: ["Locke", "Berkeley", "Hume", "tradizione sperimentale"],
        im: "Ogni concetto rendicontabile all'esperienza.",
        co: "Necessità logica e matematica restano difficili da giustificare così."
      },
      {
        id: "c",
        l: "Il metodo scientifico",
        f: "osservazione → ipotesi → esperimento → controllo pubblico → revisione",
        b: "La conoscenza affidabile passa per fenomeni osservabili, misurabili, modellizzabili e controllabili intersoggettivamente.",
        ex: ["scienza moderna"],
        im: "Il controllo pubblico come criterio di affidabilità.",
        co: "Il metodo non copre le domande che non si lasciano misurare."
      },
      {
        id: "d",
        l: "L'intuizione",
        f: "conoscenza → intuizione",
        b: "Comprensione immediata: intellettuale, fenomenologica, morale, contemplativa o simbolica.",
        ex: ["Bergson", "Husserl", "contemplazione mistica"],
        im: "Un accesso non discorsivo ad alcune verità.",
        co: "Come distingui un'intuizione vera da una convinzione molto forte?"
      },
      {
        id: "e",
        l: "L'interpretazione",
        f: "conoscere = interpretare",
        b: "L'essere umano comprende sempre da una situazione storica, linguistica e culturale: la comprensione è un circolo, non una ricezione.",
        ex: ["ermeneutica"],
        im: "Che ogni conoscenza sia situata.",
        co: "Scivola verso il relativismo se ogni lettura vale quanto le altre."
      }
    ]
  },
  {
    id: "e2",
    c: "e",
    t: "Esiste solo ciò che la scienza può misurare?",
    f: "reale ? misurabile",
    note: "La scienza non dimostra automaticamente che esista soltanto ciò che essa può misurare: questa ulteriore affermazione è una posizione filosofica chiamata scientismo.",
    g: "Distingui il metodo dalla tesi, o la discussione diventa una rissa. Il naturalismo metodologico è una regola di lavoro che non nega nulla di ciò che sta fuori; lo scientismo è una tesi filosofica sul reale — e nota che non è a sua volta una tesi scientifica, il che è precisamente la sua difficoltà principale.",
    an: "Un profiler misura latenza e memoria e non ti dirà mai se il prodotto meriti di esistere. Non è un limite del profiler: è fuori dominio.",
    o: [
      {
        id: "a",
        l: "Scientismo",
        f: "reale = scientificamente misurabile",
        b: "Ciò che non è accessibile al metodo scientifico non è conoscenza.",
        ex: [],
        im: "Che ciò che non è misurabile non sia conoscenza.",
        co: "L'affermazione stessa non è verificabile scientificamente."
      },
      {
        id: "b",
        l: "Competenza limitata",
        f: "metodo ⊂ fenomeni osservabili e misurabili",
        b: "La scienza limita la propria competenza ai fenomeni misurabili, senza pronunciarsi su ciò che resta fuori.",
        ex: ["naturalismo metodologico"],
        im: "Una regola d'ingaggio, non una metafisica.",
        co: "Non ti dice che cosa fare delle domande che restano fuori dal perimetro."
      },
      {
        id: "c",
        l: "La domanda eccede il metodo",
        f: "K = { scienza, filosofia, arte, storia, interpretazione, esperienza religiosa }",
        b: "Esistono forme di conoscenza diverse, con metodi e gradi di verificabilità non identici.",
        ex: ["pluralismo epistemologico"],
        im: "Che esistano conoscenze diverse e non gerarchizzabili in blocco.",
        co: "Senza criteri di distinzione, rischia di legittimare qualunque pretesa di sapere."
      }
    ]
  },
  {
    id: "e3",
    c: "e",
    t: "Che cos'è un'intuizione attendibile?",
    f: "intuizione come ipotesi | intuizione come accesso metafisico",
    note: "Non ogni intuizione costituisce una conoscenza affidabile.",
    g: "L'intuizione copre cose diversissime: comprensione immediata, intuizione morale, contemplazione mistica, riconoscimento inconscio di configurazioni. La distinzione operativa è una sola: l'intuizione che genera ipotesi da verificare, e l'intuizione che pretende di essere già conoscenza. La prima è il motore della ricerca; la seconda ha l'onere della prova.",
    an: "Un'euristica che propone la mossa da esplorare, oppure un oracolo che pretende di aver già valutato l'albero. La prima si integra col calcolo; il secondo lo sostituisce.",
    o: [
      {
        id: "a",
        l: "Un'ipotesi da verificare",
        f: "intuizione → ipotesi → controllo",
        b: "L'intuizione propone; la verifica dispone.",
        ex: ["metodo scientifico", "fallibilismo"],
        im: "Che nessuna evidenza interiore basti da sola.",
        co: "Alcune comprensioni — etiche, estetiche — non ammettono il tipo di verifica richiesto."
      },
      {
        id: "b",
        l: "Riconoscimento di configurazioni",
        f: "intuizione = pattern recognition inconscio",
        b: "L'esperienza accumulata riconosce strutture prima che la coscienza le articoli.",
        ex: ["expertise", "psicologia cognitiva"],
        im: "Un sapere reale ma naturalizzabile.",
        co: "Il riconoscimento esperto sbaglia in modo sistematico fuori dal proprio dominio."
      },
      {
        id: "c",
        l: "Accesso a livelli non empirici",
        f: "intuizione → realtà sovrasensibile",
        b: "Alcune intuizioni colgono direttamente livelli del reale non accessibili ai sensi.",
        ex: ["intuizione intellettuale", "contemplazione mistica", "conoscenza simbolica"],
        im: "Un canale conoscitivo oltre l'esperienza.",
        co: "Resta da dimostrare che il canale esista, e da distinguere le sue consegne dagli inganni."
      }
    ]
  },
  {
    id: "e4",
    c: "e",
    t: "Comprendere è ricevere dati o interpretare?",
    f: "parti ↔ intero",
    note: "La comprensione non è pura ricezione di dati, ma un processo circolare fra le parti e l'intero.",
    g: "Il circolo ermeneutico non è un difetto ma la struttura stessa del comprendere: capisci la frase dal testo e il testo dalle frasi, la mossa dal contesto e il contesto dalle mosse. Chi pretende di partire da zero, senza precomprensioni, non parte affatto. La domanda è se questo circolo sia una prigione o la condizione di ogni conoscenza.",
    an: "Non puoi fare il parsing di un token senza una grammatica, né correggere la grammatica senza i token: il bootstrap della comprensione è iterativo per necessità.",
    o: [
      {
        id: "a",
        l: "Ricezione di dati",
        f: "conoscere = registrare",
        b: "La comprensione è ricezione e organizzazione di informazioni dal mondo.",
        ex: ["empirismo", "modelli input-output"],
        im: "Che l'oggettività sia raggiungibile ripulendo il canale.",
        co: "Il dato puro, senza schema che lo legga, non è mai stato trovato."
      },
      {
        id: "b",
        l: "Circolo interpretativo",
        f: "testo o mondo ↔ interprete · parti ↔ intero",
        b: "Ogni comprensione parte da una precomprensione storica e la rivede: il circolo non si esce, si abita bene.",
        ex: ["ermeneutica", "Gadamer"],
        im: "Che ogni conoscenza sia situata e rivedibile.",
        co: "Serve un criterio per distinguere il circolo virtuoso dal circolo vizioso."
      }
    ]
  },

  // ============ V — LA VITA (§8) ============
  {
    id: "v1",
    c: "v",
    t: "Che cos'è un organismo vivente?",
    f: "vita → ?",
    note: "",
    g: "Il vitalismo storico è stato smentito nei dettagli, ma la domanda vera non è sparita. Non è « serve una forza in più? », è « la spiegazione delle parti basta a spiegare l'organizzazione? ». Organicismo e autopoiesi rispondono di no senza aggiungere nulla di misterioso: spostano il livello esplicativo, non la sostanza.",
    an: "Conoscere ogni funzione di un sistema non ti dà l'architettura. La riduzione al modulo è vera e insufficiente: manca il livello in cui il sistema mantiene se stesso.",
    o: [
      {
        id: "a",
        l: "Meccanicismo",
        f: "organismo = macchina biologica · biologia ⊆ fisica e chimica",
        b: "I processi vitali si spiegano con causalità fisica, chimica, regolazione e informazione genetica.",
        ex: [],
        im: "Nessun confine di principio fra vivente e non vivente.",
        co: "L'organizzazione resta da spiegare, non solo da elencare componente per componente."
      },
      {
        id: "b",
        l: "Vitalismo",
        f: "vita = materia + principio vitale",
        b: "Il vivente richiederebbe un principio irriducibile ai processi fisico-chimici. Alcune sue domande sopravvivono nelle discussioni su organizzazione, autonomia, finalità, emergenza.",
        ex: ["Driesch", "élan vital"],
        im: "Qualcosa di irriducibile nel vivente.",
        co: "Nessun candidato empirico ha retto: la biochimica ha spiegato ciò che il vitalismo dichiarava impossibile."
      },
      {
        id: "c",
        l: "Organicismo",
        f: "organismo > Σ parti",
        b: "Il vivente non richiede una sostanza spirituale separata, ma non si comprende isolando i componenti: organizzazione, totalità, autoregolazione, sviluppo, storia evolutiva.",
        ex: [],
        im: "Che il livello del tutto abbia potere esplicativo.",
        co: "Rischia di restare descrittivo se non specifica come il tutto agisca sulle parti."
      },
      {
        id: "d",
        l: "Autopoiesi",
        f: "vivente = sistema che produce e mantiene la propria organizzazione",
        b: "Il vivente non si limita a elaborare input: costruisce continuamente se stesso e il proprio rapporto con l'ambiente.",
        ex: ["Maturana", "Varela"],
        im: "Che il criterio del vivente sia la chiusura organizzativa.",
        co: "Casi limite difficili: virus, protocelle, sistemi artificiali autoreplicanti."
      },
      {
        id: "e",
        l: "Relazione ecologica",
        f: "vivente = f(organismo, ambiente)",
        b: "Il vivente non si separa dal proprio ambiente, dalla propria storia e dalle reti ecologiche.",
        ex: ["ecologia", "niche construction"],
        im: "Che l'unità di analisi sia organismo più ambiente.",
        co: "Se il confine sfuma, che cosa stai studiando esattamente?"
      }
    ]
  },
  {
    id: "v2",
    c: "v",
    t: "La vita si spiega interamente con l'evoluzione?",
    f: "variazione + ereditarietà + selezione ⇒ vita?",
    g: "La domanda non è se l'evoluzione sia vera, ma se sia sufficiente. Un conto è spiegare come le forme viventi si diversifichino a partire da forme già viventi; un altro è spiegare l'origine dell'organizzazione, dell'autonomia, della finalità interna. Chi risponde sì chiude la continuità col non vivente; chi distingue accetta la selezione ma segnala che l'origine e l'autoreferenza restano aperte; chi risponde no invoca un principio ulteriore.",
    an: "Un algoritmo di ottimizzazione spiega benissimo come una soluzione migliori nel tempo, ma non spiega da solo perché esista la funzione obiettivo né chi abbia acceso il processo.",
    o: [
      {
        id: "a",
        l: "Sì, continuità completa",
        f: "vita ⊆ processo evolutivo",
        b: "Variazione, ereditarietà e selezione naturale rendono conto della vita senza residui: nessun salto fra vivente e non vivente.",
        ex: ["darwinismo", "sintesi moderna"],
        im: "Che non serva alcun principio oltre i meccanismi evolutivi.",
        co: "L'origine della prima organizzazione autoreplicante e la finalità interna restano da spiegare, non solo da assumere."
      },
      {
        id: "b",
        l: "Sì per l'origine, ma…",
        f: "evoluzione ✓ · organizzazione ?",
        b: "L'evoluzione spiega la diversificazione, ma organizzazione, autonomia e finalità del vivente restano domande aperte.",
        ex: [],
        im: "Che la spiegazione evolutiva sia vera e insieme incompleta.",
        co: "Devi dire che cosa manchi, senza reintrodurre di nascosto una forza vitale."
      },
      {
        id: "c",
        l: "No: un principio ulteriore",
        f: "vita = evoluzione + X",
        b: "Il vivente partecipa a un principio che l'evoluzione non cattura: finalità intrinseca o slancio vitale.",
        ex: ["vitalismo", "finalismo"],
        im: "Che esista una dimensione del vivente irriducibile ai meccanismi.",
        co: "Storicamente il vitalismo è stato smentito nei dettagli: l'onere della prova è pesante."
      }
    ]
  },
  {
    id: "m1",
    c: "m",
    t: "Che cos'è uno stato mentale rispetto al cervello?",
    f: "mente ↔ cervello",
    g: "Il ventaglio va dal fisicalismo più stretto alla coscienza come fondamento. Chi identifica lo stato mentale con lo stato cerebrale paga in flessibilità; chi lo rende un ruolo funzionale guadagna generalità ma perde presa sull'esperienza vissuta; chi parla di emergenza deve dire in che senso il nuovo livello sia reale; il dualista salva l'esperienza e deve spiegare l'interazione; chi rende la coscienza fondamentale evita il problema difficile e ne eredita un altro.",
    an: "Puoi descrivere un programma al livello dei transistor, delle istruzioni o della funzione: la domanda è a quale livello vive davvero lo stato mentale, e se qualcuno di quei livelli lasci fuori qualcosa.",
    o: [
      {
        id: "a",
        l: "Teoria dell'identità",
        f: "stato mentale = stato cerebrale",
        b: "Ogni stato mentale è identico a un determinato stato fisico del cervello.",
        ex: [],
        im: "Che la mente non aggiunga nulla alla fisica del cervello.",
        co: "Stati mentali identici potrebbero realizzarsi in cervelli diversi: l'identità stretta è troppo rigida."
      },
      {
        id: "b",
        l: "Funzionalismo",
        f: "mente = ruolo funzionale",
        b: "Uno stato mentale è definito dal ruolo causale che svolge, indipendentemente dal materiale che lo realizza.",
        ex: [],
        im: "Che la mente sia realizzabile su substrati diversi.",
        co: "Il ruolo funzionale sembra lasciare fuori proprio il carattere qualitativo dell'esperienza."
      },
      {
        id: "c",
        l: "Emergentismo",
        f: "mente = proprietà emergente",
        b: "La mente emerge dalla materia organizzata con proprietà nuove non deducibili dalle parti.",
        ex: [],
        im: "Che esistano proprietà reali di livello superiore.",
        co: "Devi spiegare come il livello emergente agisca senza violare la fisica dei componenti."
      },
      {
        id: "d",
        l: "Dualismo",
        f: "mente ≠ fisico",
        b: "La mente coinvolge una sostanza o proprietà non fisica, irriducibile al cervello.",
        ex: ["Cartesio", "teorie dell'anima"],
        im: "Che l'esperienza cosciente non sia catturata dalla fisica.",
        co: "Resta il problema di come il non fisico interagisca con il cervello fisico."
      },
      {
        id: "e",
        l: "Panpsichismo o idealismo",
        f: "coscienza = fondamentale",
        b: "La coscienza non emerge dalla materia: è una caratteristica fondamentale del reale.",
        ex: ["Whitehead", "panpsichismo contemporaneo"],
        im: "Che l'esperienza sia mattone del mondo, non prodotto tardivo.",
        co: "Il problema della combinazione: come micro-esperienze compongano una coscienza unitaria."
      }
    ]
  },
  {
    id: "m2",
    c: "m",
    t: "Il pensiero è computazione?",
    f: "pensiero → calcolo?",
    g: "La posta è se la manipolazione formale di simboli, o la sua versione distribuita, basti a rendere conto del pensiero, oppure se manchino semantica, corpo e azione. Le prime due opzioni dicono sì in due modi diversi; le ultime due dicono no per ragioni distinte: una punta al significato che la sintassi non genera, l'altra al fatto che la cognizione vive in un ciclo cervello-corpo-ambiente.",
    an: "Un interprete che applica regole a stringhe produce output corretti senza capire nulla di ciò che manipola: la domanda è se capire sia qualcosa in più dell'eseguire.",
    o: [
      {
        id: "a",
        l: "Sì: calcolo simbolico",
        f: "pensiero = manipolazione di simboli",
        b: "Pensare è elaborare rappresentazioni simboliche secondo regole formali.",
        ex: ["teoria computazionale della mente"],
        im: "Che il pensiero sia in linea di principio implementabile su una macchina.",
        co: "La manipolazione di simboli non spiega da sé come i simboli abbiano significato."
      },
      {
        id: "b",
        l: "Sì, ma distribuito",
        f: "pensiero = reti + pesi",
        b: "Il pensiero è computazione, ma nella forma di attivazioni distribuite in reti, non di regole esplicite.",
        ex: ["connessionismo"],
        im: "Che la cognizione emerga da pattern sub-simbolici.",
        co: "Resta da chiarire come da pattern statistici emergano concetti e ragionamento strutturato."
      },
      {
        id: "c",
        l: "No: la sintassi non basta",
        f: "sintassi ↛ semantica",
        b: "Manipolare simboli secondo regole non produce comprensione: la semantica non nasce dalla sola sintassi.",
        ex: ["Searle", "stanza cinese"],
        im: "Che la comprensione sia qualcosa di più dell'esecuzione formale.",
        co: "Devi dire da dove venga allora la semantica, se non dall'organizzazione funzionale."
      },
      {
        id: "d",
        l: "No: cognizione incarnata",
        f: "mente = f(cervello, corpo, azione, ambiente)",
        b: "La mente non è calcolo interno ma un processo esteso nel corpo e nell'interazione con il mondo.",
        ex: ["Clark", "Varela"],
        im: "Che la cognizione non sia isolabile in un processore.",
        co: "Il confine della mente diventa sfumato: dove finisce il cognitivo e comincia l'ambiente?"
      }
    ]
  },
  {
    id: "m3",
    c: "m",
    t: "Se si riproduce la struttura causale del cervello, si riproduce la mente?",
    f: "struttura causale ⇒ coscienza?",
    g: "È il test decisivo tra le teorie della mente: se conta solo l'organizzazione causale, allora copiarla basta; se la coscienza dipende da qualcosa di più, no. Le risposte ripartono le posizioni della domanda sullo stato mentale: funzionalismo forte dice sì su ogni substrato, l'emergentista è cauto, il dualista nega, il panpsichista segnala il problema della combinazione.",
    an: "Emulare esattamente l'architettura di un sistema su un altro hardware: se il comportamento è tutto, l'emulazione è l'originale; se conta il materiale, no.",
    o: [
      {
        id: "a",
        l: "Sì, su qualunque substrato",
        f: "organizzazione causale ⇒ mente",
        b: "Riprodotta la struttura causale, la mente segue: il substrato è irrilevante.",
        ex: ["funzionalismo forte"],
        im: "Che una mente artificiale cosciente sia possibile in linea di principio.",
        co: "Assume che l'esperienza qualitativa sia interamente fissata dai rapporti causali."
      },
      {
        id: "b",
        l: "Forse: condizioni particolari",
        f: "coscienza = emergenza forte?",
        b: "L'emergenza della coscienza potrebbe richiedere condizioni fisiche specifiche, non ogni realizzazione causale.",
        ex: [],
        im: "Che la riproducibilità della mente sia una questione empirica aperta.",
        co: "Non specifica quali condizioni: rischia di essere una promessa più che una tesi."
      },
      {
        id: "c",
        l: "No: non è riproducibile",
        f: "coscienza ∉ processo fisico replicabile",
        b: "La coscienza non è un processo fisico che si possa duplicare copiandone la struttura.",
        ex: ["dualismo"],
        im: "Che l'esperienza non sia catturata da alcuna descrizione causale.",
        co: "Rende misteriosa la dipendenza evidente della mente dagli stati del cervello."
      },
      {
        id: "d",
        l: "Il problema della combinazione",
        f: "micro-esperienze ↛ coscienza unitaria",
        b: "Anche riproducendo la struttura, resta da spiegare come le micro-esperienze compongano un'unica coscienza.",
        ex: ["panpsichismo"],
        im: "Che il nodo non sia il substrato ma l'unificazione dell'esperienza.",
        co: "Il problema della combinazione è tuttora irrisolto anche per chi lo pone."
      }
    ]
  },
  {
    id: "m4",
    c: "m",
    t: "Dati e significato vissuto coincidono?",
    f: "dati = senso?",
    g: "È la versione affilata del problema del significato: l'informazione elaborata è già senso, oppure il senso è qualcosa che l'organismo costituisce attivamente? Chi risponde sì integra la mente nel quadro informazionale; chi risponde no sostiene che il significato nasce dall'attività di un vivente che ha una posta in gioco.",
    an: "Un sensore registra valori; un organismo affamato « vede » cibo. Gli stessi bit valgono in modo diverso per chi ha qualcosa da perdere.",
    o: [
      {
        id: "a",
        l: "Sì: significato = informazione",
        f: "senso = dato elaborato",
        b: "Il significato è informazione trattata: non c'è un residuo oltre l'elaborazione.",
        ex: [],
        im: "Che la mente rientri interamente nel quadro informazionale.",
        co: "Fatica a spiegare perché qualcosa conti per qualcuno, e non sia solo registrato."
      },
      {
        id: "b",
        l: "No: il mondo è costruito",
        f: "senso = mondo enatto dall'organismo",
        b: "L'organismo non riceve significati: costruisce attivamente un mondo dotato di senso in base alla propria vita.",
        ex: ["enattivismo"],
        im: "Che il significato presupponga un vivente con una posta in gioco.",
        co: "Rischia di rendere difficile ogni modello formale e condivisibile del significato."
      }
    ]
  },
  {
    id: "u1",
    c: "u",
    t: "Che cos'è, essenzialmente, l'essere umano?",
    f: "uomo = ?",
    g: "Ogni opzione fissa un centro di gravità diverso: la continuità animale, la ragione e il linguaggio, la persona, la mediazione simbolica, l'esistenza da compiere. Non sono del tutto incompatibili, ma orientano etica, politica e antropologia in direzioni divergenti: chiediti quale aspetto, tolto, cancellerebbe l'umano più degli altri.",
    an: "Definire un sistema dal suo hardware, dalla sua funzione principale, dal suo utente, dal suo linguaggio o dal suo ciclo di vita: descrivono lo stesso oggetto ma privilegiano cose diverse.",
    o: [
      {
        id: "a",
        l: "Organismo evolutivo",
        f: "uomo ⊂ animali",
        b: "L'essere umano è un organismo prodotto dall'evoluzione, in continuità con gli altri animali.",
        ex: ["naturalismo biologico"],
        im: "Che l'umano non sia separato dal resto del vivente.",
        co: "Fatica a rendere conto di ciò che sembra specificamente umano: linguaggio, norma, senso."
      },
      {
        id: "b",
        l: "Animale razionale",
        f: "uomo = animale + logos",
        b: "L'uomo è l'animale dotato di ragione, parola e vita politica.",
        ex: ["Aristotele"],
        im: "Che ragione e linguaggio definiscano l'essenza umana.",
        co: "Rischia di escludere o gerarchizzare chi non esercita pienamente la razionalità."
      },
      {
        id: "c",
        l: "Persona",
        f: "uomo = persona",
        b: "L'uomo è una persona: autocoscienza, libertà, responsabilità, dignità.",
        ex: ["personalismo"],
        im: "Che il valore umano non dipenda dalle prestazioni.",
        co: "Deve fondare la dignità senza ancorarla a proprietà misurabili che alcuni non hanno."
      },
      {
        id: "d",
        l: "Animal symbolicum",
        f: "uomo = animale simbolico",
        b: "L'uomo vive in un universo mediato da linguaggio, mito, arte e rito.",
        ex: ["Cassirer"],
        im: "Che l'accesso umano al mondo sia sempre simbolicamente mediato.",
        co: "Rischia di dissolvere la natura umana nella sola cultura."
      },
      {
        id: "e",
        l: "Esistenza",
        f: "uomo = progetto da compiere",
        b: "L'uomo è l'ente che deve diventare ciò che è: l'esistenza precede l'essenza.",
        ex: ["esistenzialismo", "Sartre", "Heidegger"],
        im: "Che l'umano si definisca nelle scelte, non in una natura data.",
        co: "Se non c'è natura data, diventa arduo fondare norme comuni e universali."
      }
    ]
  },
  {
    id: "u2",
    c: "u",
    t: "Che cosa rende qualcuno «persona»?",
    f: "persona ⇐ ?",
    g: "Fissare il criterio della persona non è teoria astratta: decide chi entra nella comunità morale. L'autocoscienza lega la persona a una capacità psicologica; la libertà a una capacità morale; la relazione la fa nascere dall'incontro; la dignità intrinseca la sottrae a ogni requisito. Ognuna include ed esclude casi limite diversi.",
    an: "Definire l'appartenenza a un sistema tramite una credenziale, una capacità, un'interazione o un diritto di default: cambia radicalmente chi resta dentro e chi fuori.",
    o: [
      {
        id: "a",
        l: "Autocoscienza",
        f: "persona = coscienza + continuità",
        b: "È persona chi ha coscienza di sé e continuità nel tempo.",
        ex: ["Locke"],
        im: "Che l'identità personale sia questione di memoria e coscienza.",
        co: "Esclude chi ha coscienza intermittente o assente: neonati, dementi, dormienti."
      },
      {
        id: "b",
        l: "Libertà e responsabilità",
        f: "persona = agente morale",
        b: "È persona chi è capace di libertà e ne risponde: un fine, non un mezzo.",
        ex: ["Kant"],
        im: "Che la dignità si fondi sull'autonomia morale.",
        co: "Rischia di lasciare fuori chi non esercita di fatto l'autonomia razionale."
      },
      {
        id: "c",
        l: "Relazione",
        f: "persona = costituita nell'incontro",
        b: "La persona non è un dato isolato: si costituisce nella relazione con l'altro.",
        ex: ["Buber", "Levinas", "Ubuntu"],
        im: "Che l'io sia sempre secondo rispetto al legame.",
        co: "Se tutto è relazione, si fatica a fondare i diritti dell'individuo di fronte al gruppo."
      },
      {
        id: "d",
        l: "Dignità intrinseca",
        f: "persona = valore non riducibile",
        b: "La persona ha un valore intrinseco che non si riduce a proprietà misurabili.",
        ex: [],
        im: "Che la dignità non dipenda da capacità possedute.",
        co: "Deve giustificare da dove derivi tale dignità senza appoggiarsi a proprietà osservabili."
      }
    ]
  },
  {
    id: "u3",
    c: "u",
    t: "L'identità preesiste alle relazioni o si costituisce in esse?",
    f: "io ⇐ relazioni?",
    g: "È la scelta fra un io-sostanza dato prima dei legami e un io che nasce dentro i legami. La prima difende l'autonomia dell'individuo e rischia di ipostatizzare un nucleo immutabile; la seconda coglie quanto la persona sia plasmata dagli altri e rischia di dissolverla nelle relazioni; la terza tiene i due poli, al prezzo di dover dire dove passi il confine.",
    an: "Un oggetto con stato interno indipendente contro un oggetto il cui stato è definito solo dalle connessioni nel grafo: cambia se puoi isolarlo senza perderlo.",
    o: [
      {
        id: "a",
        l: "Preesiste",
        f: "io = sostanza individuale",
        b: "La persona è una sostanza individuale che precede e fonda le sue relazioni.",
        ex: ["Locke", "liberalismo classico"],
        im: "Che i diritti individuali vengano prima dei legami sociali.",
        co: "Sottovaluta quanto l'identità sia plasmata da lingua, cultura e riconoscimento."
      },
      {
        id: "b",
        l: "Si costituisce nelle relazioni",
        f: "io = f(relazioni)",
        b: "L'identità nasce e si forma nel riconoscimento reciproco e nei legami.",
        ex: ["Hegel", "Buber", "confucianesimo"],
        im: "Che non ci sia un io pieno prima dell'incontro con l'altro.",
        co: "Rischia di rendere l'individuo dipendente dal gruppo fino a dissolverlo."
      },
      {
        id: "c",
        l: "Entrambe",
        f: "io = nucleo + sviluppo relazionale",
        b: "C'è un nucleo dato che si sviluppa e si definisce attraverso le relazioni.",
        ex: [],
        im: "Che natura e relazione concorrano insieme all'identità.",
        co: "Deve precisare dove finisca il nucleo dato e cominci ciò che è costruito."
      }
    ]
  },
  {
    id: "u4",
    c: "u",
    t: "La finitudine è essenziale al senso della vita umana?",
    f: "morte ⇒ senso?",
    g: "Se il limite - morte, rischio, perdita - sia condizione del senso o ostacolo da rimuovere. Per l'esistenzialismo la mortalità fonda scelta e autenticità; per il transumanesimo è un difetto biologico superabile; per le religioni della salvezza è soglia verso un compimento oltre la finitudine. La scelta orienta l'atteggiamento verso tecnologia, medicina e speranza.",
    an: "Un gioco senza game over e senza risorse scarse: alcune decisioni perdono peso quando nulla è irreversibile e il tempo è illimitato.",
    o: [
      {
        id: "a",
        l: "Sì: fonda l'autenticità",
        f: "finitudine ⇒ scelta autentica",
        b: "Mortalità e angoscia rendono possibili scelta, urgenza e autenticità.",
        ex: ["Heidegger", "esistenzialismo"],
        im: "Che il senso dipenda dall'essere-per-la-fine.",
        co: "Rischia di nobilitare la sofferenza e il limite come se fossero sempre buoni."
      },
      {
        id: "b",
        l: "No: limite superabile",
        f: "finitudine = vincolo biologico",
        b: "La finitudine è un limite biologico, in linea di principio riducibile o superabile.",
        ex: ["transumanesimo"],
        im: "Che senso e valore non richiedano la morte.",
        co: "Deve mostrare che una vita senza limiti conservi davvero motivazione e senso."
      },
      {
        id: "c",
        l: "Porta verso il compimento",
        f: "finitudine → oltre",
        b: "La finitudine è soglia verso un compimento che eccede la vita mortale.",
        ex: ["religioni della salvezza"],
        im: "Che il senso ultimo stia oltre la vita finita.",
        co: "Poggia su una promessa che eccede ciò che si può constatare."
      }
    ]
  },
  {
    id: "c1",
    c: "c",
    t: "Il mondo ha un inizio?",
    f: "𝒲 → inizio | eterno | ciclo | ?",
    note: "La cosmologia descrive l'evoluzione dell'universo osservabile da uno stato molto caldo e denso, ma non risolve automaticamente la domanda metafisica sull'origine assoluta.",
    g: "Tieni separati due piani, o la discussione si impantana: la cosmologia descrive lo stato iniziale dell'universo osservabile, la metafisica chiede perché ci sia un universo. La quarta opzione non è un'evasione: se il tempo nasce con il mondo, chiedere che cosa ci fosse prima è come chiedere che cosa ci sia a nord del polo nord.",
    an: "L'istante zero di un sistema non ha un timestamp precedente perché il clock parte lì. L'assenza di dati prima di t₀ non è un dato mancante.",
    o: [
      {
        id: "a",
        l: "Ha un inizio",
        f: "∃ t₀",
        b: "Creazione, origine cosmologica, emergenza del tempo insieme all'universo, evento iniziale fisico.",
        ex: [],
        im: "Un fatto ultimo da spiegare oppure da accettare come bruto.",
        co: "Perché quell'inizio, e in che senso c'era un « poi » se non c'era un prima?"
      },
      {
        id: "b",
        l: "È eterno",
        f: "∄ primo istante",
        b: "Nessun primo momento: il mondo è sempre stato.",
        ex: ["Aristotele", "cosmologie materialiste"],
        im: "Nessuna origine, quindi nessun creatore necessario.",
        co: "Una serie infinita già percorsa è concettualmente ostica e mal si accorda con la cosmologia osservata."
      },
      {
        id: "c",
        l: "È ciclico",
        f: "W₁ → W₂ → … → Wₙ → W₁",
        b: "Nascita, dissoluzione e ricominciamento come struttura del tempo cosmico.",
        ex: ["cosmologie indiane", "eterno ritorno stoico"],
        im: "Ripetizione senza destinazione.",
        co: "L'evidenza empirica per i cicli cosmici resta debole."
      },
      {
        id: "d",
        l: "Non decidibile",
        f: "tempo ⊂ universo ⇒ « prima » mal definito",
        b: "Se il tempo è interno all'universo, chiedere che cosa vi fosse prima può essere una domanda malformata.",
        ex: [],
        im: "Che alcune domande siano difettose, non solo difficili.",
        co: "È comodo: rischia di far passare per non-domanda ciò che è soltanto arduo."
      }
    ]
  },
  {
    id: "c2",
    c: "c",
    t: "Il mondo ha un fine?",
    f: "W → F   ∨   W ↛ F",
    g: "Distingui finalità e regolarità, o sbagli bersaglio. Un sistema può essere orientato a uno scopo senza che nessuno lo abbia inteso: la selezione naturale produce organi che sembrano progettati e non lo sono. La terza opzione è quella che la biologia usa di fatto ogni giorno: teleonomia locale senza teleologia cosmica.",
    an: "La differenza fra codice scritto per uno scopo e codice emerso da ottimizzazione automatica: funzionalmente indistinguibili, con storie causali opposte.",
    o: [
      {
        id: "a",
        l: "Teleologia",
        f: "W → F",
        b: "Il mondo è orientato verso un fine: progetto divino, finalità naturale, sviluppo dello Spirito, progresso, ordine cosmico.",
        ex: ["Aristotele", "teologie provvidenziali", "Hegel", "Teilhard de Chardin"],
        im: "Che gli eventi vadano letti anche per il loro verso.",
        co: "Le finalità apparenti si spiegano bene senza alcuna intenzione."
      },
      {
        id: "b",
        l: "Non-teleologia",
        f: "W ↛ F",
        b: "Gli eventi derivano da cause, necessità, probabilità, selezione naturale, contingenza e interazione di processi.",
        ex: ["atomismo", "naturalismo", "darwinismo", "esistenzialismo ateo"],
        im: "Solo cause efficienti, dal passato verso il futuro.",
        co: "Il linguaggio funzionale resta irrinunciabile in biologia e in medicina."
      },
      {
        id: "c",
        l: "Finalità locali",
        f: "¬F(W) ∧ ∃F(x)",
        b: "Nessun fine complessivo, ma comportamenti orientati a scopo in organismi, sistemi e agenti.",
        ex: ["teleonomia"],
        im: "Scopi reali, ma locali e generati dalla storia del sistema.",
        co: "Dove finisce il locale e comincerebbe il cosmico? Il confine è da argomentare."
      }
    ]
  },
  {
    id: "c3",
    c: "c",
    t: "Le leggi di natura sono necessarie?",
    f: "leggi →",
    g: "Domanda su che cosa sia una legge, prima ancora che su quali leggi valgano. Se le leggi governano, sono entità reali e spiegano; se descrivono, non spiegano nulla, riassumono. La scelta cambia il valore probatorio che la fisica può avere in qualunque discussione metafisica: è il presupposto nascosto di metà delle dispute su scienza e filosofia.",
    an: "Vincoli di integrità imposti dal motore, oppure statistiche raccolte sui dati esistenti. Nel primo caso una violazione è impossibile; nel secondo è solo mai avvenuta finora.",
    o: [
      {
        id: "a",
        l: "Necessarie",
        f: "□ L",
        b: "Non potrebbero essere diverse da come sono.",
        ex: [],
        im: "Che l'universo non potesse essere altrimenti.",
        co: "Perché proprio queste, allora? La necessità è più facile da affermare che da mostrare."
      },
      {
        id: "b",
        l: "Contingenti",
        f: "◇ ¬L",
        b: "Sono le leggi di questo universo, ma avrebbero potuto essere altre.",
        ex: [],
        im: "Che questo sia un universo fra i possibili.",
        co: "Apre subito la domanda su che cosa selezioni la configurazione osservata."
      },
      {
        id: "c",
        l: "Descrittive",
        f: "L = riassunto di regolarità",
        b: "Non governano nulla: registrano ciò che accade regolarmente.",
        ex: [],
        im: "Nessun potere causale nelle leggi.",
        co: "Se non governano, perché la natura è così affidabile e prevedibile?"
      },
      {
        id: "d",
        l: "Costruite nei modelli",
        f: "L ∈ apparato teorico",
        b: "Sono strumenti con cui organizziamo l'esperienza, non entità del mondo.",
        ex: [],
        im: "Che le leggi appartengano ai modelli, non al mondo.",
        co: "Difficile spiegare perché modelli costruiti da noi predicano così bene."
      }
    ]
  },
  {
    id: "c4",
    c: "c",
    t: "Tutto è determinato?",
    f: "stato + leggi ⇒ futuro",
    g: "Non confondere questa con la domanda sulla libertà: qui si parla soltanto di quanti futuri siano compatibili con lo stato presente. E la risposta può legittimamente cambiare a livelli diversi — microfisico, biologico, sociale — senza contraddizione, purché tu dica quale livello stai descrivendo.",
    an: "Funzione pura contro funzione che consulta una sorgente di entropia. Il determinismo afferma che l'universo è idempotente: stesso input, stesso output, sempre.",
    o: [
      {
        id: "a",
        l: "Determinismo",
        f: "stato presente + leggi ⇒ un solo futuro",
        b: "Nelle forme fisica, biologica, psicologica, economica o teologica.",
        ex: ["Laplace", "Spinoza"],
        im: "Che l'imprevedibilità sia solo epistemica.",
        co: "La meccanica quantistica ammette letture indeterministe, e i sistemi caotici rendono la predizione impraticabile in linea di fatto."
      },
      {
        id: "b",
        l: "Indeterminismo",
        f: "stato presente ⇒ più futuri possibili",
        b: "Il caso o la probabilità appartengono realmente al mondo, non solo alla nostra ignoranza.",
        ex: [],
        im: "Che il caso sia una struttura del mondo, non un limite nostro.",
        co: "Il caso non aiuta la libertà: un'azione casuale non è più tua di una necessitata."
      },
      {
        id: "c",
        l: "Modelli misti",
        f: "vincoli + contingenza + auto-organizzazione",
        b: "Alcuni livelli sono deterministici, altri probabilistici: la descrizione dipende dalla scala.",
        ex: ["sistemi complessi"],
        im: "Che la risposta dipenda dal livello di descrizione.",
        co: "Rischia di rimandare la domanda invece di rispondere: quale livello è quello vero?"
      }
    ]
  },
  {
    id: "c5",
    c: "c",
    t: "Esiste il caso?",
    f: "caso → reale | apparente",
    g: "È il test di coerenza della risposta precedente. Chiamare caso l'ignoranza delle cause è legittimo e utilissimo in statistica; sostenere che esistano eventi oggettivamente non determinati è una tesi molto più impegnativa, e va sostenuta con la fisica, non con l'intuizione o con il senso comune.",
    an: "Pseudocasuale contro casuale hardware: il primo è del tutto deterministico e sembra casuale solo perché non conosci il seme.",
    o: [
      {
        id: "a",
        l: "Caso reale",
        f: "∃ eventi non determinati",
        b: "Alcuni eventi non sono completamente fissati dalle condizioni precedenti.",
        ex: [],
        im: "Un mondo in cui il passato non fissa il futuro.",
        co: "Devi mostrare che l'indeterminazione è nel mondo e non nel modello: non è ancora deciso."
      },
      {
        id: "b",
        l: "Caso apparente",
        f: "caso = causa non conosciuta",
        b: "Il caso è un nome per la nostra ignoranza delle cause.",
        ex: [],
        im: "Che ogni evento abbia cause, note o ignote.",
        co: "Non è dimostrabile: è una scommessa metodologica sul futuro della ricerca."
      }
    ]
  },
  {
    id: "k1",
    c: "k",
    t: "Che cosa sono i simboli?",
    f: "simbolo → ?",
    g: "Le tre tesi vanno dal naturalismo semiotico alla partecipazione sacra. La prima riduce il simbolo a etichetta convenzionale prodotta da biologia e cultura; la seconda vi legge strutture oggettive del reale; la terza vi riconosce una partecipazione a un ordine di significato sacro. Ciò che è in gioco è se il simbolo scopra qualcosa o lo inventi soltanto.",
    an: "Un identificatore può essere una stringa arbitraria, un riferimento a una struttura dati reale, o un puntatore a qualcosa che lo trascende: la stessa forma, tre statuti ontologici.",
    o: [
      {
        id: "a",
        l: "Etichette convenzionali",
        f: "simbolo = convenzione",
        b: "I simboli sono etichette convenzionali, frutto di una capacità biologica e culturale.",
        ex: [],
        im: "Che il simbolo non riveli nulla oltre l'accordo umano.",
        co: "Fatica a spiegare la forza e la ricorrenza transculturale di certi simboli."
      },
      {
        id: "b",
        l: "Strutture oggettive",
        f: "simbolo ↔ ordine cosmico",
        b: "I simboli esprimono strutture oggettive del reale: corrispondono a un ordine del mondo.",
        ex: ["platonismo simbolico", "Jung"],
        im: "Che il simbolo abbia un aggancio reale, non solo convenzionale.",
        co: "Deve mostrare come una struttura psichica o cosmica garantisca la corrispondenza."
      },
      {
        id: "c",
        l: "Partecipazioni al sacro",
        f: "simbolo ⊂ ordine sacro",
        b: "I simboli partecipano a un ordine di significato sacro, non lo rappresentano soltanto.",
        ex: ["filosofia ermetica", "neoplatonismo", "tradizionalismo"],
        im: "Che esista un ordine sacro cui il simbolo dà accesso.",
        co: "Presuppone proprio ciò che è in discussione: l'esistenza di un ordine sacro."
      }
    ]
  },
  {
    id: "k2",
    c: "k",
    t: "L'intuizione dà accesso a una realtà sovrasensibile?",
    f: "intuizione → sovrasensibile?",
    g: "Il ventaglio va dal rifiuto empirista all'affermazione mistica, con una sospensione nel mezzo. Chi nega riconduce ogni intuizione alla verifica; chi sospende la tiene come ipotesi indimostrabile; chi afferma sostiene una conoscenza simbolica o contemplativa del sovrasensibile. Il punto critico è il criterio: come distinguere un accesso reale da una proiezione.",
    an: "Un segnale senza canale di validazione esterno: può essere informazione autentica o rumore auto-generato, e dall'interno non sempre li distingui.",
    o: [
      {
        id: "a",
        l: "No: solo verifica empirica",
        f: "intuizione → controllo empirico",
        b: "Ogni intuizione va ricondotta alla verifica: non apre ad alcun sovrasensibile.",
        ex: [],
        im: "Che nulla sfugga in linea di principio al controllo empirico.",
        co: "Assume ciò che dovrebbe dimostrare: che l'empirico esaurisca il reale."
      },
      {
        id: "b",
        l: "Possibile ma indimostrabile",
        f: "intuizione ⇒ ipotesi aperta",
        b: "Un accesso sovrasensibile è possibile ma indimostrabile: resta un'ipotesi da tenere aperta.",
        ex: [],
        im: "Che la questione non sia chiudibile né in un senso né nell'altro.",
        co: "La sospensione perpetua ha un costo: non orienta la vita né la ricerca."
      },
      {
        id: "c",
        l: "Sì: conoscenza contemplativa",
        f: "intuizione → sovrasensibile",
        b: "Esiste una conoscenza simbolica o contemplativa che dà accesso al sovrasensibile.",
        ex: ["misticismo", "gnosi"],
        im: "Che vi siano vie di conoscenza oltre l'empirico.",
        co: "Manca un criterio pubblico per distinguere esperienza autentica e illusione."
      }
    ]
  },
  {
    id: "k3",
    c: "k",
    t: "Una macchina che superasse l'uomo nel calcolo lo supererebbe come essere?",
    f: "calcolo > uomo ⇒ essere > uomo?",
    g: "La domanda smaschera un'equazione nascosta: capacità cognitiva uguale valore ontologico. Chi risponde sì la accetta; chi risponde no distingue il piano delle prestazioni da quello dell'essere o dello spirito; la terza via segnala che « superiore » è ambiguo e la questione, per ora, indecidibile. È un test sul senso stesso di « superiorità ».",
    an: "Una calcolatrice batte da sempre l'uomo in aritmetica senza che a nessuno venga in mente di dirla « superiore »: la potenza di calcolo non è mai stata, da sola, misura del valore.",
    o: [
      {
        id: "a",
        l: "Sì: più capacità, più realtà",
        f: "capacità cognitiva ⇒ rango ontologico",
        b: "Maggiori capacità cognitive implicano una realtà o un valore superiore.",
        ex: [],
        im: "Che il valore di un essere si misuri sulle sue prestazioni.",
        co: "Confonde ciò che un ente sa fare con ciò che un ente è."
      },
      {
        id: "b",
        l: "No: piani distinti",
        f: "cognitivo ≠ spirituale/ontologico",
        b: "Il piano spirituale o ontologico non coincide con quello cognitivo: superare nel calcolo non è superare come essere.",
        ex: [],
        im: "Che esista una dimensione dell'essere irriducibile alla prestazione.",
        co: "Deve dire in che cosa consista quel piano ulteriore, senza limitarsi a postularlo."
      },
      {
        id: "c",
        l: "Dipende da « superiore »",
        f: "« superiore » = ?",
        b: "La risposta dipende da che cosa si intenda per superiore: la domanda è per ora indecidibile.",
        ex: [],
        im: "Che il nodo sia concettuale prima che empirico.",
        co: "Rischia di rinviare la questione invece di affrontarla."
      }
    ]
  }
];

export const MATRIX_V2: MatrixRow[] = [
  { qid: "o1", a: "Monismo", b: "Dualismo", c: "Pluralismo" },
  { qid: "o2", a: "Materialista", b: "Idealista", c: "Neutrale" },
  { qid: "d1", a: "Immanentismo", b: "Trascendentismo", c: "Panteismo" },
  { qid: "d2", a: "Creazione", b: "Emanazione", c: "Demiurgo" },
  { qid: "d3", a: "Fede eccede", b: "Ambiti paralleli", c: "Alleate" },
  { qid: "s1", a: "Sostanze", b: "Unità elementari", c: "Materia e forma" },
  { qid: "s2", a: "Aggregato", b: "Emergenti", c: "Forma precede" },
  { qid: "r1", a: "Realismo", b: "Idealismo trasc.", c: "Costruttivismo" },
  { qid: "e1", a: "Ragione", b: "Esperienza", c: "Metodo scientifico" },
  { qid: "e2", a: "Scientismo", b: "Competenza limitata", c: "Eccede il metodo" },
  { qid: "e3", a: "Ipotesi", b: "Configurazioni", c: "Non empirico" },
  { qid: "v1", a: "Meccanicismo", b: "Vitalismo", c: "Organicismo" },
  { qid: "v2", a: "Continuità", b: "Origine aperta", c: "Principio ulteriore" },
  { qid: "m1", a: "Identità", b: "Funzionalismo", c: "Emergentismo" },
  { qid: "m2", a: "Simbolico", b: "Distribuito", c: "Sintassi insuff." },
  { qid: "m3", a: "Sì, ogni substrato", b: "Forse", c: "No, irriproducibile" },
  { qid: "u1", a: "Organismo", b: "Animale razionale", c: "Persona" },
  { qid: "u2", a: "Autocoscienza", b: "Libertà", c: "Relazione" },
  { qid: "u3", a: "Preesiste", b: "Nelle relazioni", c: "Entrambe" },
  { qid: "u4", a: "Autenticità", b: "Superabile", c: "Compimento" },
  { qid: "c1", a: "Origine", b: "Eternità", c: "Ciclo" },
  { qid: "c2", a: "Teleologia", b: "Non-teleologia", c: "Finalità locali" },
  { qid: "c3", a: "Necessarie", b: "Contingenti", c: "Descrittive" },
  { qid: "c4", a: "Determinismo", b: "Indeterminismo", c: "Modelli misti" },
  { qid: "k1", a: "Convenzionali", b: "Strutture oggettive", c: "Sacro" },
  { qid: "k2", a: "Solo empirico", b: "Ipotesi aperta", c: "Contemplativa" },
  { qid: "k3", a: "Più capacità", b: "Piani distinti", c: "Dipende" }
];

export const MCOL_V2: Record<string, (string | null)[]> = {
  o1: ["a", "b", "c"],
  o2: ["a", "b", "c"],
  d1: ["a", "b", "c"],
  d2: ["a", "b", "c"],
  d3: ["a", "b", "c"],
  s1: ["a", "b", "c"],
  s2: ["a", "b", "c"],
  r1: ["a", "b", "c"],
  e1: ["a", "b", "c"],
  e2: ["a", "b", "c"],
  e3: ["a", "b", "c"],
  v1: ["a", "b", "c"],
  v2: ["a", "b", "c"],
  m1: ["a", "b", "c"],
  m2: ["a", "b", "c"],
  m3: ["a", "b", "c"],
  u1: ["a", "b", "c"],
  u2: ["a", "b", "c"],
  u3: ["a", "b", "c"],
  u4: ["a", "b", "c"],
  c1: ["a", "b", "c"],
  c2: ["a", "b", "c"],
  c3: ["a", "b", "c"],
  c4: ["a", "b", "c"],
  k1: ["a", "b", "c"],
  k2: ["a", "b", "c"],
  k3: ["a", "b", "c"]
};

export const PROFILES_V2: Profile[] = [
  {
    n: "Platone",
    era: "IV sec. a.C.",
    m: {
      o1: "a", o2: "b", d1: "b", d2: "c", s1: "c", r1: "b",
      e1: "a", e3: "c", v1: "c", m1: "d", u1: "c", u2: "b",
      c2: "a", k1: "b", k2: "c"
    }
  },
  {
    n: "Democrito",
    era: "V–IV sec. a.C.",
    m: {
      o1: "c", o2: "a", d1: "a", d2: "d", s1: "b", s2: "a",
      r1: "a", e1: "b", e2: "a", v1: "a", v2: "a", m1: "a",
      m2: "a", u1: "a", c1: "b", c2: "b", c3: "b", c4: "a", c5: "b", k1: "a"
    }
  },
  {
    n: "Cartesio",
    era: "XVII secolo",
    m: {
      o1: "b", o3: "a", d1: "b", d2: "a", d3: "c", s1: "a",
      r1: "a", e1: "a", m1: "d", m2: "c", m3: "c", u1: "b", k2: "b"
    }
  },
  {
    n: "Spinoza",
    era: "XVII secolo",
    m: {
      o1: "a", o2: "c", o3: "c", d1: "c", d2: "d", d3: "b",
      s1: "a", r1: "a", e1: "a", m1: "e", u3: "b", c3: "a", c4: "a", c5: "b"
    }
  },
  {
    n: "Kant",
    era: "XVIII secolo",
    m: {
      o1: "b", d1: "b", d3: "c", s2: "c", r1: "b", e1: "a",
      e2: "b", u1: "c", u2: "b", u3: "c", k2: "b"
    }
  },
  {
    n: "Darwinismo",
    era: "dal XIX secolo",
    m: {
      o1: "a", o2: "a", d1: "a", d2: "d", s1: "b", s2: "b",
      r1: "a", e1: "c", e2: "b", v1: "a", v2: "a", m1: "c",
      u1: "a", c2: "b", c4: "c", c5: "a"
    }
  },
  {
    n: "Buddhismo",
    era: "dal V sec. a.C.",
    m: {
      o1: "c", o3: "c", d1: "a", d2: "b", s1: "d", s2: "b",
      r1: "c", e1: "d", u1: "e", u2: "c", u3: "b", u4: "a",
      k1: "c", k2: "c", k3: "b"
    }
  },
  {
    n: "Esistenzialismo ateo",
    era: "XX secolo",
    m: {
      o1: "a", d1: "a", d2: "d", d3: "d", r1: "d", e1: "d",
      m1: "d", u1: "e", u3: "b", u4: "a", c2: "b", k1: "a", k3: "b"
    }
  }
];
