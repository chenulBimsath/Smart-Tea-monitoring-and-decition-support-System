import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SDGPApp from "./SDGPApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SDGPApp />
  </StrictMode>
);