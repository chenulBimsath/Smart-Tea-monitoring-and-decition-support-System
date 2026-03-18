import "./contact.css";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";


const EMAILJS_SERVICE_ID  = "service_5k8b94f";  
const EMAILJS_TEMPLATE_ID = "template_so0smmr";  
const EMAILJS_PUBLIC_KEY  = "Am76Z2ynmq5p7QPSK";   

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle"); 
  const [form, setForm] = useState({
    from_name:  "",
    from_email: "",
    phone:      "",
    message:    "",
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.from_name || !form.from_email || !form.message) {
      alert("Please fill in name, email and message.");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ from_name: "", from_email: "", phone: "", message: "" });

    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

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
                <div className="contact-info-val">+94 11 234 5678</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">◎</div>
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-val">Rangala Estate, Kandy, Sri Lanka</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-box">

          {/* Success state */}
          {status === "success" ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. We'll get back to you shortly.</p>
              <button
                className="contact-submit"
                onClick={() => setStatus("idle")}
                style={{ marginTop: 20 }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="Your full name"
                    value={form.from_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    name="from_email"
                    placeholder="you@example.com"
                    value={form.from_email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+94 77 000 0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label>Message <span className="required">*</span></label>
                <textarea
                  name="message"
                  placeholder="Tell us about your estate and what you're looking for..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status === "error" && (
                <div className="contact-error">
                  Failed to send. Please try again or email us directly at smartteamonitor@gmail.com
                </div>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <span className="contact-spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="contact-submit-arrow">→</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}