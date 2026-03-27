import React from 'react';

function Projects() {
  const films = [
    {
      id: 1,
      title: 'Echoes of Tomorrow',
      genre: 'Sci-Fi Thriller',
      description: 'A mind-bending journey into a dystopian future where memories are currency and identity is fluid.',
      image: 'https://picsum.photos/400/220?random=2'
    },
    {
      id: 2,
      title: 'The Silent Witness',
      genre: 'Mystery Drama',
      description: 'A gripping tale of suspense as a detective uncovers dark secrets in a seemingly peaceful small town.',
      image: 'https://picsum.photos/400/220?random=3'
    },
    {
      id: 3,
      title: 'Whispers in the Wind',
      genre: 'Romantic Epic',
      description: 'An sweeping saga of love and loss set against the backdrop of historical turmoil and breathtaking landscapes.',
      image: 'https://picsum.photos/400/220?random=4'
    },
    {
      id: 4,
      title: 'Neon Shadows',
      genre: 'Cyberpunk Action',
      description: 'High-octane action in a technologically advanced city where artificial intelligence clashes with human rebellion.',
      image: 'https://picsum.photos/400/220?random=5'
    },
    {
      id: 5,
      title: 'The Last Starfall',
      genre: 'Fantasy Adventure',
      description: 'A young hero embarks on a perilous quest to save their world from an ancient darkness.',
      image: 'https://picsum.photos/400/220?random=6'
    },
    {
      id: 6,
      title: 'Beneath the Surface',
      genre: 'Documentary',
      description: 'An insightful look into the hidden ecosystems of the deep ocean and the threats they face.',
      image: 'https://picsum.photos/400/220?random=7'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Our Cinematic Works</h2>
        <div className="projects-grid">
          {films.map(film => (
            <div className="project-card" key={film.id}>
              <img src={film.image} alt={film.title} />
              <div className="project-info">
                <h3>{film.title}</h3>
                <p><strong>Genre:</strong> {film.genre}</p>
                <p>{film.description}</p>
                <a href="#!" className="btn">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;