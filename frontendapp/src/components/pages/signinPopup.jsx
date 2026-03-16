import "./signinPopup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignInPopup({ closePopup, openSignUp }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    closePopup();
    navigate("/dashboard");
  };

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="signin-card" onClick={e => e.stopPropagation()}>

        <button className="close-btn" onClick={closePopup} aria-label="Close">×</button>

        <div className="signin-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <h2 className="signin-title">Welcome back</h2>
        <p className="signin-sub">Sign in to your estate dashboard</p>

        <div className="signin-field">
          <label>Username or Email</label>
          <input type="text" placeholder="you@example.com" />
        </div>

        <div className="signin-field">
          <label>Password</label>
          <div className="signin-pass-wrap">
            <input type={showPass ? "text" : "password"} placeholder="••••••••" />
            <button
              type="button"
              className="signin-eye"
              onClick={() => setShowPass(v => !v)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="signin-options">
          <label className="signin-remember">
            <input type="checkbox" />
            Remember me
          </label>
          <span className="forgot-link">Forgot password?</span>
        </div>

        <button className="signin-btn" onClick={handleLogin}>
          Sign In
          <span className="signin-arrow">→</span>
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={openSignUp}>Sign up</span>
        </p>

      </div>
    </div>
  );
}
