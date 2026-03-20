import { useState } from "react";


import Navbar from "./components/layout/navbar";
import Splash from "./components/pages/splash";
import Features from "./components/pages/features";
import HowItWorks from "./components/pages/howItWorks";
import Contact from "./components/pages/contact";
import SignInPopup from "./components/pages/signinPopup";
import <SignUpPopup> from 

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