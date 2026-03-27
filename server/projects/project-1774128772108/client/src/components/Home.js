import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as projectService from '../services/projectService';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;
  if (projects.length === 0) return <div className="loading">No projects found. Start by adding one!</div>;

  return (
    <section>
      <h1 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '40px', fontSize: '2.5em'}}>Our Iconic Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
            <img src={project.imageUrl} alt={project.title} className="project-card-image" />
            <div className="project-card-content">
              <h2 className="project-card-title">{project.title}</h2>
              <p className="project-card-location">{project.location}</p>
              <p className="project-card-year">Completed: {project.year}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Home;