import { useState } from "react";

import Navbar    from "./components/layout/Navbar";
import Splash    from "./components/pages/Splash";
import Features  from "./components/pages/Features";
import HowItWorks from "./components/pages/HowItWorks";
import Contact   from "./components/pages/Contact";
import SignInPopup from "./components/pages/SignInPopup";
import SignUpPopup  from "./components/pages/SignUpPopup";

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <Navbar onGetStarted={() => setShowSignIn(true)} />

      <Splash />
      <Features />
      <HowItWorks />
      <Contact />

      {showSignIn && (
        <SignInPopup
          closePopup={() => setShowSignIn(false)}
          openSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
        />
      )}

      {showSignUp && (
        <SignUpPopup
          closePopup={() => setShowSignUp(false)}
          openSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
        />
      )}
    </>
  );
}
