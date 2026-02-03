import "./signinPopup.css";

export default function SignInPopup({ closePopup, openSignUp }) {
  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div
        className="signin-card"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={closePopup}>×</span>

        <h2 className="signin-title">SIGN IN</h2>

        <input
          className="signin-input"
          type="text"
          placeholder="Username or Email"
        />

        <input
          className="signin-input"
          type="password"
          placeholder="Password"
        />

        {/* 🔥 OPTIONS MUST BE HERE */}
        <div className="signin-options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>

          <span className="forgot-link">
            Forgot Password?
          </span>
        </div>

        <button className="signin-btn">
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