const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;