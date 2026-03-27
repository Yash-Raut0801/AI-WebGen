import React from 'react';

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Get in Touch</h2>
        <div className="contact-content">
          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" className="btn">Send Message</button>
            </form>
          </div>
          <div className="contact-info-block">
            <h3>Contact Information</h3>
            <p><strong>Address:</strong> 123 Film Street, Hollywood, CA 90210</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Email:</strong> info@cinematicstudios.com</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
            {/* Font Awesome is not linked, this would require adding it to public/index.html */}
            {/* For now, just placeholder for icons */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;