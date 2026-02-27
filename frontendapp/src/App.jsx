import { BrowserRouter, Routes, Route } from "react-router-dom";

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
// landing page components
import LandingPage from "./LandingPage";
=======
>>>>>>> Stashed changes
import Navbar from "./components/landing_page/navbar";
import Splash from "./components/landing_page/splash";
import Features from "./components/landing_page/features";
import HowItWorks from "./components/landing_page/howItWorks";
import Contact from "./components/landing_page/contact";
import SignInPopup from "./components/landing_page/signinPopup";
<<<<<<< Updated upstream
=======
>>>>>>> 5abdadbee4cdcba12f3bc4334b614e2e385e93d0
>>>>>>> Stashed changes

// sdgp dashboard
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