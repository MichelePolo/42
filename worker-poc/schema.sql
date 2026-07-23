-- Storico dei risultati del PoC "tre versioni". La colonna `version`
-- (vecchia | nuova | somma) tiene separate le tre classifiche nella stessa
-- tabella; il dedup per client_id è per-versione.
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL,           -- questionario: vecchia | nuova | somma
  client_id TEXT NOT NULL,         -- UUID anonimo del browser
  nickname TEXT NOT NULL,
  profile_name TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  answered_count INTEGER NOT NULL,
  responses TEXT NOT NULL,         -- codifica posizionale base36 (una cifra per domanda)
  created_at INTEGER NOT NULL      -- epoch ms
);

CREATE INDEX IF NOT EXISTS idx_results_ver_created ON results (version, created_at);
CREATE INDEX IF NOT EXISTS idx_results_ver_client ON results (version, client_id);
