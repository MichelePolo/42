export interface Cluster {
  id: string;
  name: string;
  gloss: string;
}

export interface Option {
  id: string;
  l: string; // Label (e.g. Teismo)
  f?: string; // Formula (e.g. 𝒟⁺ = { ... })
  b: string; // Body (explanation text)
  ex?: string[]; // Example entities/traditions
  im?: string; // Implications ("implica")
  co?: string; // Cost ("costo")
}

export interface Question {
  id: string;
  c: string; // Cluster ID (d, r, m, v, c, u, k, e, s)
  t: string; // Title
  f?: string; // Formula representation
  note?: string; // Extra note / contextualizer
  g?: string; // Guide text ("come orientarsi")
  an?: string; // Analogy ("analogia")
  o: Option[];
}

export interface Profile {
  n: string; // Name of philosopher/tradition
  era: string; // Historical period
  m: Record<string, string>; // Map of questionId -> selectedOptionId
}

export const CLUSTERS: Cluster[] = [
  { id: "d", name: "Il divino", gloss: "esiste un principio assoluto?" },
  { id: "r", name: "La realtà", gloss: "che cosa c'è, e da che cosa dipende" },
  { id: "m", name: "Il cosmo", gloss: "origine, fine, legge, caso" },
  { id: "v", name: "La vita", gloss: "il vivente è materia organizzata?" },
  { id: "c", name: "La coscienza", gloss: "mente, anima, io" },
  { id: "u", name: "L'uomo", gloss: "libertà, ragione, natura" },
  { id: "k", name: "La conoscenza", gloss: "verità, metodo, significato" },
  { id: "e", name: "L'etica", gloss: "il bene e l'azione giusta" },
  { id: "s", name: "Società e storia", gloss: "stato, direzione, natura" }
];

