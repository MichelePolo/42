-- Storico completo dei risultati: una riga per ogni invio, mai sovrascritta.
-- La classifica deduplica per client_id (ultimo invio nel periodo), ma lo
-- storico resta interrogabile per analisi future o ricalcoli.
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL DEFAULT 'completa', -- questionario: completa | reale | sapere | agire
  client_id TEXT NOT NULL,        -- UUID anonimo generato dal browser
  nickname TEXT NOT NULL,
  profile_name TEXT NOT NULL,     -- profilo dominante al momento dell'invio
  percentage INTEGER NOT NULL,    -- risonanza col profilo dominante (0-100)
  answered_count INTEGER NOT NULL,
  responses TEXT NOT NULL,        -- codifica posizionale base36 (una cifra per domanda)
  created_at INTEGER NOT NULL     -- epoch ms
);

CREATE INDEX IF NOT EXISTS idx_results_ver_created ON results (version, created_at);
CREATE INDEX IF NOT EXISTS idx_results_ver_client ON results (version, client_id);
