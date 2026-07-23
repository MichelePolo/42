import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { LIGHT_VARIANT } from "./datasets";
import "./index.css";

// Route "/v1/" — versione storica Light (37 domande), senza database.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VariantContext.Provider value={LIGHT_VARIANT}>
      <App />
    </VariantContext.Provider>
  </StrictMode>
);
