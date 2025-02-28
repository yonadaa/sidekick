import "tailwindcss/tailwind.css";
import { createRoot } from "react-dom/client";
import { Providers } from "./Providers";
import { App } from "./App";
import { Explorer } from "./mud/Explorer";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ui/ErrorFallback";

createRoot(document.getElementById("react-root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Providers>
      <App />
      <Explorer />
    </Providers>
  </ErrorBoundary>
);
