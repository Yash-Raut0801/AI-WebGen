const express = require('express');
const { getProjects, createProject } = require('../controllers/projectController');
const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(createProject); // For demonstration, you might want to protect this in a real app

module.exports = router;