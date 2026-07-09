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
<<<<<<< Updated upstream
      const response = await fetch("http://13.233.134.204:8080/api/auth/login", {
=======
<<<<<<< Updated upstream
      const response = await fetch("http://localhost:8080/api/auth/login", {
=======
      const response = await fetch(`${API}/api/auth/login`, {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        <div className="signin-options">
          <label className="signin-remember">
            <input type="checkbox" />
            Remember Me
          </label>
          <span className="forgot-link">Forgot Password?</span>
        </div>

        <button className="signin-btn" onClick={handleLogin}>
=======
        <button
          className="signin-btn"
          onClick={handleLogin}
        >
>>>>>>> Stashed changes
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