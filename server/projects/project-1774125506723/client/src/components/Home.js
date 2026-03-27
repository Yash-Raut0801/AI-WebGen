import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [latestFilms, setLatestFilms] = useState([]);

  useEffect(() => {
    const fetchLatestFilms = async () => {
      try {
        const res = await axios.get('/api/films');
        // Sort by year and take top 3
        const sortedFilms = res.data.sort((a, b) => b.year - a.year);
        setLatestFilms(sortedFilms.slice(0, 3));
      } catch (err) {
        console.error('Error fetching films:', err);
      }
    };
    fetchLatestFilms();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Luminus Films</h1>
        <p>Crafting breathtaking cinematic experiences. Where every frame tells a story.</p>
        <Link to="/films" className="btn">View Our Work</Link>
      </section>

      <section className="section container">
        <h2>Latest Productions</h2>
        <div className="film-grid">
          {latestFilms.map(film => (
            <div className="film-card" key={film._id}>
              <img src={film.imageUrl} alt={film.title} />
              <div className="film-card-content">
                <h3>{film.title}</h3>
                <p>{film.description.substring(0, 100)}...</p>
                <Link to={`/films/${film._id}`} className="btn">Details</Link>
              </div>
            </div>
          ))}
        </div>
        {latestFilms.length === 0 && (
           <p>No films available. Please add some films to the database.</p>
        )}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/films" className="btn">See All Productions</Link>
        </div>
      </section>

      <section className="section container" style={{ backgroundColor: 'var(--bg-light)'}}>
        <h2>About Us</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
          Luminus Films is a passionate team of filmmakers, storytellers, and visual artists dedicated to bringing extraordinary narratives to life. With state-of-the-art equipment and a creative vision, we specialize in commercials, feature films, documentaries, and music videos.
        </p>
        <Link to="/contact" className="btn">Get In Touch</Link>
      </section>
    </div>
  );
};

export default Home;