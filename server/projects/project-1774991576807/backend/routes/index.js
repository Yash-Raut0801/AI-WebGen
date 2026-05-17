const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController');
const recordController = require('../controllers/recordController');
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');

const JWT_SECRET = 'your_jwt_secret_key'; // Use the same secret as in authController

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

// Auth Routes
router.post('/signup', authController.register);
router.post('/login', authController.login);

// Record Routes
router.get('/records', recordController.getAllRecords);
router.get('/records/:id', recordController.getRecordById);

// Cart Routes (protected)
router.post('/cart', authenticateToken, cartController.addToCart);
router.get('/cart', authenticateToken, cartController.getCart);
router.delete('/cart/:id', authenticateToken, cartController.removeFromCart);
router.post('/order', authenticateToken, cartController.purchaseCart);

// User Profile Routes (protected)
router.get('/profile', authenticateToken, userController.getUserProfile);
router.get('/profile/orders', authenticateToken, userController.getUserOrders);

module.exports = router;