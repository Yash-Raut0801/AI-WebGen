import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as projectService from '../services/projectService';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProject(id);
        setProject(data);
      } catch (err) {
        setError('Failed to fetch project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete project.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading project details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="loading">Project not found.</div>;

  return (
    <div className="project-detail">
      <img src={project.imageUrl} alt={project.title} className="project-detail-image" />
      <h1>{project.title}</h1>
      <div className="project-detail-meta">
        <span>Location: {project.location}</span>
        <span>Year: {project.year}</span>
        <span>Category: {project.category}</span>
      </div>
      <p className="project-detail-description">{project.description}</p>
      <div className="project-detail-actions">
        <Link to={`/edit/${project._id}`} className="btn btn-primary">Edit Project</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete Project</button>
        <Link to="/" className="btn btn-secondary">Back to Projects</Link>
      </div>
    </div>
  );
}

export default ProjectDetail;