export const Q: Question[] = [
  {
    id: "q1",
    c: "d",
    t: "Esiste una realtà divina?",
    f: "𝒲 = 𝒟⁺ ∪ 𝒟⁻ ∪ 𝒟ˀ",
    note: "La prima biforcazione. Alle due alternative A e ¬A va aggiunta una terza uscita: non sappiamo, non possiamo sapere, oppure la domanda è mal posta.",
    g: "Non è una domanda su un oggetto in più nell'inventario del mondo: è una domanda su che tipo di spiegazione accetti come ultima. Chi risponde sì colloca il fondamento fuori dalla serie delle cause naturali; chi risponde no chiude la serie su se stessa; chi sceglie la terza uscita sostiene che manchi ancora un criterio per decidere. Prima di scegliere, chiediti quale delle tre ti costerebbe di più abbandonare: quello è il tuo impegno reale.",
    an: "È la differenza fra un sistema con un punto di ingresso esterno e uno che si autoavvia. Non cambia una singola funzione: cambia dove smetti di risalire lo stack.",
    o: [
      {
        id: "a",
        l: "Teismo",
        f: "𝒟⁺ = { esiste Dio, il divino o un principio assoluto }",
        b: "Esiste una realtà divina, personale o impersonale, distinta o coincidente con il mondo.",
        ex: ["ebraismo", "cristianesimo", "islam", "deismo", "neoplatonismo", "Vedānta"],
        im: "Che il mondo non basti a spiegare se stesso.",
        co: "Devi dire come una realtà fuori dal mondo agisca dentro il mondo, e perché fermarsi proprio lì."
      },
      {
        id: "b",
        l: "Ateismo",
        f: "𝒟⁻ : ¬∃D",
        b: "Non esiste alcuna realtà divina o soprannaturale. Tutto ciò che esiste appartiene alla natura.",
        ex: ["naturalismo", "materialismo", "umanesimo secolare"],
        im: "Che ogni spiegazione resti interna alla natura.",
        co: "Resta aperto perché ci sia qualcosa invece di nulla, e perché proprio queste leggi."
      },
      {
        id: "c",
        l: "Agnosticismo e non-teismo",
        f: "𝒟ˀ = { non sappiamo · non possiamo sapere · domanda da chiarire }",
        b: "Il giudizio resta sospeso, oppure il divino non è la categoria centrale della visione del mondo.",
        ex: ["agnosticismo", "ignosticismo", "buddhismo", "taoismo"],
        im: "Distinguere fra ciò che non sai e ciò che non è conoscibile.",
        co: "Sospendere il giudizio ha un costo pratico: la vita chiede comunque di orientarsi."
      }
    ]
  },
  {
    id: "q2",
    c: "d",
    t: "Il divino è uno o molteplice?",
    f: "𝒟⁺ → 𝒟₁ | 𝒟ₙ",
    note: "La divisione fra uno e molti non è netta come sembra: molte tradizioni politeiste leggono gli dèi come aspetti di una realtà superiore.",
    g: "La posta non è aritmetica ma esplicativa. Un principio unico dà unità e ordine, e poi deve giustificare il male e la varietà del mondo; molti principi spiegano bene conflitto e pluralità, e rinunciano a un fondamento ultimo. La terza via è storicamente la più diffusa: molti nomi, una sola sorgente.",
    an: "Monolite contro microservizi. L'uno è più coerente e più difficile da far tornare con l'esperienza; i molti sono più aderenti ai fenomeni e più difficili da unificare.",
    o: [
      {
        id: "a",
        l: "Un solo principio",
        f: "𝒟₁ = { monoteismo o principio unitario }",
        b: "Un unico Dio o un unico assoluto da cui tutto dipende.",
        ex: ["ebraismo", "cristianesimo", "islam", "l'Uno neoplatonico", "Vedānta non dualista"],
        im: "Una sola fonte di senso e di norma.",
        co: "Il problema del male diventa acuto: c'è un solo responsabile."
      },
      {
        id: "b",
        l: "Molti dèi",
        f: "𝒟ₙ = { politeismo }",
        b: "Una pluralità di potenze divine, ciascuna con dominio, storia e culto propri.",
        ex: ["religione greca e romana", "Egitto", "Mesopotamia", "religioni indigene"],
        im: "Domini distinti, ciascuno con la sua logica.",
        co: "Manka un criterio ultimo quando gli dèi confliggono fra loro."
      },
      {
        id: "c",
        l: "Unità con molte manifestazioni",
        f: "𝒟ₙ ⊂ 𝒟₁",
        b: "Gli dèi sono manifestazioni, potenze, funzioni cosmiche o aspetti di una sola realtà.",
        ex: ["alcune tradizioni induiste", "enoteismo"],
        im: "Che i nomi divini siano interfacce di una stessa realtà.",
        co: "Rischia di rendere puramente nominale la distinzione fra le divinità."
      }
    ]
  },
  {
    id: "q3",
    c: "d",
    t: "Il divino è personale o impersonale?",
    f: "𝒟⁺ → 𝒟ₚ | 𝒟ᵢ",
    note: "",
    g: "Qui si decide se il fondamento può essere interpellato. Un Dio personale rende possibili preghiera, alleanza, perdono e giudizio; un principio impersonale rende possibili contemplazione e conoscenza, non dialogo. Molte discussioni fra credenti e non credenti si chiariscono appena si stabilisce quale dei due si sta affermando o negando.",
    an: "Un'interfaccia con cui puoi negoziare, oppure una costante fisica. Puoi studiare entrambe; solo con la prima ha senso trattare.",
    o: [
      {
        id: "a",
        l: "Dio personale",
        f: "𝒟ₚ = { Dio conosce, vuole, ama, giudica, agisce }",
        b: "Il divino è un soggetto dotato di volontà e intenzione, con cui è possibile una relazione.",
        ex: ["teismo ebraico", "cristiano", "islamico", "induismo devozionale"],
        im: "Una relazione possibile, e quindi anche il rischio del rifiuto.",
        co: "Antropomorfismo: attribuisci al fondamento categorie ricavate da noi."
      },
      {
        id: "b",
        l: "Principio impersonale",
        f: "𝒟ᵢ = { ordine, unità, legge, assoluto }",
        b: "Il divino non è un io: è fondamento, struttura o assoluto senza intenzione.",
        ex: ["l'Uno", "Brahman", "Dao", "Spirito assoluto", "Natura"],
        im: "Un assoluto che non ha intenzioni verso di te.",
        co: "Difficile fondarci una vita religiosa fatta di richiesta e risposta."
      }
    ]
  },
  {
    id: "q4",
    c: "d",
    t: "Il divino coincide con il mondo?",
    f: "D = W  |  D ≠ W  |  W ⊂ D",
    note: "Tre modi di collocare il confine fra il divino e il reale osservabile.",
    g: "È la domanda sul confine. Se Dio e mondo coincidono, la natura è già tutto il sacro e il miracolo perde significato; se sono distinti, resta il problema del contatto; il panenteismo tiene insieme entrambe le esigenze e paga in precisione. Nota che la risposta qui vincola quelle su intervento e creazione: conviene tornarci dopo averle lette.",
    an: "Contenitore, contenuto, oppure contenuto che eccede il contenitore. Tre relazioni di appartenenza diverse, con conseguenze diverse su che cosa può accadere dentro.",
    o: [
      {
        id: "a",
        l: "Panteismo",
        f: "D = W",
        b: "Natura e divino sono due modi di indicare la stessa realtà.",
        ex: ["Spinoza — Deus sive Natura"],
        im: "Che la natura sia l'unica cosa che c'è, e sia divina.",
        co: "Difficile distinguerlo da un ateismo con vocabolario religioso."
      },
      {
        id: "b",
        l: "Teismo trascendente",
        f: "D ≠ W",
        b: "Dio crea o fonda il mondo ma non coincide con esso.",
        ex: ["teismo classico"],
        im: "Una differenza radicale fra creatore e creatura.",
        co: "Come fa il totalmente altro a toccare il mondo senza diventarne parte?"
      },
      {
        id: "c",
        l: "Panenteismo",
        f: "W ⊂ D",
        b: "Il mondo partecipa alla realtà divina ma non la esaurisce.",
        ex: ["teologia del processo", "alcune mistiche"],
        im: "Che il mondo sia reale in Dio senza esaurirlo.",
        co: "Il rapporto fra i due termini resta difficile da precisare."
      }
    ]
  },
  {
    id: "q5",
    c: "d",
    t: "Il divino è percepibile?",
    f: "𝒟⁺ → 𝒟ₚₑᵣc | 𝒟₋ₚₑᵣc",
    note: "",
    g: "Qui si gioca il rapporto fra esperienza e trascendenza. Se il divino si manifesta, c'è qualcosa da testimoniare e su cui discutere pubblicamente; se non è un oggetto fra gli oggetti, ogni esperienza resta interpretazione e nessuna prova può essere decisiva. La seconda opzione protegge la posizione da ogni confutazione, e per lo stesso motivo le toglie mordente.",
    an: "Un evento osservabile contro un invariante che si può solo inferire dal comportamento complessivo del sistema.",
    o: [
      {
        id: "a",
        l: "Si manifesta",
        f: "D ⇝ esperienza",
        b: "Attraverso apparizioni, eventi, esperienze mistiche, incarnazioni, natura, simboli e rituali.",
        ex: ["religioni rivelate", "misticismo", "cosmologie tradizionali"],
        im: "Che esperienze e testimonianze contino come evidenza.",
        co: "Le stesse esperienze ammettono spiegazioni psicologiche, neurologiche e culturali."
      },
      {
        id: "b",
        l: "Non è un oggetto fra gli oggetti",
        f: "D ∉ { oggetti dell'esperienza }",
        b: "Può essere inferito, creduto, intuito o contemplato, ma non descritto adeguatamente con concetti umani.",
        ex: ["teologia negativa", "apofatismo"],
        im: "Che ogni linguaggio su Dio sia inadeguato per principio.",
        co: "Se nulla può confermarla né smentirla, che differenza fa affermarla?"
      }
    ]
  },
  {
    id: "q6",
    c: "d",
    t: "Dio interviene nel mondo?",
    f: "D → W",
    note: "",
    g: "È la domanda più esposta al confronto con la scienza. La provvidenza rende il mondo drammatico e la storia significativa, ma deve convivere con la regolarità delle leggi e con il male non impedito; il deismo salva la coerenza e paga in rilevanza religiosa. Il caso di prova non è il miracolo compiuto, è quello mancato.",
    an: "Un sistema con manutenzione continua contro uno che gira dal deploy iniziale. Il secondo è più elegante e non risponde alle richieste.",
    o: [
      {
        id: "a",
        l: "Provvidenza",
        f: "D → W  in ogni istante",
        b: "Il divino crea, conserva, giudica, compie miracoli, rivela e orienta la storia.",
        ex: ["teismo provvidenziale"],
        im: "Che la storia abbia un interlocutore.",
        co: "Perché interviene qui e non là: il male resta il caso critico."
      },
      {
        id: "b",
        l: "Deismo",
        f: "D → W  solo all'origine",
        b: "Dio istituisce un universo ordinato da leggi e non interviene nel suo funzionamento.",
        ex: ["deismo illuminista"],
        im: "Leggi stabili senza eccezioni.",
        co: "Un Dio che non fa differenza operativa è difficile da distinguere da nessun Dio."
      }
    ]
  },
  {
    id: "q7",
    c: "d",
    t: "Come procede il mondo dal principio?",
    f: "𝒟⁺ → W",
    note: "",
    g: "Quattro modelli causali diversi, e ciascuno decide quanto il mondo sia contingente. La creazione introduce discontinuità e libertà; l'emanazione introduce gradi e continuità necessaria; l'ordinamento presuppone una materia già data e limita la responsabilità del principio; l'identità dissolve il problema chiudendo la distanza.",
    an: "Istanziare da zero, derivare per livelli successivi, compilare da sorgenti preesistenti, oppure riconoscere che sorgente ed eseguibile sono la stessa cosa vista in due modi.",
    o: [
      {
        id: "a",
        l: "Creazione",
        f: "D —atto libero→ W",
        b: "Il mondo dipende da un atto creatore libero.",
        ex: ["creazionismo metafisico"],
        im: "Un atto libero, e quindi la contingenza radicale del mondo.",
        co: "Che cosa significa causare l'esistenza, e non solo la forma?"
      },
      {
        id: "b",
        l: "Emanazione",
        f: "D → L₁ → L₂ → W",
        b: "Il mondo procede dal principio assoluto attraverso livelli successivi di realtà.",
        ex: ["Plotino"],
        im: "Una gerarchia continua di gradi di realtà.",
        co: "Se tutto procede necessariamente, il principio non è libero."
      },
      {
        id: "c",
        l: "Ordinamento demiurgico",
        f: "Demiurgo + materia + modelli → cosmo",
        b: "Il principio divino non crea dal nulla: ordina una realtà preesistente.",
        ex: ["il Timeo di Platone"],
        im: "Un limite alla potenza del principio: la materia resiste.",
        co: "Da dove viene la materia preesistente?"
      },
      {
        id: "d",
        l: "Identità",
        f: "D = W",
        b: "Non c'è alcun atto creatore distinto, perché Dio e natura coincidono.",
        ex: ["Spinoza"],
        im: "Nessuna origine da spiegare.",
        co: "Sparisce ogni distinzione fra fondamento e fondato."
      }
    ]
  },
  {
    id: "q8",
    c: "d",
    t: "Se Dio non esiste, in che senso?",
    f: "𝒟⁻ →",
    note: "L'ateismo non è una posizione sola: cambia a seconda di che cosa nega e di che cosa mette al posto.",
    g: "Serve distinguerle perché vengono continuamente confuse in un unico bersaglio. La tesi metafisica afferma qualcosa sul mondo e ha oneri di prova; la regola metodologica non afferma nulla e non ne ha. Gran parte delle dispute pubbliche nasce dallo scambiare la seconda per la prima, in entrambe le direzioni.",
    an: "Affermare che un valore è null contro il non usarlo mai nel codice. Sono cose diverse: solo la prima è una tesi sul dominio.",
    o: [
      {
        id: "a",
        l: "Ateismo metafisico",
        f: "¬∃D",
        b: "Nessuna realtà divina o soprannaturale, come tesi sull'essere.",
        ex: [],
        im: "Una tesi ontologica positiva.",
        co: "Anche negare richiede argomenti, non solo assenza di prove contrarie."
      },
      {
        id: "b",
        l: "Naturalismo",
        f: "∀x ( x esiste → x ∈ natura )",
        b: "La realtà si spiega con materia, energia, campi, processi, leggi e relazioni naturali.",
        ex: [],
        im: "Che ogni ente stia dentro la natura.",
        co: "Che cosa conti come naturale è a sua volta da definire, e il confine si sposta."
      },
      {
        id: "c",
        l: "Ateismo umanistico",
        f: "¬D ⇒ responsabilità dell'uomo",
        b: "L'assenza di Dio diventa il compito umano di costruire significato, valori e società.",
        ex: ["Feuerbach", "Nietzsche", "Sartre", "umanesimo secolare"],
        im: "Che il significato sia interamente un compito umano.",
        co: "Costruire valori senza fondamento esterno è più fragile di quanto sembri sotto pressione."
      },
      {
        id: "d",
        l: "Ateismo metodologico",
        f: "spiegazione → cause naturali verificabili",
        b: "La scienza non afferma che Dio non esista: semplicemente non lo usa come spiegazione operativa.",
        ex: [],
        im: "Solo una regola di lavoro, non una visione del mondo.",
        co: "Nella pratica scivola facilmente in tesi metafisica senza dichiararlo."
      }
    ]
  },
  {
    id: "q9",
    c: "d",
    t: "Che tipo di non-sapere?",
    f: "𝒟ˀ →",
    note: "",
    g: "Tre gradi diversi di modestia, con impegni molto diversi. Il primo lascia aperta la ricerca; il secondo la chiude per principio, ed è già una tesi forte sulla struttura della conoscenza umana; il terzo sposta il problema a monte, sulla semantica, e chiede di definire il termine prima di discuterne l'esistenza.",
    an: "Non ancora calcolato, non calcolabile, oppure query malformata. Il terzo caso non è un risultato: è un errore di sintassi.",
    o: [
      {
        id: "a",
        l: "Agnosticismo debole",
        f: "non sappiamo ancora",
        b: "La questione resta aperta, ma non è dichiarata inaccessibile in linea di principio.",
        ex: [],
        im: "Che nuove evidenze o argomenti possano contare.",
        co: "Rischia di essere una sospensione che non arriva mai a decidere."
      },
      {
        id: "b",
        l: "Agnosticismo forte",
        f: "non possiamo sapere",
        b: "La domanda eccede strutturalmente le capacità conoscitive umane.",
        ex: [],
        im: "Un limite strutturale della ragione.",
        co: "Come fai a sapere che non si può sapere? È già una conoscenza forte."
      },
      {
        id: "c",
        l: "Ignosticismo",
        f: "esistenza ⇒ definizione coerente dell'oggetto",
        b: "Prima di chiedere se Dio esista bisogna stabilire che cosa significhi la parola.",
        ex: [],
        im: "Che si debba prima fissare il significato del termine.",
        co: "Rischia di rifiutare la domanda invece di affrontarla."
      }
    ]
  },
  {
    id: "q10",
    c: "d",
    t: "La spiritualità richiede il divino?",
    f: "spiritualità → con D | senza D",
    note: "non-teismo ≠ ateismo materialista",
    g: "Domanda utile per non collassare due assi indipendenti. Si può avere pratica spirituale senza Dio, fatta di disciplina, meditazione e liberazione, e teismo dovuto senza alcuna vita spirituale. Trattare religioso e teista come sinonimi rende inintelligibile buona parte dell'Asia e diverse correnti occidentali.",
    an: "Interfaccia e implementazione: la pratica è ciò che fai, la metafisica è come la giustifichi. Non c'è mappatura uno a uno fra le due.",
    o: [
      {
        id: "a",
        l: "Sì",
        f: "spiritualità ⊂ 𝒟⁺",
        b: "L'esperienza spirituale è relazione con un principio o una persona divina.",
        ex: [],
        im: "Che l'esperienza spirituale sia sempre relazione con un altro.",
        co: "Esclude per definizione tradizioni che praticano senza credere in un Dio."
      },
      {
        id: "b",
        l: "No",
        f: "spiritualità ∩ 𝒟⁻ ≠ ∅",
        b: "Esistono pratiche e tradizioni spirituali non teistiche, centrate su disciplina, conoscenza o liberazione.",
        ex: ["buddhismo", "taoismo", "spiritualità naturalistica", "umanesimo religioso"],
        im: "Che pratica ed etica reggano senza fondamento teistico.",
        co: "Senza fondamento, che cosa distingue una spiritualità da una tecnica di benessere?"
      }
    ]
  },
  {
    id: "q11",
    c: "r",
    t: "Esiste una realtà indipendente dall'osservatore?",
    f: "𝒲 → ℛ⁺ | ℛ⁻ | ℛˀ",
    note: "",
    g: "È la domanda che decide che cosa fa una teoria scientifica: descrive strutture reali o organizza al meglio le nostre esperienze? Attenzione a non caricare troppo l'idealismo: quello trascendentale non nega il mondo esterno, dice che il mondo conosciuto porta sempre le impronte dello strumento che lo conosce. Il realismo strutturale è il compromesso più praticato oggi in filosofia della fisica.",
    an: "Il database esiste anche quando nessuna sessione è aperta, ma tu vedi sempre e solo il risultato di una query, mai la tabella nuda. Il realista dice che le righe ci sono; l'idealista studia lo schema del client.",
    o: [
      {
        id: "a",
        l: "Realismo",
        f: "ℛ⁺ : il mondo esiste anche se nessuno lo osserva",
        b: "Ingenuo — le cose sono come appaiono. Critico — la realtà esiste ma la conosciamo tramite modelli fallibili. Scientifico — le migliori teorie descrivono strutture reali. Strutturale — conosciamo relazioni, non nature ultime.",
        ex: ["realismo critico", "realismo strutturale"],
        im: "Che l'errore sia possibile perché c'è qualcosa che ti smentisce.",
        co: "Non puoi mai confrontare la rappresentazione con il reale non rappresentato."
      },
      {
        id: "b",
        l: "Idealismo",
        f: "ℛ⁻ : essere = essere percepito o costituito",
        b: "Soggettivo in Berkeley, trascendentale in Kant (la realtà conosciuta dipende dalle strutture cognitive), assoluto in Hegel.",
        ex: ["Berkeley", "Kant", "Hegel"],
        im: "Che le condizioni del conoscere siano parte dell'oggetto conosciuto.",
        co: "Devi spiegare la resistenza del mondo e l'accordo fra soggetti diversi."
      },
      {
        id: "c",
        l: "Non-dualismo",
        f: "X → soggetto | oggetto",
        b: "La separazione netta fra soggetto e oggetto è secondaria: entrambi derivano da qualcosa di più originario.",
        ex: ["monismo neutrale", "Vedānta", "fenomenologia", "filosofia del processo"],
        im: "Che soggetto e oggetto siano astrazioni da un campo unico.",
        co: "Difficile dire che cosa sia il campo neutrale senza usare i termini che volevi derivare."
      }
    ]
  },
  {
    id: "q12",
    c: "r",
    t: "La realtà fondamentale è una o molteplice?",
    f: "𝒲 → 𝒪₁ | 𝒪₂ | 𝒪ₙ",
    note: "",
    g: "Criterio pratico per decidere: il monismo è più economico e paga il conto sulle differenze qualitative — come fa la materia a sentire? Il dualismo rispetta l'esperienza e paga sull'interazione — dove esattamente si toccano? Il pluralismo è il più fedele ai fenomeni e il meno unificato. Nessuna delle tre è gratis: scegli quale debito preferisci.",
    an: "Un solo tipo primitivo con tutto derivato, due tipi non convertibili, oppure molti tipi primitivi. Il primo è elegante finché non devi rappresentare qualcosa che non ci sta dentro.",
    o: [
      {
        id: "a",
        l: "Monismo",
        f: "𝒪₁ : W = M | C | X | I",
        b: "Un solo tipo di realtà fondamentale: materiale, mentale, neutrale oppure informazionale (il reale come differenze e relazioni codificabili).",
        ex: ["materialismo", "idealismo", "monismo neutrale", "it from bit"],
        im: "Che ogni differenza sia derivata, non fondamentale.",
        co: "Le qualità dell'esperienza restano difficili da ricavare dal principio unico."
      },
      {
        id: "b",
        l: "Dualismo",
        f: "𝒪₂ : W = { materia, mente }",
        b: "Due principi irriducibili. Oltre a mente e materia: bene e male, spirito e natura, noumeno e fenomeno, sacro e profano.",
        ex: ["Cartesio"],
        im: "Due generi irriducibili l'uno all'altro.",
        co: "Il problema dell'interazione causale non ha mai ricevuto una soluzione soddisfacente."
      },
      {
        id: "c",
        l: "Pluralismo",
        f: "𝒪ₙ",
        b: "Molti principi o molti generi di enti fondamentali.",
        ex: ["radici di Empedocle", "semi di Anassagora", "atomi di Democrito", "monadi di Leibniz"],
        im: "Che il reale non sia riducibile a un principio.",
        co: "Rinunci al potere unificante che è il motivo per cui si fa metafisica."
      }
    ]
  },
  {
    id: "q13",
    c: "r",
    t: "Il reale è fatto di cose o di processi?",
    f: "𝒮 | 𝒫",
    note: "",
    g: "Domanda apparentemente astratta, in realtà decisiva su identità personale, specie biologiche e istituzioni. Se le cose sono processi stabilizzati, l'identità diventa sempre questione di grado e di soglia, mai di essenza: e allora la nave di Teseo non è un paradosso ma la condizione normale di ogni oggetto.",
    an: "Un record con chiave primaria contro un event stream: nel secondo caso l'oggetto è solo la proiezione corrente degli eventi, e la domanda « è ancora lo stesso? » non ha risposta secca.",
    o: [
      {
        id: "a",
        l: "Sostanzialismo",
        f: "𝒮 : identità che permane nel cambiamento",
        b: "Le cose hanno un nucleo che resta mentre le proprietà mutano.",
        ex: ["sostanze aristoteliche", "res cogitans e res extensa", "monadi"],
        im: "Che ci sia un portatore delle proprietà.",
        co: "La sostanza non si osserva mai: si postula sotto le proprietà osservate."
      },
      {
        id: "b",
        l: "Processualismo",
        f: "cosa = processo stabilizzato",
        b: "Le cose sono configurazioni relativamente stabili di processi: ciò che chiamiamo oggetto è un ritmo lento.",
        ex: ["Eraclito", "Bergson", "Whitehead", "sistemi dinamici"],
        im: "Che la stabilità sia un effetto, non un dato di partenza.",
        co: "Se tutto scorre, perché parliamo con tanto successo di cose che restano?"
      },
      {
        id: "c",
        l: "Relazioni ed eventi",
        f: "ente = nodo in una rete di relazioni",
        b: "Ciò che è fondamentale non sono né cose né flussi, ma eventi e le loro relazioni.",
        ex: ["ontologie relazionali"],
        im: "Che i termini siano meno fondamentali della relazione.",
        co: "Relazioni fra che cosa, se non c'è nulla di relazionato?"
      }
    ]
  },
  {
    id: "q14",
    c: "m",
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
    id: "q15",
    c: "m",
    t: "Il mondo ha un fine?",
    f: "W → F   ∨   W ↛ F",
    note: "",
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
    id: "q16",
    c: "m",
    t: "Le leggi di natura sono necessarie?",
    f: "leggi →",
    note: "",
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
    id: "q17",
    c: "m",
    t: "Tutto è determinato?",
    f: "stato + leggi ⇒ futuro",
    note: "",
    g: "Non confondere questa con la domanda sulla libertà, che è la 25: qui si parla soltanto di quanti futuri siano compatibili con lo stato presente. E la risposta può legittimamente cambiare a livelli diversi — microfisico, biologico, sociale — senza contraddizione, purché tu dica quale livello stai descrivendo.",
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
    id: "q18",
    c: "m",
    t: "Esiste il caso?",
    f: "caso → reale | apparente",
    note: "",
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
    id: "q19",
    c: "v",
    t: "La vita è riducibile alla materia?",
    f: "vita → ?",
    note: "",
    g: "Il vitalismo storico è stato smentito nei dettagli, ma la domanda vera non è sparita. Non è « serve una forza in più? », è « la spiegazione delle parti basta a spiegare l'organizzazione? ». Organicismo e autopoiesi rispondono di no senza aggiungere nulla di misterioso: spostano il livello esplicativo, non la sostanza.",
    an: "Conoscere ogni funzione di un sistema non ti dà l'architettura. La riduzione al modulo è vera e insufficiente: manca il livello in cui il sistema mantiene se stesso.",
    o: [
      {
        id: "a",
        l: "Meccanicismo",
        f: "vita = materia organizzata",
        b: "Il vivente si spiega con chimica, metabolismo, genetica, regolazione, evoluzione e interazioni molecolari.",
        ex: [],
        im: "Nessun confine di principio fra vivente e non vivente.",
        co: "L'organizzazione resta da spiegare, non solo da elencare componente per componente."
      },
      {
        id: "b",
        l: "Vitalismo",
        f: "vita = materia + principio vitale",
        b: "Il vivente possiede una forza irriducibile alla fisica.",
        ex: ["Driesch", "élan vital"],
        im: "Qualcosa di irriducibile nel vivente.",
        co: "Nessun candidato empirico ha retto: la biochimica ha spiegato ciò che il vitalismo dichiarava impossibile."
      },
      {
        id: "c",
        l: "Organicismo",
        f: "organismo > Σ componenti",
        b: "Organizzazione e totalità sono essenziali: la vita non si riduce alle parti prese separatamente.",
        ex: [],
        im: "Che il livello del tutto abbia potere esplicativo.",
        co: "Rischia di restare descrittivo se non specifica come il tutto agisca sulle parti."
      },
      {
        id: "d",
        l: "Autopoiesi",
        f: "vivente = sistema che produce e mantiene se stesso",
        b: "Ciò che definisce il vivente è la chiusura organizzativa, non la sostanza di cui è fatto.",
        ex: ["Maturana", "Varela"],
        im: "Che il criterio del vivente sia la chiusura organizzativa.",
        co: "Casi limite difficili: virus, protocelle, sistemi artificiali autoreplicanti."
      },
      {
        id: "e",
        l: "Vita come relazione",
        f: "vivente = f(organismo, ambiente)",
        b: "Il vivente non si separa dal proprio ambiente, dalla propria storia e dalle reti ecologiche.",
        ex: ["ecologia", "niche construction"],
        im: "Che l'unità di analisi sia organismo più ambiente.",
        co: "Se il confine sfuma, che cosa stai studiando esattamente?"
      }
    ]
  },
  {
    id: "q20",
    c: "v",
    t: "Le specie sono fisse?",
    f: "specie → fisse | in trasformazione",
    note: "",
    g: "È l'unica riga della matrice in cui la ricerca empirica ha di fatto chiuso la questione, e infatti la terza colonna resta vuota. Il punto filosoficamente vivo non è più se, ma che cosa ne segue: se le specie hanno una storia non hanno essenze, e l'uomo non ha uno statuto biologico separato. Le conseguenze cadono sulle domande 28 e 37.",
    an: "Non un enum fisso ma un albero di versioni con branch e merge: la categoria è un taglio che facciamo noi su una continuità.",
    o: [
      {
        id: "a",
        l: "Fissismo",
        f: "forma stabile e immutabile",
        b: "Ogni specie possiede una forma data una volta per tutte.",
        ex: [],
        im: "Tipi naturali stabili con confini netti.",
        co: "Contraddetto da fossili, genetica delle popolazioni e speciazione osservata."
      },
      {
        id: "b",
        l: "Evoluzionismo",
        f: "variazione + ereditarietà + selezione → evoluzione",
        b: "Le specie hanno una storia e derivano da trasformazioni di popolazioni precedenti. L'uomo rientra nella continuità del vivente.",
        ex: ["Darwin", "sintesi moderna"],
        im: "Continuità fra l'uomo e il resto del vivente.",
        co: "Toglie fondamento biologico a ogni eccezionalità umana: se la vuoi, va rifondata altrove."
      }
    ]
  },
  {
    id: "q21",
    c: "c",
    t: "La mente coincide con il cervello?",
    f: "M ? B",
    note: "",
    g: "Distingui due domande che vengono continuamente fuse: da che cosa dipende la mente — quasi tutti oggi rispondono dal cervello — e a che cosa si riduce la sua descrizione. Sono indipendenti. Nota anche che il funzionalismo è la posizione che rende sensata l'intelligenza artificiale, mentre l'identità stretta la renderebbe impossibile in linea di principio.",
    an: "Un programma non è i transistor, e non gira senza. Identità significa confondere i livelli; funzionalismo significa astrarre l'interfaccia dal supporto; cognizione estesa significa contare anche disco e rete come parte del processo.",
    o: [
      {
        id: "a",
        l: "Identità",
        f: "M = B",
        b: "Gli stati mentali sono stati cerebrali, descritti in un altro vocabolario.",
        ex: [],
        im: "Che « mentale » sia solo un altro vocabolario per il fisico.",
        co: "Lega la mente a un substrato specifico, escludendo altre realizzazioni possibili."
      },
      {
        id: "b",
        l: "Dualismo",
        f: "M ≠ B",
        b: "Mente o anima appartengono a un ordine non completamente fisico.",
        ex: ["Cartesio"],
        im: "Un ordine non fisico accanto a quello fisico.",
        co: "Come interagiscono? È la difficoltà che nessun dualismo ha mai risolto."
      },
      {
        id: "c",
        l: "Emergentismo",
        f: "M = f(B), M ⊄ descrizione dei neuroni",
        b: "La mente dipende dal cervello ma non si riduce alla somma delle sue parti.",
        ex: [],
        im: "Dipendenza senza riduzione.",
        co: "La parola emergenza nomina il problema più di quanto lo risolva."
      },
      {
        id: "d",
        l: "Funzionalismo",
        f: "M = organizzazione funzionale",
        b: "Conta il ruolo causale, non il materiale: la stessa mente potrebbe realizzarsi su substrati diversi.",
        ex: ["scienze cognitive"],
        im: "Che conti il ruolo causale, non il materiale.",
        co: "Sembra lasciar fuori proprio l'esperienza in prima persona."
      },
      {
        id: "e",
        l: "Cognizione incarnata o estesa",
        f: "M = f(B, corpo, azione, ambiente)",
        b: "La mente non finisce dove finisce il cranio: strumenti, corpo e ambiente sono parte del processo.",
        ex: ["Clark", "Varela"],
        im: "Che i confini della mente non coincidano col cranio.",
        co: "Se si estende troppo, il concetto perde potere discriminante."
      }
    ]
  },
  {
    id: "q22",
    c: "c",
    t: "La coscienza deriva dalla materia?",
    f: "materia ⇄ coscienza",
    note: "",
    g: "La difficoltà qui non è spiegare le funzioni cognitive, che sappiamo studiare, ma perché ci sia un'esperienza in prima persona che le accompagna. Ogni opzione paga un prezzo preciso: il fisicalismo deve dire perché l'elaborazione produca un vissuto; il panpsichismo deve dire come le esperienze elementari si combinino nella tua.",
    an: "Puoi tracciare ogni chiamata di un sistema senza che un solo log ti dica com'è essere quel sistema mentre gira. La domanda non è che cosa fa: è se c'è qualcuno dentro.",
    o: [
      {
        id: "a",
        l: "Fisicalismo o emergentismo",
        f: "materia organizzata → coscienza",
        b: "La coscienza compare a un certo grado di complessità organizzativa.",
        ex: [],
        im: "La coscienza appare oltre una soglia di complessità.",
        co: "Nessuno sa dire quale soglia, né perché una soglia debba produrre vissuto."
      },
      {
        id: "b",
        l: "Idealismo della coscienza",
        f: "coscienza → materia conosciuta",
        b: "La materia è ciò che appare alla coscienza, non il contrario.",
        ex: [],
        im: "Che il dato primo sia l'esperienza.",
        co: "Difficile spiegare la stabilità intersoggettiva del mondo fisico."
      },
      {
        id: "c",
        l: "Panpsichismo o doppio aspetto",
        f: "realtà fondamentale → aspetto fisico + aspetto mentale",
        b: "Il mentale non emerge: è un aspetto originario del reale.",
        ex: ["Spinoza", "Whitehead", "panpsichismo contemporaneo"],
        im: "Che il mentale non emerga ma sia originario.",
        co: "Il problema della combinazione: come fanno micro-esperienze a comporre la tua?"
      },
      {
        id: "d",
        l: "Spiritualismo o dualismo",
        f: "coscienza → principio spirituale",
        b: "La coscienza rinvia a un principio di ordine diverso dal fisico.",
        ex: [],
        im: "Un principio di ordine diverso.",
        co: "Torna intatto il problema dell'interazione."
      },
      {
        id: "e",
        l: "Agnosticismo",
        f: "?",
        b: "Non sappiamo ancora come sorga l'esperienza cosciente, e forse ci mancano i concetti adatti.",
        ex: ["mysterianism"],
        im: "Che possa mancarci il concetto giusto, non solo il dato.",
        co: "Non è una spiegazione: è un promemoria onesto."
      }
    ]
  },
  {
    id: "q23",
    c: "c",
    t: "Esiste un'anima?",
    f: "uomo = corpo + anima",
    note: "",
    g: "Prima di rispondere scegli il significato, o discuterai di tre cose diverse: sostanza separabile, forma organizzativa del corpo, oppure centro morale. Nella seconda accezione, quella aristotelica, molti materialisti contemporanei potrebbero accettare il termine senza cambiare idea su nulla: qui la disputa è spesso lessicale prima che ontologica.",
    an: "Un processo separabile che sopravvive alla macchina, oppure l'organizzazione stessa della macchina. La seconda non richiede nulla in più della macchina, e non le sopravvive.",
    o: [
      {
        id: "a",
        l: "Esiste",
        f: "uomo = corpo + anima",
        b: "Come sostanza separabile, come forma e principio organizzativo del corpo, come centro morale e spirituale, oppure come partecipazione a un'anima universale.",
        ex: ["Platone", "Aristotele", "Tommaso d'Aquino"],
        im: "Un principio di identità che non coincide col corpo.",
        co: "Nessuna evidenza indipendente; e se è forma del corpo, non sopravvive al corpo."
      },
      {
        id: "b",
        l: "Non esiste",
        f: "uomo = organismo biologico e storico",
        b: "Ciò che chiamiamo anima si spiega con cervello, memoria, identità, linguaggio, relazioni e cultura.",
        ex: [],
        im: "Che identità e interiorità siano prodotti biologici e culturali.",
        co: "Devi rendere conto dell'unità dell'esperienza senza postulare un centro."
      },
      {
        id: "c",
        l: "Non sappiamo",
        f: "nessun criterio condiviso di verifica",
        b: "Manca un criterio universalmente accettato per verificare o falsificare l'esistenza dell'anima.",
        ex: [],
        im: "Che manchi un criterio condiviso di decisione.",
        co: "L'assenza di criterio non è neutra: nella pratica si finisce per vivere come se una risposta fosse vera."
      }
    ]
  },
  {
    id: "q24",
    c: "c",
    t: "L'io è permanente?",
    f: "io → sostanza | processo | ∅",
    note: "",
    g: "Non è una curiosità orientale: Hume arriva alla stessa conclusione per via introspettiva, osservando che quando cerca l'io trova sempre e solo percezioni, mai il percipiente. La domanda ha effetti pratici immediati su responsabilità, promesse, terapia e su come tratti i tuoi stati mentali quando ti identifichi con essi.",
    an: "Identità per riferimento contro identità per continuità di stato: la nave di Teseo con un puntatore stabile, oppure senza.",
    o: [
      {
        id: "a",
        l: "Io sostanziale",
        f: "∃ soggetto che permane",
        b: "Un sggetto identico a se stesso attraverso tutti i cambiamenti.",
        ex: ["Cartesio"],
        im: "Un soggetto identico nel tempo, portatore della responsabilità.",
        co: "Introspettivamente non lo trovi: trovi contenuti, mai il contenitore."
      },
      {
        id: "b",
        l: "Io processuale",
        f: "io = continuità di memoria, corpo, carattere, relazioni",
        b: "L'identità è una continuità costruita, non un nucleo dato in partenza.",
        ex: [],
        im: "Identità come continuità graduale e costruita.",
        co: "Ammette casi indecidibili: quanta discontinuità serve per rompere l'identità?"
      },
      {
        id: "c",
        l: "Assenza di io permanente",
        f: "persona = flusso di processi interdipendenti",
        b: "Non c'è un sé stabile da trovare: solo aggregati in relazione.",
        ex: ["Hume", "buddhismo", "neuroscienze", "filosofie processuali"],
        im: "Che l'io sia una costruzione utile ma non un'entità.",
        co: "Chi è allora il soggetto della responsabilità, della promessa e del cambiamento?"
      }
    ]
  },
  {
    id: "q25",
    c: "u",
    t: "L'uomo è libero?",
    f: "scelta → ?",
    note: "",
    g: "La mossa decisiva è chiedersi che cosa intendi per libero: poter fare altrimenti a parità esatta di condizioni, oppure agire dalle proprie ragioni senza costrizione. Con la prima definizione il determinismo esclude la libertà; con la seconda no. Buona parte del dibattito millenario è, a rigore, una disputa sulla definizione.",
    an: "Chiedersi se un processo sia libero mentre esegue esattamente le sue istruzioni. Dipende se libero significa non deterministico oppure non interrotto dall'esterno.",
    o: [
      {
        id: "a",
        l: "Libertarismo",
        f: "∃ alternative realmente aperte",
        b: "Il soggetto può scegliere fra possibilità genuinamente alternative.",
        ex: [],
        im: "Che nella stessa identica situazione avresti potuto agire diversamente.",
        co: "Difficile da conciliare con la chiusura causale del mondo fisico."
      },
      {
        id: "b",
        l: "Determinismo",
        f: "scelta ⇐ cause",
        b: "Ogni scelta deriva da biologia, carattere, ambiente, storia, inconscio e condizioni sociali.",
        ex: [],
        im: "Che la responsabilità vada ripensata da capo.",
        co: "Nella pratica nessuno riesce a vivere e a giudicare senza presupporre scelte reali."
      },
      {
        id: "c",
        l: "Compatibilismo",
        f: "libertà = azione da motivazioni proprie senza coercizione",
        b: "La libertà non richiede assenza di cause, ma assenza di costrizione esterna.",
        ex: ["Hume", "Spinoza", "Dennett"],
        im: "Libertà come assenza di coercizione, non di cause.",
        co: "Accusa classica: hai salvato la parola cambiandone il significato."
      }
    ]
  },
  {
    id: "q26",
    c: "u",
    t: "L'uomo è razionale?",
    f: "uomo = animale + λόγος ?",
    note: "",
    g: "Psicologia e neuroscienze hanno spostato il baricentro: le emozioni non disturbano la decisione, la rendono possibile — chi perde l'accesso emotivo perde la capacità di scegliere, non la logica. Ma il passo dal « la ragione non è sola » al « la ragione è solo una maschera » è un salto ulteriore, e va argomentato a parte.",
    an: "Il segnale emotivo non è rumore: è il sistema di priorità che decide quale ramo esplorare. Senza, non hai razionalità pura: hai stallo.",
    o: [
      {
        id: "a",
        l: "Animale razionale",
        f: "uomo = animale + logos",
        b: "La ragione è ciò che definisce la specificità umana.",
        ex: ["Aristotele"],
        im: "Una specificità umana fondata sul logos.",
        co: "Sottovaluta quanto poco razionalmente decidiamo di fatto."
      },
      {
        id: "b",
        l: "Ragione e passioni cooperano",
        f: "decisione = f(ragione, emozione)",
        b: "Le emozioni orientano attenzione, decisioni e valori: non sono un disturbo del pensiero.",
        ex: ["Hume", "Damasio"],
        im: "Un modello integrato della decisione.",
        co: "Rischia di essere una posizione di compromesso poco impegnativa."
      },
      {
        id: "c",
        l: "L'irrazionale precede la ragione",
        f: "ragione ⊂ forze non razionali",
        b: "Volontà, pulsione, inconscio e archetipi vengono prima e usano la ragione come strumento.",
        ex: ["Schopenhauer", "Nietzsche", "Freud", "Jung"],
        im: "Che le ragioni siano spesso razionalizzazioni a posteriori.",
        co: "Se la ragione è solo effetto, quale statuto ha questa stessa tesi?"
      }
    ]
  },
  {
    id: "q27",
    c: "u",
    t: "L'uomo è individuo o relazione?",
    f: "io ? noi",
    note: "",
    g: "Non è solo antropologia: è la premessa nascosta di ogni discorso politico. Se l'individuo precede la comunità, i diritti sono anteriori allo Stato e lo Stato li riconosce; se l'identità nasce nella relazione, l'appartenenza non è una scelta secondaria ma la condizione stessa dell'io. Guarda dove ti porta, poi confronta con la domanda 35.",
    an: "Un oggetto con stato proprio che poi entra in rete, oppure un nodo la cui identità è definita dalle connessioni. Cambia completamente che cosa significhi isolarlo.",
    o: [
      {
        id: "a",
        l: "Individualismo",
        f: "individuo ≺ società",
        b: "L'individuo precede la società e possiede identità e diritti prima delle relazioni sociali.",
        ex: ["Locke", "liberalismo classico"],
        im: "Diritti e identità anteriori al legame sociale.",
        co: "Nessun individuo si è mai costituito fuori da una lingua e da una comunità."
      },
      {
        id: "b",
        l: "Relazionalismo",
        f: "io = f(tu, noi, comunità)",
        b: "L'identità si costituisce nella relazione: il soggetto è un effetto del legame, non il suo presupposto.",
        ex: ["Hegel", "Buber", "Levinas", "Ubuntu", "confucianesimo", "personalismo"],
        im: "Che il soggetto sia un effetto della relazione.",
        co: "Rischia di dissolvere la possibilità di criticare la comunità dall'interno."
      }
    ]
  },
  {
    id: "q28",
    c: "u",
    t: "L'uomo ha una natura fissa?",
    f: "essenza ? esistenza",
    note: "",
    g: "Attenzione al termine di mezzo: dire che la natura umana è evolutiva non significa dire che sia arbitraria. Vincoli profondi e plasticità convivono benissimo. La domanda operativa, e scomoda, è quanto di ciò che chiami natura sia in realtà storia recente — e il criterio per distinguerle non è ovvio.",
    an: "Schema fisso, schema con migrazioni, oppure nessuno schema e solo i dati che ci scrivi. Il secondo caso è quello reale: il vincolo c'è, ma ha una versione.",
    o: [
      {
        id: "a",
        l: "Essenza stabile",
        f: "∃ natura umana universale",
        b: "L'essere umano possiede caratteristiche costanti attraverso epoche e culture.",
        ex: [],
        im: "Criteri universali per giudicare culture e istituzioni.",
        co: "Storicamente, ciò che si dichiarava naturale si è spesso rivelato locale."
      },
      {
        id: "b",
        l: "Natura evolutiva",
        f: "natura = esito di evoluzione biologica e culturale",
        b: "Ciò che chiamiamo natura umana è una storia sedimentata, non un dato eterno.",
        ex: [],
        im: "Vincoli reali ma datati, e quindi modificabili.",
        co: "Serve un criterio per distinguere il vincolo profondo dalla contingenza recente."
      },
      {
        id: "c",
        l: "Nessuna essenza prefissata",
        f: "esistenza → costruzione dell'essenza",
        b: "L'uomo è ciò che fa di sé: l'essenza viene dopo, non prima.",
        ex: ["Sartre"],
        im: "Piena responsabilità e nessun alibi.",
        co: "Ignora vincoli biologici e psicologici ampiamente documentati."
      }
    ]
  },
  {
    id: "q29",
    c: "k",
    t: "Il significato è nel mondo o lo produce l'uomo?",
    f: "significato → trovato | costruito | assente",
    note: "",
    g: "Il terzo caso va letto bene, perché viene quasi sempre frainteso: dire che il mondo non contiene significato non implica che nulla abbia senso. Implica che il senso sia un'attività e non un ritrovamento, e quindi che sia revocabile e vada mantenuto attivamente. È una posizione più impegnativa, non più comoda.",
    an: "Metadati già presenti nel dato, oppure aggiunti dal parser. Nel secondo caso l'informazione è reale, ma esiste solo nella relazione fra dato e interprete.",
    o: [
      {
        id: "a",
        l: "Significato oggettivo",
        f: "significato ∈ mondo",
        b: "Deriva da Dio, ordine cosmico, natura, finalità, archetipi, legge morale o storia dello Spirito.",
        ex: [],
        im: "Che ci sia un senso da scoprire, e quindi da poter sbagliare.",
        co: "Come lo verifichi, se ogni accesso passa da un'interpretazione?"
      },
      {
        id: "b",
        l: "Significato costruito",
        f: "significato = f(mondo, linguaggio, cultura, interprete)",
        b: "Il senso nasce nell'interpretazione: è reale ma non preesistente.",
        ex: ["ermeneutica", "costruttivismo"],
        im: "Che il senso sia reale ma generato nella relazione.",
        co: "Scivola verso il relativismo: ogni interpretazione vale quanto le altre?"
      },
      {
        id: "c",
        l: "Nessun significato intrinseco",
        f: "significato ∉ mondo",
        b: "Il mondo è muto: il significato è creazione umana, e questo è insieme il peso e la libertà.",
        ex: ["esistenzialismo", "nichilismo", "umanesimo secolare"],
        im: "Che il senso sia interamente un tuo compito.",
        co: "Peso considerevole, e nessuna garanzia che regga nelle situazioni estreme."
      }
    ]
  },
  {
    id: "q30",
    c: "k",
    t: "La verità è assoluta?",
    f: "verità → ?",
    note: "",
    g: "Il fallibilismo è la posizione operativa di fatto della scienza, e conviene distinguerlo con cura dal relativismo: dire che ogni conoscenza è correggibile non è dire che ogni opinione valga uguale. Il primo mantiene intatta la nozione di errore; il secondo la perde, e con essa la possibilità di imparare qualcosa.",
    an: "Il test può fallire domani: questo non significa che non esista un comportamento corretto. Fallibilismo è avere test; relativismo è non avere asserzioni.",
    o: [
      {
        id: "a",
        l: "Assolutismo",
        f: "∃ verità indipendenti da epoca e osservatore",
        b: "Alcune verità valgono a prescindere da cultura, utilità e punto di vista.",
        ex: [],
        im: "Verità indipendenti dal punto di vista.",
        co: "Ogni accesso alla verità resta comunque situato in un linguaggio e in un'epoca."
      },
      {
        id: "b",
        l: "Relativismo e prospettivismo",
        f: "verità = f(cultura, linguaggio, paradigma, posizione)",
        b: "Ogni verità è detta da qualche luogo e in qualche lingua.",
        ex: ["Nietzsche", "Kuhn"],
        im: "Che ogni criterio sia interno a un contesto.",
        co: "L'autocontraddizione classica: vale relativamente anche questa affermazione?"
      },
      {
        id: "c",
        l: "Fallibilismo",
        f: "∃ verità ∧ ∀ conoscenza correggibile",
        b: "La verità esiste, ma ogni nostra conoscenza resta rivedibile.",
        ex: ["Peirce", "Popper"],
        im: "Verità come limite regolativo, conoscenza sempre rivedibile.",
        co: "Non ti dice mai quando puoi considerare chiusa una questione."
      },
      {
        id: "d",
        l: "Scetticismo",
        f: "sospensione del giudizio",
        b: "Non possiamo raggiungere una verità certa: può essere razionale non decidere.",
        ex: ["Pirrone", "Sesto Empirico"],
        im: "La sospensione del giudizio come esito razionale.",
        co: "Difficile da praticare: agire richiede comunque di assumere qualcosa."
      }
    ]
  },
  {
    id: "q31",
    c: "k",
    t: "La conoscenza nasce dalla ragione o dall'esperienza?",
    f: "K → ?",
    note: "",
    g: "La contrapposizione secca è didattica: nessun empirista nega la logica, nessun razionalista ignora l'esperienza. Il punto vero è quale delle due abbia l'ultima parola in caso di conflitto, e se esistano strutture che l'esperienza presuppone anziché fornire. È qui che Kant fa la mossa: il formato non è nei dati, è nel lettore.",
    an: "Dati contro schema. L'empirista dice che lo schema si inferisce dai dati; il razionalista che senza schema i dati non sono nemmeno leggibili.",
    o: [
      {
        id: "a",
        l: "Razionalismo",
        f: "∃ principi non derivati dai sensi",
        b: "La mente conosce strutture che l'esperienza non potrebbe fornire.",
        ex: ["Platone", "Cartesio", "Spinoza", "Leibniz"],
        im: "Strutture conoscitive non ricavate dai sensi.",
        co: "Rischio di scambiare abitudini concettuali per necessità del pensiero."
      },
      {
        id: "b",
        l: "Empirismo",
        f: "K ⊂ esperienza",
        b: "Ogni conoscenza significativa deriva dall'esperienza sensibile.",
        ex: ["Locke", "Hume"],
        im: "Ogni concetto rendicontabile all'esperienza.",
        co: "Necessità logica e matematica restano difficili da giustificare così."
      },
      {
        id: "c",
        l: "Sintesi",
        f: "K = E + S",
        b: "L'esperienza fornisce la materia, le strutture del soggetto la forma.",
        ex: ["Kant"],
        im: "Che le condizioni del conoscere siano parte del conosciuto.",
        co: "La cosa in sé resta inaccessibile per costruzione."
      },
      {
        id: "d",
        l: "Intuizione",
        f: "K ⇠ apprensione diretta",
        b: "Alcune verità vengono colte immediatamente, senza mediazione discorsiva.",
        ex: ["Bergson", "Husserl"],
        im: "Un accesso non discorsivo ad alcune verità.",
        co: "Come distingui un'intuizione vera da una convinzione molto forte?"
      },
      {
        id: "e",
        l: "Rivelazione",
        f: "K ⇠ tradizione o comunicazione divina",
        b: "Alcune verità derivano da una comunicazione divina o da una tradizione sacra.",
        ex: [],
        im: "Un'autorità conoscitiva esterna alla ragione.",
        co: "Serve un criterio per riconoscere la rivelazione autentica, e quel criterio da dove viene?"
      }
    ]
  },
  {
    id: "q32",
    c: "k",
    t: "La scienza può spiegare tutto?",
    f: "reale ? scientificamente spiegabile",
    note: "",
    g: "Distingui il metodo dalla tesi, o la discussione diventa una rissa. Il naturalismo metodologico è una regola di lavoro che non nega nulla di ciò che sta fuori; lo scientismo è una tesi filosofica sul reale — e nota che non è a sua volta una tesi scientifica, il che è precisamente la sua difficoltà principale.",
    an: "Un profiler misura latenza e memoria e non ti dirà mai se il prodotto meriti di esistere. Non è un limite del profiler: è fuori dominio.",
    o: [
      {
        id: "a",
        l: "Scientismo forte",
        f: "reale = scientificamente spiegabile",
        b: "Ciò che non è accessibile al metodo scientifico non è conoscenza.",
        ex: [],
        im: "Che ciò che non è misurabile non sia conoscenza.",
        co: "L'affermazione stessa non è verificabile scientificamente."
      },
      {
        id: "b",
        l: "Naturalismo metodologico",
        f: "metodo ⊂ fenomeni naturali",
        b: "La scienza studia i fenomeni naturali senza doversi pronunciare su significato ultimo, valore, Dio, esperienza mistica o bellezza.",
        ex: [],
        im: "Una regola d'ingaggio, non una metafisica.",
        co: "Non ti dice che cosa fare delle domande che restano fuori dal perimetro."
      },
      {
        id: "c",
        l: "Pluralismo epistemologico",
        f: "K = { scienza, filosofia, arte, storia, interpretazione, esperienza religiosa }",
        b: "Forme di conoscenza diverse, con metodi e gradi di verificabilità non identici.",
        ex: [],
        im: "Che esistano conoscenze diverse e non gerarchizzabili in blocco.",
        co: "Senza criteri di distinzione, rischia di legittimare qualunque pretesa di sapere."
      }
    ]
  },
  {
    id: "q33",
    c: "e",
    t: "Il bene è oggettivo?",
    f: "valore → ?",
    note: "",
    g: "Il caso di prova è sempre lo stesso: pratiche condannate universalmente oggi e accettate ieri. Il realista dice che allora ci si sbagliava; il relativista, per coerenza, deve dire che erano giuste in quel contesto. Prima di scegliere, verifica quale delle due conclusioni sei disposto a sostenere fino in fondo, non in astratto ma su un caso concreto.",
    an: "Vincolo del dominio oppure vincolo della configurazione d'ambiente. Se è configurazione, non puoi dire che un altro ambiente sia in errore: è solo diverso.",
    o: [
      {
        id: "a",
        l: "Realismo morale",
        f: "∃ valori veri indipendenti dalle preferenze",
        b: "Esistono fatti morali che possiamo scoprire, e su cui possiamo sbagliarci.",
        ex: [],
        im: "Che si possa sbagliare moralmente anche essendo tutti d'accordo.",
        co: "Dove starebbero questi fatti morali, e con quale facoltà li conosceresti?"
      },
      {
        id: "b",
        l: "Relativismo",
        f: "bene = f(cultura)",
        b: "Il bene dipende dal contesto culturale che lo definisce.",
        ex: [],
        im: "Che la critica trans-culturale perda fondamento.",
        co: "Rende difficile persino condannare la propria cultura dall'interno."
      },
      {
        id: "c",
        l: "Costruttivismo morale",
        f: "norme ⇐ accordo, contratto, reciprocità, universalizzazione",
        b: "I valori non si trovano: si costruiscono con procedure razionali condivise.",
        ex: ["Rawls", "Habermas"],
        im: "Norme valide perché costruite con procedure eque.",
        co: "Chi non entra nella procedura — futuri, animali, esclusi — resta senza tutela."
      },
      {
        id: "d",
        l: "Nichilismo morale",
        f: "∄ valori oggettivi",
        b: "Nessun giudizio morale è vero in senso proprio.",
        ex: [],
        im: "Che nessun giudizio morale sia vero o falso.",
        co: "Difficilissimo da vivere coerentemente: di fatto nessuno ci riesce."
      }
    ]
  },
  {
    id: "q34",
    c: "e",
    t: "Che cosa rende buona un'azione?",
    f: "bontà(azione) = ?",
    note: "",
    g: "Le cinque risposte non si escludono nella pratica: quasi tutti ragionano per regole nei casi ordinari, per conseguenze nei casi tragici e per carattere sul lungo periodo. Il valore dell'esercizio non è scegliere una scuola, è capire quale criterio usi tu quando i tre confliggono — perché è lì che si vede la posizione reale.",
    an: "Vincolo di precondizione, funzione obiettivo, o qualità dell'implementazione. Sono tre punti diversi in cui inserire il controllo, e danno risposte opposte sui casi limite.",
    o: [
      {
        id: "a",
        l: "Intenzione",
        f: "valuta il volere",
        b: "Conta ciò che il soggetto voleva davvero fare.",
        ex: [],
        im: "Che conti la qualità del volere.",
        co: "Le buone intenzioni producono anche danni gravi, e restano buone."
      },
      {
        id: "b",
        l: "Regola o dovere",
        f: "azione ⊨ principio universalizzabile",
        b: "È giusta l'azione conforme a un principio che possiamo volere come legge per tutti.",
        ex: ["Kant"],
        im: "Vincoli che non si negoziano nemmeno per un bene maggiore.",
        co: "Nei conflitti fra doveri la regola non basta a decidere."
      },
      {
        id: "c",
        l: "Conseguenze",
        f: "max Σ benessere",
        b: "È giusta l'azione che produce il massimo benessere complessivo.",
        ex: ["utilitarismo", "Bentham", "Mill"],
        im: "Che tutto sia in linea di principio commensurabile.",
        co: "Può giustificare il sacrificio del singolo per l'aggregato."
      },
      {
        id: "d",
        l: "Virtù",
        f: "valuta il carattere",
        b: "Conta la disposizione stabile della persona, non il singolo atto isolato.",
        ex: ["Aristotele"],
        im: "Che la domanda giusta sia quale persona stai diventando.",
        co: "Dà poca guida sul singolo atto difficile, qui e ora."
      },
      {
        id: "e",
        l: "Cura",
        f: "risposta alla vulnerabilità concreta",
        b: "Conta la risposta ai bisogni dell'altro nella relazione reale, non la regola astratta.",
        ex: ["Gilligan", "etica della cura"],
        im: "Priorità alla relazione concreta sulla regola astratta.",
        co: "Rischia la parzialità: chi ti è vicino finisce per contare di più."
      }
    ]
  },
  {
    id: "q35",
    c: "s",
    t: "Lo Stato è naturale o artificiale?",
    f: "Stato ⇐ ?",
    note: "",
    g: "Chiediti che cosa ciascuna risposta consideri originario e che cosa derivato. Le tesi contrattuali fondano la legittimità sul consenso e devono poi spiegare perché obblighi chi non ha firmato nulla; quelle storiche spiegano molto bene la genesi e faticano a fondare un dovere. Genesi e legittimità sono due domande diverse: tienile separate.",
    an: "Requisito emergente dal dominio, contratto fra client, oppure vincolo imposto dall'infrastruttura. Legittimità e potere effettivo non coincidono.",
    o: [
      {
        id: "a",
        l: "Naturale",
        f: "uomo = ζῷον πολιτικόν",
        b: "L'uomo è per natura un animale politico: la comunità non è un'aggiunta.",
        ex: ["Aristotele"],
        im: "Che la comunità politica non sia un'aggiunta opzionale.",
        co: "Tende a naturalizzare forme storiche del tutto particolari."
      },
      {
        id: "b",
        l: "Contrattuale",
        f: "individui —patto→ Stato",
        b: "Lo Stato nasce da un accordo fra individui che precedono l'istituzione.",
        ex: ["Hobbes", "Locke", "Rousseau"],
        im: "Legittimità fondata sul consenso.",
        co: "Il patto originario non è mai avvenuto: perché obbliga chi non l'ha stipulato?"
      },
      {
        id: "c",
        l: "Strumento di dominio",
        f: "Stato ⊨ rapporti di classe",
        b: "Lo Stato protegge determinati rapporti economici e di potere.",
        ex: ["Marx", "anarchismo"],
        im: "Che la neutralità dello Stato sia apparente.",
        co: "Non tutte le funzioni statali si riducono al dominio di classe."
      },
      {
        id: "d",
        l: "Costruzione storica",
        f: "istituzioni ⇐ reti di sapere e potere",
        b: "Istituzioni e soggetti emergono insieme, dentro pratiche storiche di sapere e potere.",
        ex: ["Foucault"],
        im: "Che soggetti e istituzioni si formino l'un l'altro.",
        co: "Spiega la genesi e fatica a fondare un criterio normativo per giudicarla."
      }
    ]
  },
  {
    id: "q36",
    c: "s",
    t: "La storia ha una direzione?",
    f: "storia → ?",
    note: "",
    g: "Il progresso in senso forte è difficile da sostenere dopo il Novecento, ma la sua negazione totale è altrettanto impegnativa: qualcosa in campo sanitario, giuridico e conoscitivo si accumula davvero e non si perde facilmente. Prima di rispondere in blocco, distingui i domini: la risposta giusta potrebbe essere diversa per la medicina e per la politica.",
    an: "Un branch che accumula commit contre un log di eventi non ordinabili per qualità. In alcuni sottosistemi la versione nuova è oggettivamente migliore; per il sistema complessivo la metrica non esiste.",
    o: [
      {
        id: "a",
        l: "Progresso",
        f: "storia → ragione, libertà, emancipazione",
        b: "Il tempo storico ha un vettore: conoscenza, libertà o sviluppo spirituale.",
        ex: ["Illuminismo", "Hegel", "Marx"],
        im: "Un criterio per giudicare le epoche l'una rispetto all'altra.",
        co: "Il Novecento resta la principale obiezione empirica."
      },
      {
        id: "b",
        l: "Nessuna direzione",
        f: "storia = esito contingente",
        b: "La storia risulta da azioni, conflitti ed eventi senza disegno complessivo.",
        ex: [],
        im: "Che ogni conquista sia in linea di principio reversibile.",
        co: "Fatica a spiegare le accumulazioni reali di conoscenza e di diritto."
      },
      {
        id: "c",
        l: "Ciclo",
        f: "nascita → crescita → decadenza → ricominciamento",
        b: "Le civiltà seguono fasi ricorrenti.",
        ex: ["Polibio", "Vico", "Spengler"],
        im: "Ricorrenze strutturali sotto le differenze di superficie.",
        co: "I cicli si vedono bene solo a posteriori e con molta selezione dei casi."
      },
      {
        id: "d",
        l: "Declino",
        f: "storia → perdita",
        b: "Il tempo comporta perdita di autenticità, valori o ordine.",
        ex: [],
        im: "La modernità sia essenzialmente perdita.",
        co: "Presuppone un'età dell'oro che l'indagine storica raramente conferma."
      }
    ]
  },
  {
    id: "q37",
    c: "s",
    t: "La natura esiste per l'uomo?",
    f: "valore → chi?",
    note: "",
    g: "Il criterio decisivo è dove collochi il portatore di valore: individuo umano, individuo vivente, oppure insieme sistemico. Nota che biocentrismo ed ecocentrismo confliggono nei casi concreti — abbattere individui di una specie invasiva per salvare un ecosistema è ecocentrico e anti-biocentrico. Le posizioni si distinguono proprio lì, non nei principi generali.",
    an: "Ottimizzare per l'utente, per ogni singolo processo, o per la salute del cluster. Le tre metriche danno decisioni opposte sotto carico.",
    o: [
      {
        id: "a",
        l: "Antropocentrismo",
        f: "valore ⇐ uomo",
        b: "L'uomo occupa una posizione privilegiata e dà misura al valore.",
        ex: [],
        im: "Che il resto abbia valore strumentale.",
        co: "Fondamento fragile per politiche ambientali di lungo periodo."
      },
      {
        id: "b",
        l: "Biocentrismo",
        f: "∀ vivente : valore(x) > 0",
        b: "Ogni essere vivente possiede valore in quanto vivente.",
        ex: [],
        im: "Valore intrinseco di ogni individuo vivente.",
        co: "Rende ardua qualunque scelta pratica: ogni azione uccide qualcosa."
      },
      {
        id: "c",
        l: "Ecocentrismo",
        f: "valore ⊨ specie, ecosistemi, equilibri",
        b: "Il valore appartiene anche a insiemi: specie, ecosistemi, territori.",
        ex: ["Leopold", "deep ecology"],
        im: "Valore agli insiemi, anche a costo degli individui.",
        co: "Può giustificare il sacrificio di individui in nome del sistema."
      },
      {
        id: "d",
        l: "Cosmologia relazionale",
        f: "umani, viventi, luoghi ∈ una sola rete",
        b: "Umani, animali, piante, luoghi e spiriti appartengono alla stessa trama di relazioni.",
        ex: ["ontologie indigene", "Descola"],
        im: "Che il confine fra natura e cultura sia esso stesso locale.",
        co: "Difficile da tradurre in criteri decisionali condivisi."
      }
    ]
  }
];

