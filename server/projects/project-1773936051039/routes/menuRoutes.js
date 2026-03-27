const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', getAllMenuItems);

// @route   GET api/menu/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/:id', getMenuItemById);

// @route   POST api/menu
// @desc    Create a menu item
// @access  Private (e.g., admin) - for simplicity, public here
router.post('/', createMenuItem);

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private (e.g., admin) - for simplicity, public here
router.put('/:id', updateMenuItem);

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private (e.g., admin) - for simplicity, public here
router.delete('/:id', deleteMenuItem);

module.exports = router;