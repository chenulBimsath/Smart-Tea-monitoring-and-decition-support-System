import "./SignInPopup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function SignInPopup({ closePopup, openSignUp }) {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Invalid email or password.");
      }

      const user = await response.json();

      localStorage.setItem("user", JSON.stringify(user));

      closePopup();

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Cannot connect to server.");
    }
  };

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div
        className="signin-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={closePopup}
          aria-label="Close"
        >
          ×
        </button>

        <div className="signin-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <h2 className="signin-title">Welcome Back</h2>

        <p className="signin-sub">
          Sign in to your Smart Tea Monitoring account
        </p>

        <div className="signin-field">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signin-field">
          <label>Password</label>

          <div className="signin-pass-wrap">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="signin-eye"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "red",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            {error}
          </p>
        )}

        <div className="signin-options">
          <label className="signin-remember">
            <input type="checkbox" />
            Remember Me
          </label>
          <span className="forgot-link">Forgot Password?</span>
        </div>

        <button className="signin-btn" onClick={handleLogin}>
          Sign In
          <span className="signin-arrow">→</span>
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={openSignUp}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}