import React from 'react';
import './Portfolio.css';

const projects = [
  { id: 1, title: 'The Silent Echo', category: 'Feature Film', image: 'https://picsum.photos/500/350?random=1' },
  { id: 2, title: 'Urban Rhythms', category: 'Documentary', image: 'https://picsum.photos/500/350?random=2' },
  { id: 3, title: 'Beyond the Horizon', category: 'Short Film', image: 'https://picsum.photos/500/350?random=3' },
  { id: 4, title: 'Corporate Vision', category: 'Commercial', image: 'https://picsum.photos/500/350?random=4' },
  { id: 5, title: 'Lost in Starlight', category: 'Feature Film', image: 'https://picsum.photos/500/350?random=5' },
  { id: 6, title: 'Nature\'s Symphony', category: 'Documentary', image: 'https://picsum.photos/500/350?random=6' },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2>Our Portfolio</h2>
        <div className="portfolio-grid">
          {projects.map(project => (
            <div key={project.id} className="portfolio-item">
              <img src={project.image} alt={project.title} />
              <div className="portfolio-info">
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;