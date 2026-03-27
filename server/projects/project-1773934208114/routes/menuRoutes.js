const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', menuController.getMenuItems);

// @route   GET api/menu/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/:id', menuController.getMenuItemById);

// @route   POST api/menu
// @desc    Create a menu item
// @access  Private (can add authentication middleware later)
router.post('/', menuController.createMenuItem);

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private
router.put('/:id', menuController.updateMenuItem);

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;