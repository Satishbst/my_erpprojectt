// ================================
// ROUTE: /api/marks
// Marks / Results Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/marks — Get all marks
router.get('/', (req, res) => {
    const marks = db.prepare(`
        SELECT m.*, u.name as studentName
        FROM marks m
        JOIN users u ON m.studentId = u.id
    `).all();
    res.json({ success: true, data: marks });
});

// GET /api/marks/student/:id — Get marks of a specific student
router.get('/student/:id', (req, res) => {
    const marks = db.prepare('SELECT * FROM marks WHERE studentId = ?').all(req.params.id);
    res.json({ success: true, data: marks });
});

// POST /api/marks — Save marks for students
// Body: { subject, records: [{ studentId, internal1, internal2, semesterMarks }] }
router.post('/', (req, res) => {
    const { subject, records } = req.body;
    if (!subject || !records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, message: 'Subject and records required!' });
    }

    const deleteStmt = db.prepare('DELETE FROM marks WHERE studentId = ? AND subject = ?');
    const insertStmt = db.prepare(
        'INSERT INTO marks (studentId, subject, internal1, internal2, semesterMarks) VALUES (?, ?, ?, ?, ?)'
    );

    const saveAll = db.transaction((records) => {
        for (const r of records) {
            deleteStmt.run(r.studentId, subject);
            insertStmt.run(r.studentId, subject,
                Math.min(r.internal1 || 0, 20),
                Math.min(r.internal2 || 0, 20),
                Math.min(r.semesterMarks || 0, 100)
            );
        }
    });

    saveAll(records);
    res.json({ success: true, message: 'Marks saved successfully!' });
});

module.exports = router;
