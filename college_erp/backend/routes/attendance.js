// ================================
// ROUTE: /api/attendance
// Attendance Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/attendance — Get all attendance records
router.get('/', (req, res) => {
    const records = db.prepare('SELECT * FROM attendance ORDER BY date DESC').all();
    res.json({ success: true, data: records });
});

// GET /api/attendance/student/:id — Get attendance of a specific student
router.get('/student/:id', (req, res) => {
    const records = db.prepare(
        'SELECT * FROM attendance WHERE studentId = ? ORDER BY date DESC'
    ).all(req.params.id);
    res.json({ success: true, data: records });
});

// POST /api/attendance — Save attendance for a day
// Body: { date, subject, records: [{ studentId, status }] }
router.post('/', (req, res) => {
    const { date, subject, records } = req.body;

    if (!date || !subject || !records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, message: 'Date, subject and records required!' });
    }

    // Delete existing records for same date + subject, then re-insert (upsert approach)
    const deleteStmt = db.prepare(
        'DELETE FROM attendance WHERE studentId = ? AND subject = ? AND date = ?'
    );
    const insertStmt = db.prepare(
        'INSERT INTO attendance (studentId, subject, date, status) VALUES (?, ?, ?, ?)'
    );

    // Use a transaction for better performance
    const saveAll = db.transaction((records) => {
        for (const r of records) {
            deleteStmt.run(r.studentId, subject, date);
            insertStmt.run(r.studentId, subject, date, r.status);
        }
    });

    saveAll(records);
    res.json({ success: true, message: 'Attendance saved successfully!' });
});

module.exports = router;
