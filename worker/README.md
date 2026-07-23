# albero-42-api — backend classifica (Cloudflare Workers + D1)

Piccola API che storicizza i risultati del quiz (nickname + risposte complete)
e serve classifica e mappa. Gira interamente nel piano **free** di Cloudflare
(100.000 richieste/giorno, D1 fino a 5 GB): a scala di sito personale il costo
è zero.

## Deploy (una tantum, ~10 minuti)

Prerequisito: un account Cloudflare (gratuito).

```bash
cd worker
npm install

# 1. Login (apre il browser)
npx wrangler login

# 2. Crea il database D1
npm run db:create
#    → copia il database_id stampato dentro wrangler.toml

# 3. Applica lo schema
npm run db:schema

# 4. Deploy del Worker
npm run deploy
#    → annota l'URL, es. https://albero-42-api.<account>.workers.dev
```

## Anti-abuso

Due livelli, entrambi già nel codice:

1. **Moderazione nickname** (sempre attiva): blocklist server-side con
   normalizzazione anti-elusione (accenti, sostituzioni leet). Vedi
   `src/nickname.ts` per estendere la lista.
2. **Cloudflare Turnstile** (captcha invisibile, gratuito — opzionale ma
   consigliato in produzione):

   ```bash
   # Dashboard Cloudflare → Turnstile → Add widget
   #   dominio: michelepolo.github.io (e localhost per lo sviluppo)
   #   modalità: Invisible
   # → ottieni Site Key (pubblica) e Secret Key

   cd worker
   npx wrangler secret put TURNSTILE_SECRET   # incolla la Secret Key
   ```

   Poi esponi la Site Key al frontend: `VITE_TURNSTILE_SITE_KEY` in
   `.env.local` (sviluppo) e nelle variabili di repository GitHub
   (produzione). Senza secret sul Worker il captcha è semplicemente
   disattivato: il primo deploy non è mai bloccato.

## Collegare il frontend

- **Sviluppo locale:** crea `.env.local` nella root del progetto (vedi
  `.env.example`) con `VITE_LEADERBOARD_API=<url del worker>`.
- **Produzione (GitHub Pages):** aggiungi la variabile di repository
  `VITE_LEADERBOARD_API` in *Settings → Secrets and variables → Actions →
  Variables*; il workflow di deploy la inietta nel build.

Senza la variabile l'app resta funzionante in modalità demo (dati simulati).

## Endpoint

| Metodo | Path | Descrizione |
|---|---|---|
| `POST` | `/api/submit` | Registra un risultato (validato server-side, rate-limit 30 s per client) |
| `GET` | `/api/top?period=day\|week\|month\|year&profile=<nome>&limit=10` | Top N del periodo, un piazzamento per client (l'invio più recente) |
| `GET` | `/api/recent?limit=10` | Ultime compilazioni (una per client), usate dalla mappa |

## Migrazioni

`schema.sql` è idempotente e va bene per creare il database da zero. Per un D1
**già esistente** le modifiche di schema vanno applicate a mano dai file in
`migrations/` (una volta sola):

```bash
wrangler d1 execute albero-42 --remote --file=./migrations/0001-add-version.sql
```

- `0001-add-version.sql` — aggiunge la colonna `version` (percorsi tematici).
  Già applicata sul D1 di produzione.

## Modello dati

Ogni invio è una riga immutabile in `results` (vedi `schema.sql`): lo storico
completo resta interrogabile e, salvando la stringa `responses` (codifica
posizionale base36), classifiche e mappa sono ricalcolabili anche se in futuro
cambia l'algoritmo di affinità.

Privacy: nessun dato personale — solo un UUID casuale per browser
(`client_id`), il nickname scelto e le risposte al questionario.
