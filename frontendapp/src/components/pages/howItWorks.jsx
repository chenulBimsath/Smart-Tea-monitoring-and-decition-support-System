import "./howItWorks.css";

export default function HowItWorks() {
  return (
    <section id="how" className="how-section">
      <div className="how-container">

        {/* LEFT IMAGE */}
        <div className="how-image">
          <img src="/how-bg.jpg" alt="Tea plantation" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="how-content">
          <h2>How It Works</h2>
          <p className="how-subtitle">
            A simple four step process to revolutionize your tea plantation
            management
          </p>

          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <h3>Data Collection</h3>
              <p>
                Field officers and supervisors input ground level data including
                soil conditions, harvest records and field observations through
                our intuitive mobile and web interfaces.
              </p>
            </div>

            <div className="step">
              <span className="step-number">2</span>
              <h3>Satellite Integration</h3>
              <p>
                Our system automatically retrieves and processes satellite
                imagery to generate NDVI vegetation health maps and climate data
                for each plantation field.
              </p>
            </div>

            <div className="step">
              <span className="step-number">3</span>
              <h3>AI Analysis</h3>
              <p>
                Advanced machine learning models analyze combined data to predict
                yields and assess risks tailored to your estate.
              </p>
            </div>

            <div className="step">
              <span className="step-number">4</span>
              <h3>Actionable Insights</h3>
              <p>
                Estate managers receive clear, actionable recommendations and
                alerts through comprehensive dashboards, enabling data-driven
                decision making.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
