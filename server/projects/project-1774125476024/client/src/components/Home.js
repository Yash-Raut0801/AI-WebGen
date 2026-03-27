import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Crafting Unforgettable Stories Through Film</h1>
        <p className="hero-subtitle">
          We are a passionate team of filmmakers dedicated to bringing your vision to life with stunning visuals and compelling narratives.
        </p>
        <Link to="/projects" className="btn-primary">
          View Our Work
        </Link>
      </div>
    </div>
  );
};

export default Home;