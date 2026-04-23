// ================================
// COLLEGE ERP - Backend Server
// Node.js + Express
// ================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Import route files
const authRoutes       = require('./routes/auth');
const studentRoutes    = require('./routes/students');
const staffRoutes      = require('./routes/staff');
const attendanceRoutes = require('./routes/attendance');
const feesRoutes       = require('./routes/fees');
const marksRoutes      = require('./routes/marks');
const notesRoutes      = require('./routes/notes');
const admissionRoutes  = require('./routes/admissions');

const app  = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());                        // Allow frontend to talk to backend
app.use(express.json());               // Parse JSON request body
app.use(express.urlencoded({ extended: true }));

// Serve frontend files (optional - if you want everything from one server)
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== ROUTES =====
app.use('/api/auth',       authRoutes);
app.use('/api/students',   studentRoutes);
app.use('/api/staff',      staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees',       feesRoutes);
app.use('/api/marks',      marksRoutes);
app.use('/api/notes',      notesRoutes);
app.use('/api/admissions', admissionRoutes);

// ===== DEFAULT ROUTE =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server error!' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`✅ College ERP Server running at http://localhost:${PORT}`);
});

module.exports = app;
