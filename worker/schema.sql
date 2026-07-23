-- Storico completo dei risultati: una riga per ogni invio, mai sovrascritta.
-- La classifica deduplica per client_id (ultimo invio nel periodo), ma lo
-- storico resta interrogabile per analisi future o ricalcoli.
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,        -- UUID anonimo generato dal browser
  nickname TEXT NOT NULL,
  profile_name TEXT NOT NULL,     -- profilo dominante al momento dell'invio
  percentage INTEGER NOT NULL,    -- risonanza col profilo dominante (0-100)
  answered_count INTEGER NOT NULL,
  responses TEXT NOT NULL,        -- codifica posizionale, es. "3012…" (37 cifre)
  created_at INTEGER NOT NULL     -- epoch ms
);

CREATE INDEX IF NOT EXISTS idx_results_created ON results (created_at);
CREATE INDEX IF NOT EXISTS idx_results_client ON results (client_id);
