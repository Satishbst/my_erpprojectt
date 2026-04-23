// ================================
// ROUTE: /api/students
// Student CRUD Operations
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/students — Get all students
router.get('/', (req, res) => {
    const students = db.prepare(
        "SELECT id, name, username, role, rollNo, dept, semester FROM users WHERE role = 'student'"
    ).all();
    res.json({ success: true, data: students });
});

// GET /api/students/:id — Get single student
router.get('/:id', (req, res) => {
    const student = db.prepare(
        "SELECT id, name, username, role, rollNo, dept, semester FROM users WHERE id = ? AND role = 'student'"
    ).get(req.params.id);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found!' });
    res.json({ success: true, data: student });
});

// POST /api/students — Add new student
router.post('/', (req, res) => {
    const { name, username, password, rollNo, dept, semester } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ success: false, message: 'Name, username and password required!' });
    }

    // Check if username already exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
        return res.status(400).json({ success: false, message: 'Username already taken!' });
    }

    // Insert student
    const result = db.prepare(
        "INSERT INTO users (name, username, password, role, rollNo, dept, semester) VALUES (?, ?, ?, 'student', ?, ?, ?)"
    ).run(name, username, password, rollNo, dept, semester || 1);

    // Create fee record for new student
    db.prepare(
        "INSERT INTO fees (studentId, total, paid, dueDate, semester) VALUES (?, 75000, 0, '2026-06-30', ?)"
    ).run(result.lastInsertRowid, semester || 1);

    res.json({ success: true, message: 'Student added successfully!', id: result.lastInsertRowid });
});

// DELETE /api/students/:id — Delete student
router.delete('/:id', (req, res) => {
    const result = db.prepare("DELETE FROM users WHERE id = ? AND role = 'student'").run(req.params.id);

    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Student not found!' });
    res.json({ success: true, message: 'Student deleted successfully!' });
});

module.exports = router;
