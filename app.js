const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_node_mysql'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Terhubung ke MySQL...');
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;

    console.log('Received data:', { name, email });

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const insertQuery = `INSERT INTO users (name, email) VALUES (?, ?)`;

    db.query(insertQuery, [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, name, email });
    });
})

// Read
app.get('/users', (req, res) => {
    const selectQuery = 'SELECT * FROM users';

    db.query(selectQuery, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
        console.log('Users retrieved');
    });
});

// Update
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

    db.query(updateQuery, [name, email, userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: userId, name, email });
        console.log('User updated');
    });
});

// Delete
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const deleteQuery = 'DELETE FROM users WHERE id = ?';

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'User deleted', id: userId });
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
