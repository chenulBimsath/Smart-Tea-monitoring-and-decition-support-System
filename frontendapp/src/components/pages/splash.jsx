import "./splash.css";

export default function Splash() {
  return (
    <section className="splash">
      <div className="splash-overlay">
        <h1>
          Smart Tea Monitoring & <br />
          Decision Support System
        </h1>

        <div className="splash-buttons">
          <a href="#features" className="btn-primary">
            Explore Features
          </a>
          <a href="#how" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
