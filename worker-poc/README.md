# albero-42-poc-api — backend del PoC "tre versioni"

Worker + D1 dedicato al PoC, separato dalla produzione: salva i risultati delle
tre versioni del questionario (Vecchia / Nuova / Somma) nella stessa tabella,
distinte dalla colonna `version`. Codifica risposte in base36 (le domande della
Somma possono avere più di 9 opzioni).

Già deployato su `https://albero-42-poc-api.michele-polo.workers.dev`
(D1 `albero-42-poc`). Per ricrearlo da zero:

```bash
cd worker-poc
npm install
npx wrangler login
npm run db:create      # copia il database_id in wrangler.toml
npm run db:schema
npm run deploy
```

Poi in `.env.local` (root del progetto):

```
VITE_POC_LEADERBOARD_API=https://albero-42-poc-api.<account>.workers.dev
```

## Endpoint

| Metodo | Path | Note |
|---|---|---|
| `POST` | `/api/submit` | Richiede `version` ∈ {vecchia, nuova, somma}; rate-limit 30 s per client/versione |
| `GET` | `/api/top?version=…&period=…&profile=…` | Top del periodo per quella versione |
| `GET` | `/api/recent?version=…` | Ultime compilazioni (per la mappa) di quella versione |

Turnstile è opzionale: senza il secret sul Worker l'invio non richiede captcha
(comodo per il test locale).

## Test locale del frontend

```bash
npm run build && npx vite preview --base /42/
# apri /42/poc/ e usa la barra in basso per scegliere Vecchia / Nuova / Somma
```