export interface MatrixRow {
  qid: string;
  a: string;
  b: string;
  c: string;
}

export const MATRIX: MatrixRow[] = [
  { qid: "q1", a: "Teismo", b: "Ateismo", c: "Agnosticismo / non-teismo" },
  { qid: "q2", a: "Monoteismo", b: "Politeismo", c: "Unità con molte manifestazioni" },
  { qid: "q4", a: "Panteismo", b: "Teismo trascendente", c: "Panenteismo" },
  { qid: "q11", a: "Realismo", b: "Idealismo", c: "Non-dualismo" },
  { qid: "q12", a: "Monismo", b: "Dualismo", c: "Pluralismo" },
  { qid: "q13", a: "Sostanze", b: "Processi", c: "Relazioni ed eventi" },
  { qid: "q14", a: "Origine", b: "Eternità", c: "Ciclo o indecidibilità" },
  { qid: "q15", a: "Teleologia", b: "Non-teleologia", c: "Finalità locali" },
  { qid: "q17", a: "Determinismo", b: "Indeterminismo", c: "Compatibilità multilivello" },
  { qid: "q19", a: "Meccanicismo", b: "Vitalismo", c: "Organicismo" },
  { qid: "q20", a: "Fissismo", b: "Evoluzionismo", c: "—" },
  { qid: "q21", a: "Identità", b: "Dualismo", c: "Emergentismo" },
  { qid: "q22", a: "Fisicalismo", b: "Idealismo", c: "Panpsichismo o agnosticismo" },
  { qid: "q23", a: "Spiritualismo", b: "Materialismo", c: "Agnosticismo" },
  { qid: "q24", a: "Sostanza", b: "Processo", c: "Non-sé" },
  { qid: "q25", a: "Libertarismo", b: "Determinismo", c: "Compatibilismo" },
  { qid: "q29", a: "Ordine dato", b: "Costruzione umana", c: "Assenza di senso intrinseco" },
  { qid: "q30", a: "Assolutismo", b: "Relativismo", c: "Fallibilismo o scetticismo" },
  { qid: "q31", a: "Razionalismo", b: "Empirismo", c: "Sintesi, intuizione, rivelazione" },
  { qid: "q33", a: "Realismo morale", b: "Relativismo", c: "Costruttivismo" },
  { qid: "q34", a: "Deontologia", b: "Consequenzialismo", c: "Virtù o cura" },
  { qid: "q36", a: "Progresso", b: "Nessuna direzione", c: "Ciclo o declino" }
];

