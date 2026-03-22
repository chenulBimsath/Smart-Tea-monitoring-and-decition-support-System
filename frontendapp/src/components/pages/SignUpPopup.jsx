import "./signinPopup.css";
import "./signupPopup.css";
import { useState } from "react";

export default function SignUpPopup({ closePopup, openSignIn }) {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName:   "",
    email:      "",
    password:   "",
    confirm:    "",
    role:       "Field Officer",
    mobileNum:  "",
    department: "",
    address:    "",
  });

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSignUp = async () => {
    if (!form.fullName || !form.email || !form.password || !form.confirm) {
      setError("Please fill in name, email and password.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.smartteamonitor.com/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:   form.fullName,
          email:      form.email,
          password:   form.password,
          role:       form.role,
          mobileNum:  form.mobileNum  || null,
          department: form.department || null,
          address:    form.address    || null,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const msg = await response.text();
        setError(msg || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="signin-card signup-card" onClick={e => e.stopPropagation()}>

        <button className="close-btn" onClick={closePopup} aria-label="Close">×</button>

        {success ? (
          <div className="signup-success">
            <div className="signup-success-icon">✓</div>
            <h2 className="signin-title" style={{ marginBottom: 8 }}>Account Created!</h2>
            <p className="signin-sub">Your account has been registered successfully.</p>
            <button className="signin-btn" style={{ marginTop: 20 }} onClick={openSignIn}>
              Sign In Now <span className="signin-arrow">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="signin-logo">
              <img src="/logo.png" alt="Logo" />
            </div>

            <h2 className="signin-title">Create Account</h2>
            <p className="signin-sub">Join Smart Tea Monitor today</p>

            {/* Row: Full Name + Email */}
            <div className="signup-row">
              <div className="signin-field">
                <label>Full Name <span className="signup-req">*</span></label>
                <input type="text" name="fullName" placeholder="Your full name"
                  value={form.fullName} onChange={handleChange} />
              </div>
              <div className="signin-field">
                <label>Email Address <span className="signup-req">*</span></label>
                <input type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>
            </div>

            {/* Row: Role + Department */}
            <div className="signup-row">
              <div className="signin-field">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="signup-select">
                  <option>Field Officer</option>
                  <option>Estate Manager</option>
                  <option>Supervisor</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="signin-field">
                <label>Department</label>
                <input type="text" name="department" placeholder="e.g. Field Operations"
                  value={form.department} onChange={handleChange} />
              </div>
            </div>

            {/* Row: Mobile + Address */}
            <div className="signup-row">
              <div className="signin-field">
                <label>Mobile Number</label>
                <input type="text" name="mobileNum" placeholder="+94 77 000 0000"
                  value={form.mobileNum} onChange={handleChange} />
              </div>
              <div className="signin-field">
                <label>Address</label>
                <input type="text" name="address" placeholder="City, District"
                  value={form.address} onChange={handleChange} />
              </div>
            </div>

            {/* Row: Password + Confirm */}
            <div className="signup-row">
              <div className="signin-field">
                <label>Password <span className="signup-req">*</span></label>
                <div className="signin-pass-wrap">
                  <input type={showPass ? "text" : "password"} name="password"
                    placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                  <button className="signin-eye" type="button" onClick={() => setShowPass(p => !p)}>
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
              <div className="signin-field">
                <label>Confirm Password <span className="signup-req">*</span></label>
                <div className="signin-pass-wrap">
                  <input type={showConfirm ? "text" : "password"} name="confirm"
                    placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
                  <button className="signin-eye" type="button" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="signup-error">{error}</p>}

            <button className="signin-btn" onClick={handleSignUp}
              disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <span className="signin-arrow">→</span>}
            </button>

            <p className="signup-text">
              Already have an account?{" "}<span onClick={openSignIn}>Sign in</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
