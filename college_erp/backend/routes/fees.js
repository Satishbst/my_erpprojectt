// ================================
// ROUTE: /api/fees
// Fee Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/fees — Get all fee records
router.get('/', (req, res) => {
    const fees = db.prepare(`
        SELECT f.*, u.name as studentName, u.rollNo
        FROM fees f
        JOIN users u ON f.studentId = u.id
        ORDER BY f.studentId
    `).all();
    res.json({ success: true, data: fees });
});

// GET /api/fees/student/:id — Get fee record of a specific student
router.get('/student/:id', (req, res) => {
    const fee = db.prepare('SELECT * FROM fees WHERE studentId = ?').get(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found!' });
    res.json({ success: true, data: fee });
});

// PUT /api/fees/pay/:studentId — Add payment for a student
// Body: { amount }
router.put('/pay/:studentId', (req, res) => {
    const { amount } = req.body;
    const studentId  = req.params.studentId;

    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'Valid payment amount required!' });
    }

    const fee = db.prepare('SELECT * FROM fees WHERE studentId = ?').get(studentId);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found!' });

    const newPaid = Math.min(fee.paid + parseInt(amount), fee.total);
    db.prepare('UPDATE fees SET paid = ? WHERE studentId = ?').run(newPaid, studentId);

    res.json({ success: true, message: `Payment of ₹${parseInt(amount).toLocaleString()} recorded!`, newPaid });
});

module.exports = router;
