import "./navbar.css";

export default function Navbar({
  onGetStarted,
  onRefresh,
  subtitle = "Rangala Estate",
  showNav = true,
}) {
  return (
    <header className="navbar">

      {/* ── LEFT: Logo + title ── */}
      <div className="nav-brand">
        <img src="/logo.png" alt="SmartTea Logo" className="logo" />
        <div className="nav-title-wrap">
          <div className="nav-app-name">Smart Tea Monitor</div>
          <div className="nav-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* ── CENTER: Nav links ── */}
      {showNav && (
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#">About</a>
          <a href="#contact">Contact Us</a>
        </nav>
      )}

      {/* ── RIGHT: Buttons ── */}
      <div className="nav-right">

        {onRefresh && (
          <button className="nav-refresh-btn" onClick={onRefresh}>
            Refresh
          </button>
        )}

        {onGetStarted && (
          <button className="nav-btn" onClick={onGetStarted}>
            Get Started
          </button>
        )}

      </div>

    </header>
  );
}