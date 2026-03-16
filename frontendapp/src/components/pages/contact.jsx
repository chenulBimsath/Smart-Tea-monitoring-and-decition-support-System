import "./contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact-section">

      <div className="contact-inner">

        {/* LEFT */}
        <div className="contact-left">
          <div className="contact-eyebrow">Get In Touch</div>
          <h2 className="contact-title">Let's Talk About Your Plantation</h2>
          <p className="contact-desc">
            Have questions about the platform, want a demo, or interested in
            bringing Smart Tea Monitor to your estate? We'd love to hear from you.
          </p>

          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">✉</div>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-val">smartteamonitor@gmail.com</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">✆</div>
              <div>
                <div className="contact-info-label">Phone</div>
                <div className="contact-info-val">+94 77 806 419</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">◎</div>
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-val">No. 21 , BBC building ,Miraniyastreet</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-box">
          <form className="contact-form">
            <div className="contact-form-row">
              <div className="contact-field">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" />
              </div>
              <div className="contact-field">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="contact-field">
              <label>Phone Number</label>
              <input type="text" placeholder="+94 77 000 0000" />
            </div>
            <div className="contact-field">
              <label>Message</label>
              <textarea placeholder="Tell us about your estate and what you're looking for..." />
            </div>
            <button type="submit" className="contact-submit">
              Send Message
              <span className="contact-submit-arrow">→</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
