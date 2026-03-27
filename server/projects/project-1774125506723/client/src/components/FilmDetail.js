import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FilmDetail = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const res = await axios.get(`/api/films/${id}`);
        setFilm(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching film details:', err);
        setError('Failed to load film details. Film not found or server error.');
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>Loading Film Details...</div>;
  }

  if (error) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0', color: 'red' }}>{error}</div>;
  }

  if (!film) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>Film not found.</div>;
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(film.trailerUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <section className="film-detail container">
      <div className="film-detail-content">
        <div className="film-detail-image">
          <img src={film.imageUrl} alt={film.title} />
        </div>
        <div className="film-detail-info">
          <h1>{film.title}</h1>
          <p><span>Director:</span> {film.director}</p>
          <p><span>Year:</span> {film.year}</p>
          <p><span>Description:</span> {film.description}</p>
        </div>
      </div>

      {embedUrl && (
        <div className="film-detail-trailer">
          <h3>Watch Trailer</h3>
          <iframe
            src={embedUrl}
            title={`${film.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </section>
  );
};

export default FilmDetail;