// ================================
// ROUTE: /api/admissions
// Admission Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/admissions — Get all admissions
router.get('/', (req, res) => {
    const admissions = db.prepare('SELECT * FROM admissions ORDER BY date DESC').all();
    res.json({ success: true, data: admissions });
});

// POST /api/admissions — New admission application
router.post('/', (req, res) => {
    const { name, dept, contact } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Applicant name required!' });

    const result = db.prepare(
        "INSERT INTO admissions (name, dept, contact, status) VALUES (?, ?, ?, 'pending')"
    ).run(name, dept, contact);

    res.json({ success: true, message: 'Application submitted!', id: result.lastInsertRowid });
});

// PUT /api/admissions/:id/approve — Approve admission
router.put('/:id/approve', (req, res) => {
    const result = db.prepare("UPDATE admissions SET status = 'approved' WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Application not found!' });
    res.json({ success: true, message: 'Admission approved!' });
});

// PUT /api/admissions/:id/reject — Reject admission
router.put('/:id/reject', (req, res) => {
    const result = db.prepare("UPDATE admissions SET status = 'rejected' WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Application not found!' });
    res.json({ success: true, message: 'Admission rejected!' });
});

module.exports = router;
