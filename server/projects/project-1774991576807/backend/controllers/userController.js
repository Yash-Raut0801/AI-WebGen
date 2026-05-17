const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sql'); // Adjust path as necessary

exports.getUserProfile = (req, res) => {
    const user_id = req.user.id; // From auth middleware
    db.get('SELECT id, name, email FROM Users WHERE id = ?', [user_id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    });
};

exports.getUserOrders = (req, res) => {
    const user_id = req.user.id; // From auth middleware
    const query = `
        SELECT
            o.id AS order_id,
            o.order_date,
            oi.quantity,
            oi.price_at_purchase,
            r.title,
            r.artist,
            r.image_url
        FROM Orders o
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Records r ON oi.record_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC, o.id DESC;
    `;
    db.all(query, [user_id], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        // Group order items by order ID
        const groupedOrders = orders.reduce((acc, item) => {
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
                quantity: item.quantity,
                price_at_purchase: item.price_at_purchase,
                image_url: item.image_url
            });
            return acc;
        }, {});

        res.status(200).json(Object.values(groupedOrders));
    });
};