import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage";
import SDGPApp from "./SDGPApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<SDGPApp />} />
      </Routes>
    </BrowserRouter>
  );
}