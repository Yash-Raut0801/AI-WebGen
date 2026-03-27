import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>About Aurora Films</h2>
        <div className="about-content">
          <img src="https://picsum.photos/400/300?gravity=west" alt="Filming Crew" className="about-image" />
          <div className="about-text">
            <h3>Visionary Storytelling Since 2005</h3>
            <p>
              Aurora Films is a pioneering production company dedicated to bringing compelling stories to life on screen. Founded in 2005, we have a rich history of producing critically acclaimed films, documentaries, and commercial content that resonates with global audiences. Our passion lies in the art of visual storytelling, pushing creative boundaries, and delivering exceptional cinematic experiences.
            </p>
            <p>
              We believe in the power of collaboration, working with talented directors, writers, and crew to transform unique ideas into unforgettable narratives. From concept development to post-production, Aurora Films is committed to excellence in every aspect of filmmaking.
            </p>
            <p>
              Join us as we continue to shape the future of entertainment, one masterpiece at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;