export const MCOL: Record<string, (string | null)[]> = {
  q1: ["a", "b", "c"],
  q2: ["a", "b", "c"],
  q4: ["a", "b", "c"],
  q11: ["a", "b", "c"],
  q12: ["a", "b", "c"],
  q13: ["a", "b", "c"],
  q14: ["a", "b", "c"],
  q15: ["a", "b", "c"],
  q17: ["a", "b", "c"],
  q19: ["a", "b", "c"],
  q20: ["a", "b", null],
  q21: ["a", "b", "c"],
  q22: ["a", "b", "c"],
  q23: ["a", "b", "c"],
  q24: ["a", "b", "c"],
  q25: ["a", "b", "c"],
  q29: ["a", "b", "c"],
  q30: ["a", "b", "c"],
  q31: ["a", "b", "c"],
  q33: ["a", "b", "c"],
  q34: ["b", "c", "d"],
  q36: ["a", "b", "c"]
};

export const PROFILES: Profile[] = [
  {
    n: "Platone",
    era: "IV sec. a.C.",
    m: {
      q1: "a", q2: "a", q3: "b", q4: "b", q7: "c", q11: "a", q12: "c", q13: "a",
      q14: "a", q15: "a", q20: "a", q21: "b", q22: "d", q23: "a", q24: "a", q25: "a",
      q26: "a", q28: "a", q29: "a", q30: "a", q31: "a", q32: "c", q33: "a", q34: "d",
      q35: "a", q36: "c"
    }
  },
  {
    n: "Democrito",
    era: "V–IV sec. a.C.",
    m: {
      q1: "b", q8: "b", q11: "a", q12: "c", q13: "a", q14: "b", q15: "b", q16: "a",
      q17: "a", q18: "b", q19: "a", q21: "a", q22: "a", q23: "b", q24: "b", q29: "c",
      q31: "b", q32: "b"
    }
  },
  {
    n: "Cartesio",
    era: "XVII secolo",
    m: {
      q1: "a", q2: "a", q3: "a", q4: "b", q5: "b", q6: "a", q7: "a", q11: "a",
      q12: "b", q13: "a", q17: "a", q19: "a", q20: "a", q21: "b", q22: "d", q23: "a",
      q24: "a", q25: "a", q26: "a", q28: "a", q30: "a", q31: "a", q33: "a"
    }
  },
  {
    n: "Spinoza",
    era: "XVII secolo",
    m: {
      q1: "a", q2: "a", q3: "b", q4: "a", q6: "b", q7: "d", q11: "a", q12: "a",
      q13: "a", q14: "b", q15: "b", q16: "a", q17: "a", q18: "b", q21: "c", q22: "c",
      q24: "a", q25: "c", q29: "a", q30: "a", q31: "a", q33: "c", q35: "b"
    }
  },
  {
    n: "Kant",
    era: "XVIII secolo",
    m: {
      q1: "a", q3: "a", q4: "b", q11: "b", q12: "b", q13: "a", q14: "d", q15: "c",
      q16: "d", q21: "b", q22: "e", q23: "a", q24: "a", q25: "a", q26: "a", q28: "a",
      q29: "a", q30: "a", q31: "c", q32: "c", q33: "a", q34: "b", q35: "b", q36: "a",
      q37: "a"
    }
  },
  {
    n: "Darwinismo",
    era: "dal XIX secolo",
    m: {
      q1: "c", q8: "d", q11: "a", q15: "b", q17: "c", q18: "a", q19: "a", q20: "b",
      q21: "c", q22: "a", q23: "b", q26: "b", q28: "b", q29: "c", q30: "c", q31: "b",
      q32: "b", q36: "b", q37: "b"
    }
  },
  {
    n: "Buddhismo",
    era: "dal V sec. a.C.",
    m: {
      q1: "c", q10: "b", q11: "c", q13: "b", q14: "c", q15: "b", q23: "b", q24: "c",
      q25: "c", q26: "b", q27: "b", q28: "c", q29: "b", q30: "c", q31: "d", q32: "c",
      q34: "e", q36: "c", q37: "d"
    }
  },
  {
    n: "Esistenzialismo ateo",
    era: "XX secolo",
    m: {
      q1: "b", q8: "c", q11: "a", q13: "b", q15: "b", q23: "b", q24: "b", q25: "a",
      q26: "c", q28: "c", q29: "c", q33: "c", q34: "a", q36: "b"
    }
  }
];
