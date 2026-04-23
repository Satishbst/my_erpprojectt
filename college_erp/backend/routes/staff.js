// ================================
// ROUTE: /api/staff
// Staff Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/staff — Get all staff
router.get('/', (req, res) => {
    const staff = db.prepare(
        "SELECT id, name, username, role, dept, subject FROM users WHERE role = 'staff'"
    ).all();
    res.json({ success: true, data: staff });
});

// POST /api/staff — Add new staff
router.post('/', (req, res) => {
    const { name, username, password, dept, subject } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ success: false, message: 'Name, username and password required!' });
    }
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) return res.status(400).json({ success: false, message: 'Username already taken!' });

    const result = db.prepare(
        "INSERT INTO users (name, username, password, role, dept, subject) VALUES (?, ?, ?, 'staff', ?, ?)"
    ).run(name, username, password, dept, subject);

    res.json({ success: true, message: 'Staff added!', id: result.lastInsertRowid });
});

// DELETE /api/staff/:id
router.delete('/:id', (req, res) => {
    const result = db.prepare("DELETE FROM users WHERE id = ? AND role = 'staff'").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Staff not found!' });
    res.json({ success: true, message: 'Staff deleted!' });
});

module.exports = router;
