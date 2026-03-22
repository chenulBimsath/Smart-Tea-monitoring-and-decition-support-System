import "./splash.css";

export default function Splash({ onGetStarted }) {
  return (
    <section className="splash">
      <div className="splash-noise" />
      <div className="splash-overlay">

        <div className="splash-eyebrow">Sri Lanka · Rangala Estate</div>

        <h1 className="splash-heading">
          Smart Tea Monitoring
          <span className="splash-amp"> &amp; </span>
          <br />Decision Support
        </h1>

        <p className="splash-sub">
          Satellite intelligence, AI yield prediction, and real-time climate
          risk — unified for modern tea plantation management.
        </p>

        <div className="splash-buttons">
          <a href="#features" className="btn-primary">Explore Features</a>
          <a href="#how" className="btn-secondary">How It Works</a>
        </div>

        <div className="splash-stats">
          <div className="splash-stat">
            <div className="splash-stat-num">6</div>
            <div className="splash-stat-lbl">Divisions Monitored</div>
          </div>
          <div className="splash-stat-div" />
          <div className="splash-stat">
            <div className="splash-stat-num">360+</div>
            <div className="splash-stat-lbl">Months of Historical Data</div>
          </div>
          <div className="splash-stat-div" />
          <div className="splash-stat">
            <div className="splash-stat-num">74%</div>
            <div className="splash-stat-lbl">ML Model Accuracy</div>
          </div>
        </div>

      </div>

      <div className="splash-scroll-hint">
        <div className="splash-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
