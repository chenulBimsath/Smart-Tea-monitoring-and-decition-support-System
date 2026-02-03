import "./features.css";

export default function Features() {
  return (
    <section id="features" className="features-section">
      <h2 className="features-title">
        Powerful Features for Modern Tea Plantation Management
      </h2>

      <p className="features-subtitle">
        Alongside tea estate managers, field officers and agricultural
        researchers, we are transforming how Sri Lanka monitors and manages
        tea plantations—reducing yield losses, improving sustainability, and
        enabling smarter, data-driven decisions through satellite-based NDVI
        analysis, AI-powered yield predictions, and climate risk insights.
      </p>

      <div className="features-grid">
        {/* Feature 1 */}
        <div className="feature-card">
          <img src="/feature-yield.jpg" alt="Yield Prediction" />
          <h3>AI-Based Yield Prediction</h3>
          <p>
            Advanced machine learning models predict future tea yield based on
            historical data, field characteristics, and environmental factors.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="feature-card">
          <img src="/feature-ndvi.jpg" alt="NDVI Monitoring" />
          <h3>Satellite NDVI Monitoring</h3>
          <p>
            Real-time crop health monitoring using satellite-derived vegetation
            indices to detect stress zones early.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="feature-card highlight">
          <img src="/feature-field.jpg" alt="Field Data" />
          <h3>Field Data</h3>
          <p>
            Accurate field data collection supports reliable monitoring,
            analysis, and decision-making across tea plantations.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="feature-card">
          <img src="/feature-climate.jpg" alt="Climate Risk" />
          <h3>Climate Risk Scoring</h3>
          <p>
            Comprehensive analysis of weather patterns to identify
            vulnerabilities to drought, heat stress, and rainfall variability.
          </p>
        </div>
      </div>
    </section>
  );
}