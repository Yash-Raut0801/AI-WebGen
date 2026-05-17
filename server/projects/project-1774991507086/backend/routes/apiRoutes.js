const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

// Authentication routes
router.post('/signup', appController.signup);
router.post('/login', appController.login);

// Records routes
router.get('/records', appController.getRecords);

// Cart routes
router.post('/cart', appController.addToCart); // Add item to cart
router.get('/cart/:userId', appController.getCart); // Get user's cart
router.delete('/cart/:cartItemId', appController.removeFromCart); // Remove item from cart

// Order routes
router.post('/order', appController.createOrder); // Place an order

// User Profile
router.get('/profile/:userId', appController.getUserProfile); // Get user details and order history

module.exports = router;