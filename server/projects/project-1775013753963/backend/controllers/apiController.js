const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database('./backend/db/echo_grooves.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforthisapp';

// Helper to run SQL queries in a promise-based way
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// --- AUTH CONTROLLERS ---

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await dbRun('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed: Users.email')) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await dbGet('SELECT * FROM Users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully!', token, userId: user.id, userName: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    const userId = req.userId; // From auth middleware

    try {
        const user = await dbGet('SELECT id, name, email FROM Users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const orders = await dbAll(`
            SELECT 
                o.id AS orderId,
                o.order_date,
                o.total_amount,
                GROUP_CONCAT(json_object('recordId', oi.record_id, 'title', r.title, 'artist', r.artist, 'quantity', oi.quantity, 'price', oi.price_at_purchase), '|||') AS items
            FROM Orders o
            JOIN Order_Items oi ON o.id = oi.order_id
            JOIN Records r ON oi.record_id = r.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.order_date DESC
        `, [userId]);

        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            order_date: order.order_date,
            total_amount: order.total_amount,
            items: order.items ? order.items.split('|||').map(item => JSON.parse(item)) : []
        }));

        res.json({ user, orders: formattedOrders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile.', error: error.message });
    }
};

// --- RECORD CONTROLLERS ---

exports.getAllRecords = async (req, res) => {
    try {
        const records = await dbAll('SELECT * FROM Records');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records.', error: error.message });
    }
};

// --- CART CONTROLLERS ---

exports.addToCart = async (req, res) => {
    const { recordId, quantity = 1 } = req.body;
    const userId = req.userId;

    try {
        const existingCartItem = await dbGet('SELECT * FROM Cart WHERE user_id = ? AND record_id = ?', [userId, recordId]);

        if (existingCartItem) {
            await dbRun('UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND record_id = ?', [quantity, userId, recordId]);
            res.json({ message: 'Record quantity updated in cart.' });
        } else {
            await dbRun('INSERT INTO Cart (user_id, record_id, quantity) VALUES (?, ?, ?)', [userId, recordId, quantity]);
            res.status(201).json({ message: 'Record added to cart.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding record to cart.', error: error.message });
    }
};

exports.getCartItems = async (req, res) => {
    const userId = req.userId;

    try {
        const cartItems = await dbAll(`
            SELECT c.id AS cartItemId, r.id AS recordId, r.title, r.artist, r.price, r.image_url, c.quantity
            FROM Cart c
            JOIN Records r ON c.record_id = r.id
            WHERE c.user_id = ?
        `, [userId]);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items.', error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { recordId } = req.params;
    const userId = req.userId;

    try {
        const result = await dbRun('DELETE FROM Cart WHERE user_id = ? AND record_id = ?', [userId, recordId]);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
        res.json({ message: 'Record removed from cart.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing record from cart.', error: error.message });
    }
};

// --- ORDER CONTROLLERS ---

exports.placeOrder = async (req, res) => {
    const userId = req.userId;

    try {
        // Get cart items
        const cartItems = await dbAll(`
            SELECT c.record_id, c.quantity, r.price
            FROM Cart c
            JOIN Records r ON c.record_id = r.id
            WHERE c.user_id = ?
        `, [userId]);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Start a transaction (SQLite doesn't have explicit BEGIN/COMMIT for async ops easily without serialization, but db.run is atomic for single statements)
        // For simplicity, we'll run sequentially. A real app might use db.serialize or promises carefully.
        
        // Create order
        const orderResult = await dbRun('INSERT INTO Orders (user_id, total_amount) VALUES (?, ?)', [userId, totalAmount]);
        const orderId = orderResult.id;

        // Move cart items to order_items
        for (const item of cartItems) {
            await dbRun('INSERT INTO Order_Items (order_id, record_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.record_id, item.quantity, item.price]);
        }

        // Clear user's cart
        await dbRun('DELETE FROM Cart WHERE user_id = ?', [userId]);

        res.status(201).json({ message: 'Your order has been dispatched.', orderId });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order.', error: error.message });
    }
};