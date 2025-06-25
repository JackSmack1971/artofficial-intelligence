import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "@/pages/HomePage";

const container = document.getElementById("root") as HTMLElement | null;
if (!container) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
