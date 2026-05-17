const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sql'); // Adjust path as necessary

exports.getAllRecords = (req, res) => {
    const { genre } = req.query;
    let query = 'SELECT * FROM Records';
    let params = [];

    if (genre) {
        query += ' WHERE genre = ?';
        params.push(genre);
    }

    db.all(query, params, (err, records) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(records);
    });
};

exports.getRecordById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM Records WHERE id = ?', [id], (err, record) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(record);
    });
};