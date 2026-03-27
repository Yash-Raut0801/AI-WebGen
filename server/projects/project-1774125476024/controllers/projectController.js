const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (e.g., admin)
exports.createProject = async (req, res) => {
  const { title, description, imageUrl, category } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      imageUrl,
      category
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};