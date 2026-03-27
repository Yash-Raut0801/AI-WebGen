import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Assuming Footer.css has specific styling if needed, otherwise App.css

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} LuxeWear. All rights reserved.</p>
        <div className="social-links">
          <Link to="#">Facebook</Link>
          <Link to="#">Instagram</Link>
          <Link to="#">Twitter</Link>
        </div>
        <p>Designed with passion for fashion.</p>
      </div>
    </footer>
  );
}

export default Footer;