import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="logo">Cinematic Studios</div>
        <nav className="footer-nav">
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#!">Privacy Policy</a></li>
            <li><a href="#!">Terms of Service</a></li>
          </ul>
        </nav>
        <p className="copyright">&copy; 2023 Cinematic Studios. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;