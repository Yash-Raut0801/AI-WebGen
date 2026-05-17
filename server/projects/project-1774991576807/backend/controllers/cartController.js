const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sql'); // Adjust path as necessary

exports.addToCart = (req, res) => {
    const user_id = req.user.id; // From auth middleware
    const { record_id, quantity = 1 } = req.body;

    db.get('SELECT * FROM Cart WHERE user_id = ? AND record_id = ?', [user_id, record_id], (err, item) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (item) {
            // Update quantity if item already in cart
            db.run('UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND record_id = ?', [quantity, user_id, record_id], function(err) {
                if (err) return res.status(500).json({ message: err.message });
                res.status(200).json({ message: 'Cart item quantity updated', cartId: item.id });
            });
        } else {
            // Add new item to cart
            db.run('INSERT INTO Cart (user_id, record_id, quantity) VALUES (?, ?, ?)', [user_id, record_id, quantity], function(err) {
                if (err) return res.status(500).json({ message: err.message });
                res.status(201).json({ message: 'Item added to cart', cartId: this.lastID });
            });
        }
    });
};

exports.getCart = (req, res) => {
    const user_id = req.user.id;
    const query = `
        SELECT c.id AS cart_item_id, c.record_id, c.quantity, r.title, r.artist, r.price, r.image_url
        FROM Cart c
        JOIN Records r ON c.record_id = r.id
        WHERE c.user_id = ?
    `;
    db.all(query, [user_id], (err, items) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(items);
    });
};

exports.removeFromCart = (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params; // cart_item_id

    db.run('DELETE FROM Cart WHERE id = ? AND user_id = ?', [id, user_id], function(err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Cart item not found or does not belong to user' });
        }
        res.status(200).json({ message: 'Item removed from cart' });
    });
};

exports.purchaseCart = (req, res) => {
    const user_id = req.user.id;
    const order_date = new Date().toISOString();

    db.serialize(() => {
        db.run('BEGIN TRANSACTION;');

        // 1. Create a new order
        db.run('INSERT INTO Orders (user_id, order_date) VALUES (?, ?)', [user_id, order_date], function(err) {
            if (err) {
                db.run('ROLLBACK;');
                return res.status(500).json({ message: err.message });
            }
            const order_id = this.lastID;

            // 2. Get cart items with their current prices
            const getCartItemsQuery = `
                SELECT c.record_id, c.quantity, r.price
                FROM Cart c
                JOIN Records r ON c.record_id = r.id
                WHERE c.user_id = ?
            `;
            db.all(getCartItemsQuery, [user_id], (err, cartItems) => {
                if (err) {
                    db.run('ROLLBACK;');
                    return res.status(500).json({ message: err.message });
                }
                if (cartItems.length === 0) {
                    db.run('ROLLBACK;');
                    return res.status(400).json({ message: 'Cart is empty' });
                }

                // 3. Insert cart items into Order_Items
                const insertOrderItemStmt = db.prepare('INSERT INTO Order_Items (order_id, record_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
                let itemsInserted = 0;
                cartItems.forEach(item => {
                    insertOrderItemStmt.run(order_id, item.record_id, item.quantity, item.price, function(err) {
                        if (err) {
                            db.run('ROLLBACK;');
                            insertOrderItemStmt.finalize();
                            return res.status(500).json({ message: err.message });
                        }
                        itemsInserted++;
                        if (itemsInserted === cartItems.length) {
                            insertOrderItemStmt.finalize();
                            // 4. Clear the user's cart
                            db.run('DELETE FROM Cart WHERE user_id = ?', [user_id], function(err) {
                                if (err) {
                                    db.run('ROLLBACK;');
                                    return res.status(500).json({ message: err.message });
                                }
                                db.run('COMMIT;', (commitErr) => {
                                    if (commitErr) {
                                        return res.status(500).json({ message: commitErr.message });
                                    }
                                    res.status(200).json({ message: 'Your order has been dispatched.', orderId: order_id });
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};