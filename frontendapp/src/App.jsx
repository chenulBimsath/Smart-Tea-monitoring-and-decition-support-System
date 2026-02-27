import { useState } from "react";

import Navbar from "./components/landing_page/navbar";
import Splash from "./components/landing_page/splash";
import Features from "./components/landing_page/features";
import HowItWorks from "./components/landing_page/howItWorks";
import Contact from "./components/landing_page/contact";
import SignInPopup from "./components/landing_page/signinPopup";


export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);


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
  />
)}

    </>
  );
}
