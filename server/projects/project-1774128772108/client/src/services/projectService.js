import axios from 'axios';

const API_URL = '/api/projects'; // Proxy setup in client/package.json will redirect to http://localhost:5000/api/projects

const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

const updateProject = async (id, projectData) => {
  const response = await axios.put(`${API_URL}/${id}`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};