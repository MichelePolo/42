// Cloudflare Turnstile in modalità invisibile: attivo solo se
// VITE_TURNSTILE_SITE_KEY è configurata (deve esserlo insieme al secret
// sul Worker, altrimenti il server rifiuta o ignora il token).

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback": () => void;
          size: string;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error("Impossibile caricare la verifica anti-bot."));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

/** Ottiene un token monouso; null se Turnstile non è configurato. */
export async function getTurnstileToken(): Promise<string | null> {
  if (!TURNSTILE_SITE_KEY) return null;
  await loadScript();

  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    // Fuori dallo schermo: in modalità invisibile non mostra nulla, ma
    // l'elemento deve stare nel DOM perché il widget possa girare.
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const cleanup = (widgetId?: string) => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      container.remove();
    };

    let widgetId: string | undefined;
    widgetId = window.turnstile!.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      size: "invisible",
      callback: (token) => {
        cleanup(widgetId);
        resolve(token);
      },
      "error-callback": () => {
        cleanup(widgetId);
        reject(new Error("Verifica anti-bot non riuscita. Riprova."));
      }
    });
  });
}
