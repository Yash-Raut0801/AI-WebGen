import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Aurora Films</h1>
        <p className="tagline">Crafting Cinematic Journeys, One Frame at a Time</p>
        <a href="#portfolio" className="btn-primary">View Our Work</a>
      </div>
    </section>
  );
};

export default Hero;