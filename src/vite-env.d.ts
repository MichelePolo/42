/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL del Worker classifica (es. https://albero-42-api.<account>.workers.dev). Assente = adapter locale simulato. */
  readonly VITE_LEADERBOARD_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
