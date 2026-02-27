import "./navbar.css";

export default function Navbar({ onGetStarted }) {
  return (
    <header className="navbar">
      <img src="/logo.png" alt="SmartTea Logo" className="logo" />

      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How It Works</a>
        <a href="#">Abbout</a>
        <a href="#contact">Contact Us</a>
      </nav>

      <button className="nav-btn" onClick={onGetStarted}>
        Get Started
      </button>
    </header>
  );
}
