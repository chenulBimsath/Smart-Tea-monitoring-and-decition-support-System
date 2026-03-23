import "./SignInPopup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignInPopup({ closePopup, openSignUp }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("https://api.smartteamonitor.com/api/auth/login", {
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

        {/* Single close button — removed duplicate span */}
        <button className="close-btn" onClick={closePopup} aria-label="Close">×</button>

        {/* Email field — uses signin-field wrapper so CSS applies */}
        <div className="signin-field">
          <label>Email</label>
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password field — with show/hide toggle wired up */}
        <div className="signin-field">
          <label>Password</label>
          <div className="signin-pass-wrap">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="signin-eye"
              type="button"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

        

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