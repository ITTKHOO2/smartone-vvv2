import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalDocument from "./components/Document"; // ✅ import

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalDocument /> {/* ✅ โหลด global style / font */}
    <App />
  </React.StrictMode>
);
