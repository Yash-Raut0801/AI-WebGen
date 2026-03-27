import axios from 'axios';

const API_URL = '/api/projects'; // Proxy is set in package.json for development

const getAllProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// This function could be used for admin to add projects
const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

const projectService = {
  getAllProjects,
  createProject,
};

export default projectService;