import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { VariantContext } from "./variants";
import { LEGACY_VARIANT } from "./datasets";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VariantContext.Provider value={LEGACY_VARIANT}>
      <App />
    </VariantContext.Provider>
  </StrictMode>
);
