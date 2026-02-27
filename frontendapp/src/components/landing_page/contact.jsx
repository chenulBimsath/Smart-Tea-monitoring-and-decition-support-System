import "./contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-left">
          <h2>Contact Us</h2>

          <div className="contact-icons">
            <div className="icon-line"></div>

            <div className="icon-item">
              <span>✉️</span>
            </div>

            <div className="icon-item">
              <span>📞</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="contact-form-box">
          <form className="contact-form">
            <input type="text" placeholder="Full name" />
            <input type="email" placeholder="Email Address" />
            <input type="text" placeholder="Phone Number" />
            <textarea placeholder="Message"></textarea>

            <button type="submit">Send</button>
          </form>
        </div>

      </div>
    </section>
  );
}