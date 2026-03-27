const express = require('express');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize(['admin']), createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, authorize(['admin']), updateMenuItem)
  .delete(protect, authorize(['admin']), deleteMenuItem);

module.exports = router;