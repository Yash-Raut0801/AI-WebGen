import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectService from '../services/projectService';

function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    year: '',
    imageUrl: '',
    category: 'Residential',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchProject = async () => {
        setLoading(true);
        try {
          const project = await projectService.getProject(id);
          setFormData({
            title: project.title,
            description: project.description,
            location: project.location,
            year: project.year,
            imageUrl: project.imageUrl,
            category: project.category,
          });
        } catch (err) {
          setError('Failed to load project for editing.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'year' ? parseInt(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await projectService.updateProject(id, formData);
      } else {
        await projectService.createProject(formData);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} project.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="loading">Loading project data...</div>;

  return (
    <div className="project-form">
      <h1>{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Completion Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="e.g., https://picsum.photos/1200/500"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Industrial">Industrial</option>
            <option value="Urban Planning">Urban Planning</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : (isEditing ? 'Update Project' : 'Add Project')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;