import "./features.css";

const FEATURES = [
  {
    img:   "/feature-yield.jpg",
    tag:   "Machine Learning",
    title: "AI-Based Yield Prediction",
    desc:  "Advanced Random Forest models predict future tea yield based on historical data, field characteristics, pluckers, and environmental factors with 74% accuracy.",
  },
  {
    img:   "/feature-ndvi.jpg",
    tag:   "Satellite Intelligence",
    title: "NDVI Vegetation Monitoring",
    desc:  "Real-time crop health monitoring using Google Earth Engine satellite-derived vegetation indices to detect stress zones and disease risk early.",
  },
  {
    img:   "/feature-field.jpg",
    tag:   "Data Management",
    title: "Field Data Collection",
    desc:  "Accurate field data collection and structured management supports reliable monitoring, analysis, and decision-making across all plantation divisions.",
  },
  {
    img:   "/feature-climate.jpg",
    tag:   "Climate Analysis",
    title: "Climate Risk Scoring",
    desc:  "Comprehensive analysis of live weather patterns to identify vulnerabilities to drought, heat stress, humidity anomalies, and rainfall variability.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">

      <div className="features-header">
        <div className="features-eyebrow">Platform Capabilities</div>
        <h2 className="features-title">
          Powerful Tools for Modern<br />Tea Plantation Management
        </h2>
        <p className="features-subtitle">
          Alongside tea estate managers, field officers and agricultural researchers,
          we are transforming how Sri Lanka monitors and manages tea plantations —
          reducing yield losses, improving sustainability, and enabling smarter,
          data-driven decisions.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="feature-img-wrap">
              <img src={f.img} alt={f.title} />
              <div className="feature-tag">{f.tag}</div>
            </div>
            <div className="feature-body">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
