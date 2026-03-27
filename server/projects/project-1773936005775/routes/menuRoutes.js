const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', getMenuItems);

// @route   GET api/menu/:id
// @desc    Get single menu item by ID
// @access  Public
router.get('/:id', getMenuItemById);

// @route   POST api/menu
// @desc    Create a menu item
// @access  Public (In a real app, this would be Private/Admin)
router.post('/', createMenuItem);

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Public (In a real app, this would be Private/Admin)
router.put('/:id', updateMenuItem);

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Public (In a real app, this would be Private/Admin)
router.delete('/:id', deleteMenuItem);

module.exports = router;