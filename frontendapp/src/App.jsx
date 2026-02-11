import { useState } from "react";

import Navbar from "./components/navbar";
import Splash from "./components/splash";
import Features from "./components/features";
import HowItWorks from "./components/howItWorks";
import Contact from "./components/contact";
import SignInPopup from "./components/signinPopup";


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
