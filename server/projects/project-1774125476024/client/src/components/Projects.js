import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <h2 style={{textAlign: 'center', color: '#fff'}}>Loading projects...</h2>;
  if (error) return <h2 style={{textAlign: 'center', color: 'red'}}>{error}</h2>;

  return (
    <div className="container">
      <h1 style={{textAlign: 'center', marginBottom: '40px'}}>Our Cinematic Portfolio</h1>
      {projects.length === 0 ? (
        <p style={{textAlign: 'center', fontSize: '1.2em'}}>No projects found. Check back soon!</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <img src={project.imageUrl} alt={project.title} />
              <div className="project-card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <small>Category: {project.category} | Date: {new Date(project.date).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;