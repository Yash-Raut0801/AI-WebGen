import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">Cinematic Studios</div>
        <nav className="nav">
          <ul>
            <li><a href="#hero" className="active">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;