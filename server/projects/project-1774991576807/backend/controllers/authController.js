const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = new sqlite3.Database('./backend/db/database.sql'); // Adjust path as necessary

const JWT_SECRET = 'your_jwt_secret_key'; // Use a strong, environment-variable based secret in production

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Email already registered' });
                }
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name, email: user.email } });
    });
};