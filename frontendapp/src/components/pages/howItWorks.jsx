import "./howItWorks.css";

const STEPS = [
  {
    num: "01",
    title: "Data Collection",
    desc: "Field officers input ground-level data including soil conditions, harvest records, and field observations through intuitive mobile and web interfaces.",
  },
  {
    num: "02",
    title: "Satellite Integration",
    desc: "The system automatically retrieves and processes Google Earth Engine satellite imagery to generate NDVI vegetation maps and climate data for each field.",
  },
  {
    num: "03",
    title: "AI Analysis",
    desc: "Advanced Random Forest models analyse combined data to predict yields, assess climate risks, and surface patterns tailored to your estate's history.",
  },
  {
    num: "04",
    title: "Actionable Insights",
    desc: "Estate managers receive clear recommendations through comprehensive dashboards, enabling confident, data-driven decisions every day.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="how-section">

      <div className="how-inner">

        {/* LEFT */}
        <div className="how-left">
          <div className="how-eyebrow">The Process</div>
          <h2 className="how-title">How It Works</h2>
          <p className="how-sub">
            A simple four-step process that transforms raw plantation data
            into precise, actionable intelligence.
          </p>

          <div className="how-steps">
            {STEPS.map((s, i) => (
              <div className="how-step" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="how-step-num">{s.num}</div>
                <div className="how-step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="how-right">
          <div className="how-img-frame">
            <img src="/how-bg.jpg" alt="Tea plantation" />
            <div className="how-img-badge">
              <div className="how-badge-num">2021 – 2026</div>
              <div className="how-badge-lbl">Historical data powering the model</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
