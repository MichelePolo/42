import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { COMPLETA_VARIANT } from "./datasets";
import "./index.css";

// Route "/" — versione principale: questionario Completo con classifiche e mappa.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VariantContext.Provider value={COMPLETA_VARIANT}>
      <App />
    </VariantContext.Provider>
  </StrictMode>
);
