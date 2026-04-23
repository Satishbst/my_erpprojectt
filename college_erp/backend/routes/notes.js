// ================================
// ROUTE: /api/notes
// Study Notes Management
// ================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/notes — Get all notes
router.get('/', (req, res) => {
    const notes = db.prepare(`
        SELECT n.*, u.name as staffName
        FROM notes n
        JOIN users u ON n.staffId = u.id
        ORDER BY n.date DESC
    `).all();
    res.json({ success: true, data: notes });
});

// POST /api/notes — Add new note
router.post('/', (req, res) => {
    const { title, subject, content, staffId } = req.body;
    if (!title || !content || !staffId) {
        return res.status(400).json({ success: false, message: 'Title, content and staffId required!' });
    }

    const result = db.prepare(
        'INSERT INTO notes (title, subject, content, staffId) VALUES (?, ?, ?, ?)'
    ).run(title, subject, content, staffId);

    res.json({ success: true, message: 'Note shared!', id: result.lastInsertRowid });
});

// DELETE /api/notes/:id — Delete a note
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Note not found!' });
    res.json({ success: true, message: 'Note deleted!' });
});

module.exports = router;
