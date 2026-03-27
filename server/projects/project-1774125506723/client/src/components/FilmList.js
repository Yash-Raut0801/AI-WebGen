import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FilmList = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await axios.get('/api/films');
        setFilms(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching films:', err);
        setError('Failed to load films. Please try again later.');
        setLoading(false);
      }
    };
    fetchFilms();
  }, []);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>Loading Films...</div>;
  }

  if (error) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0', color: 'red' }}>{error}</div>;
  }

  if (films.length === 0) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>No films available to display.</div>;
  }

  return (
    <section className="section container">
      <h2>Our Complete Portfolio</h2>
      <div className="film-grid">
        {films.map(film => (
          <div className="film-card" key={film._id}>
            <img src={film.imageUrl} alt={film.title} />
            <div className="film-card-content">
              <h3>{film.title} ({film.year})</h3>
              <p>Director: {film.director}</p>
              <p>{film.description.substring(0, 100)}...</p>
              <Link to={`/films/${film._id}`} className="btn">View Project</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FilmList;