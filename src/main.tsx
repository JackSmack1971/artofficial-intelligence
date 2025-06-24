import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "@/pages/HomePage";

const rootElement = document.getElementById("root") as HTMLElement | null;
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
