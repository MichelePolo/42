-- Migrazione per database D1 GIÀ ESISTENTI (creati prima della suddivisione in
-- percorsi tematici). schema.sql copre le creazioni da zero — la colonna è già
-- lì; questo file serve solo ad aggiornare una tabella `results` preesistente.
-- Applicare una volta sola:
--   wrangler d1 execute albero-42 --remote --file=./migrations/0001-add-version.sql
-- (già eseguita sul D1 di produzione albero-42.)
ALTER TABLE results ADD COLUMN version TEXT NOT NULL DEFAULT 'completa';
CREATE INDEX IF NOT EXISTS idx_results_ver_created ON results (version, created_at);
CREATE INDEX IF NOT EXISTS idx_results_ver_client ON results (version, client_id);
