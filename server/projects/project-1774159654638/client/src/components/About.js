import React from 'react';

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>About Cinematic Studios</h2>
        <p>
          Cinematic Studios is a premier film production company dedicated to bringing compelling stories to life on the big screen.
          With a passion for artistic integrity and technical excellence, we push the boundaries of filmmaking to create impactful and memorable content.
        </p>
        <div className="about-vision">
          <div className="vision-item">
            <h3>Our Mission</h3>
            <p>To produce groundbreaking films that resonate with global audiences, inspire critical thought, and elevate the art of cinema.</p>
          </div>
          <div className="vision-item">
            <h3>Our Vision</h3>
            <p>To be recognized as a leader in innovative storytelling, fostering creativity, and setting new benchmarks for cinematic quality.</p>
          </div>
          <div className="vision-item">
            <h3>Our Values</h3>
            <p>Creativity, Collaboration, Integrity, Excellence, and a relentless pursuit of cinematic perfection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;