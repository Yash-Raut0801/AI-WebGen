const sqlite3 = require('sqlite3').verbose();
const fs = require('fs'); // Import fs module for reading SQL file

const db = new sqlite3.Database('./db/echo_grooves.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize the database schema if not exists from database.sql
        fs.readFile('./backend/db/database.sql', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading database.sql:', err.message);
                return;
            }
            db.exec(data, (err) => {
                if (err) {
                    console.error('Error initializing database:', err.message);
                } else {
                    console.log('Database schema and sample data initialized or already exist.');
                }
            });
        });
    }
});

// Helper function to run SQL queries and return a Promise
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

// Helper function to get multiple rows from SQL query and return a Promise
const allQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Helper function to get a single row from SQL query and return a Promise
const getQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};


// User Signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    // In a real application, hash the password before storing (e.g., using bcrypt).
    // For this example, passwords are stored in plain text as per "simple" instruction,
    // but it is highly recommended to use a strong hashing algorithm like bcrypt.
    try {
        const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const result = await runQuery('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
        res.status(201).json({ message: 'User registered successfully', userId: result.id });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
        if (!user || user.password !== password) { // In a real app, compare hashed passwords (e.g., bcrypt.compareSync)
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // In a real application, generate a JWT token here for secure authentication.
        // For this example, we return a simple user ID, name, and email for client-side session management.
        res.status(200).json({ message: 'Login successful', userId: user.id, userName: user.name, userEmail: user.email });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Get All Records
exports.getRecords = async (req, res) => {
    try {
        const records = await allQuery('SELECT * FROM records');
        res.status(200).json(records);
    } catch (error) {
        console.error('Get records error:', error.message);
        res.status(500).json({ message: 'Server error fetching records.' });
    }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    const { userId, recordId, quantity } = req.body;
    try {
        const existingCartItem = await getQuery('SELECT * FROM cart WHERE user_id = ? AND record_id = ?', [userId, recordId]);
        if (existingCartItem) {
            await runQuery('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND record_id = ?', [quantity, userId, recordId]);
        } else {
            await runQuery('INSERT INTO cart (user_id, record_id, quantity) VALUES (?, ?, ?)', [userId, recordId, quantity]);
        }
        res.status(200).json({ message: 'Item added to cart successfully.' });
    } catch (error) {
        console.error('Add to cart error:', error.message);
        res.status(500).json({ message: 'Server error adding item to cart.' });
    }
};

// Get User Cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await allQuery(
            `SELECT c.id AS cart_item_id, r.id AS record_id, r.title, r.artist, r.price, r.image_url, c.quantity
             FROM cart c JOIN records r ON c.record_id = r.id
             WHERE c.user_id = ?`,
            [userId]
        );
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Get cart error:', error.message);
        res.status(500).json({ message: 'Server error fetching cart.' });
    }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;
    try {
        await runQuery('DELETE FROM cart WHERE id = ?', [cartItemId]);
        res.status(200).json({ message: 'Item removed from cart successfully.' });
    } catch (error) {
        console.error('Remove from cart error:', error.message);
        res.status(500).json({ message: 'Server error removing item from cart.' });
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    const { userId, cartItems } = req.body; // cartItems is an array of { record_id, quantity }
    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'User ID and cart items are required to place an order.' });
    }

    try {
        // Create a new order entry
        const orderResult = await runQuery('INSERT INTO orders (user_id, order_date) VALUES (?, ?)', [userId, new Date().toISOString()]);
        const orderId = orderResult.id;

        // Add each cart item to order_items
        for (const item of cartItems) {
            await runQuery('INSERT INTO order_items (order_id, record_id, quantity) VALUES (?, ?, ?)', [orderId, item.record_id, item.quantity]);
        }
        
        // Clear the user's cart after order is placed
        await runQuery('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Create order error:', error.message);
        res.status(500).json({ message: 'Server error creating order.' });
    }
};

// Get User Profile (including order history)
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await getQuery('SELECT id, name, email FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const orders = await allQuery(
            `SELECT o.id AS order_id, o.order_date, oi.quantity, r.title, r.artist, r.price, r.image_url
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN records r ON oi.record_id = r.id
             WHERE o.user_id = ?
             ORDER BY o.order_date DESC`,
            [userId]
        );

        // Group order items by order ID for easier frontend consumption
        const orderHistory = orders.reduce((acc, item) => {
            if (!acc[item.order_id]) {
                acc[item.order_id] = {
                    order_id: item.order_id,
                    order_date: item.order_date,
                    items: []
                };
            }
            acc[item.order_id].items.push({
                title: item.title,
                artist: item.artist,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image_url
            });
            return acc;
        }, {});

        res.status(200).json({ user, orderHistory: Object.values(orderHistory) });
    } catch (error) {
        console.error('Get user profile error:', error.message);
        res.status(500).json({ message: 'Server error fetching user profile.' });
    }
};