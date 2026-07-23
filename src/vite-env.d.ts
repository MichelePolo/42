/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL del Worker classifica (es. https://albero-42-api.<account>.workers.dev). Assente = adapter locale simulato. */
  readonly VITE_LEADERBOARD_API?: string;
  /** Site key Turnstile (pubblica). Assente = nessun captcha sull'invio. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  /** URL del Worker dedicato al PoC delle tre versioni. Assente = demo locale. */
  readonly VITE_POC_LEADERBOARD_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
