// ================================
// ROUTE: /api/auth
// Login & Logout
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST /api/auth/login
// Body: { username, password, role }
router.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Username, password and role required!' });
    }

    // Find user in database
    const user = db.prepare(
        'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?'
    ).get(username, password, role);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials!' });
    }

    // Remove password before sending to frontend
    const { password: _, ...safeUser } = user;

    res.json({ success: true, user: safeUser, message: 'Login successful!' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully!' });
});

module.exports = router;
