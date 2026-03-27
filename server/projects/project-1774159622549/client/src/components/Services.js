import React from 'react';
import './Services.css';

const services = [
  { icon: '🎥', title: 'Film Production', description: 'From script to screen, we manage the entire production process for feature films and shorts.' },
  { icon: '🎬', title: 'Commercials & Ads', description: 'Crafting engaging and effective commercial content for brands of all sizes.' },
  { icon: '📺', title: 'Documentaries', description: 'Producing powerful and insightful documentaries that inform, inspire, and entertain.' },
  { icon: '⚙️', title: 'Post-Production', description: 'Expert editing, visual effects, sound design, and color grading services.' },
  { icon: '✍️', title: 'Script Development', description: 'Collaborating with writers to develop compelling stories and screenplays.' },
  { icon: '💡', title: 'Creative Consulting', description: 'Providing expert guidance on creative direction, strategy, and project development.' },
];

const Services = () => {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-item">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;