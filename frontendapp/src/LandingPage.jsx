import { useState } from "react";

// 👇 Notice how the ends of these paths are now lowercase/camelCase
import Navbar from "./components/layout/navbar";
import Splash from "./components/pages/splash";
import Features from "./components/pages/features";
import HowItWorks from "./components/pages/howItWorks";
import Contact from "./components/pages/contact";
import SignInPopup from "./components/pages/signinPopup";
import <SignUpPopup> from "./components/pages/signUpPopup";

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