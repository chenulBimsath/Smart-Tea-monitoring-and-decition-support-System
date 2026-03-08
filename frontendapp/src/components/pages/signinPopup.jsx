import "./signinPopup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignInPopup({ closePopup, openSignUp }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        closePopup();
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    }
  };

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="signin-card" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={closePopup}>×</span>

        <h2 className="signin-title">SIGN IN</h2>

        <input
          className="signin-input"
          type="text"
          placeholder="Username or Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="signin-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

        <div className="signin-options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <span className="forgot-link">Forgot Password?</span>
        </div>

        <button className="signin-btn" onClick={handleLogin}>
          SIGN IN
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={openSignUp}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
