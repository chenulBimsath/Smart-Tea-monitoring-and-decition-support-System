import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Splash from "./components/pages/Splash";
import Features from "./components/pages/Features";
import HowItWorks from "./components/pages/HowItWorks";
import Contact from "./components/pages/Contact";
import SignInPopup from "./components/pages/SigninPopup";

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Navbar onGetStarted={() => setShowSignIn(true)} />

      <Splash />
      <Features />
      <HowItWorks />
      <Contact />

      {showSignIn && (
        <SignInPopup closePopup={() => setShowSignIn(false)} />
      )}
    </>
  );
}