// ================================
// COLLEGE ERP - Database (db.js)
// Using SQLite (simple file-based DB)
// ================================

const Database = require('better-sqlite3');
const path     = require('path');

// Database file location
const dbPath = path.join(__dirname, '../database/erp.db');
const db     = new Database(dbPath);

// ===== CREATE TABLES =====
db.exec(`
    -- Users table (Admin, Staff, Students)
    CREATE TABLE IF NOT EXISTS users (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT    NOT NULL,
        username  TEXT    UNIQUE NOT NULL,
        password  TEXT    NOT NULL,
        role      TEXT    NOT NULL CHECK(role IN ('admin','student','staff')),
        rollNo    TEXT,
        dept      TEXT,
        semester  INTEGER,
        subject   TEXT,
        createdAt TEXT    DEFAULT (date('now'))
    );

    -- Attendance table
    CREATE TABLE IF NOT EXISTS attendance (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        subject   TEXT    NOT NULL,
        date      TEXT    NOT NULL,
        status    TEXT    NOT NULL CHECK(status IN ('present','absent')),
        FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Marks table
    CREATE TABLE IF NOT EXISTS marks (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId     INTEGER NOT NULL,
        subject       TEXT    NOT NULL,
        internal1     INTEGER DEFAULT 0,
        internal2     INTEGER DEFAULT 0,
        semesterMarks INTEGER DEFAULT 0,
        FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Fees table
    CREATE TABLE IF NOT EXISTS fees (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        total     INTEGER DEFAULT 75000,
        paid      INTEGER DEFAULT 0,
        dueDate   TEXT,
        semester  INTEGER,
        FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Notes table
    CREATE TABLE IF NOT EXISTS notes (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        title     TEXT NOT NULL,
        subject   TEXT,
        content   TEXT NOT NULL,
        staffId   INTEGER NOT NULL,
        date      TEXT DEFAULT (date('now')),
        FOREIGN KEY (staffId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Admissions table
    CREATE TABLE IF NOT EXISTS admissions (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT NOT NULL,
        dept      TEXT,
        contact   TEXT,
        date      TEXT DEFAULT (date('now')),
        status    TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected'))
    );

    -- Departments table
    CREATE TABLE IF NOT EXISTS departments (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );
`);

// ===== INSERT SAMPLE DATA (only if tables are empty) =====
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
    // Insert default departments
    const depts = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Civil Engineering'];
    const insertDept = db.prepare('INSERT OR IGNORE INTO departments (name) VALUES (?)');
    depts.forEach(d => insertDept.run(d));

    // Insert default users
    db.prepare(`INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)`).run('Admin User', 'admin', 'admin123', 'admin');
    db.prepare(`INSERT INTO users (name, username, password, role, rollNo, dept, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`).run('Rahul Kumar', 'student1', 'pass123', 'student', 'CS2024001', 'Computer Science', 3);
    db.prepare(`INSERT INTO users (name, username, password, role, rollNo, dept, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`).run('Priya Sharma', 'student2', 'pass123', 'student', 'CS2024002', 'Computer Science', 3);
    db.prepare(`INSERT INTO users (name, username, password, role, dept, subject) VALUES (?, ?, ?, ?, ?, ?)`).run('Prof. R. Verma', 'staff1', 'pass123', 'staff', 'Computer Science', 'Data Structures');
    db.prepare(`INSERT INTO users (name, username, password, role, dept, subject) VALUES (?, ?, ?, ?, ?, ?)`).run('Prof. S. Patel', 'staff2', 'pass123', 'staff', 'Mathematics', 'Calculus');

    // Insert sample fees
    db.prepare(`INSERT INTO fees (studentId, total, paid, dueDate, semester) VALUES (?, ?, ?, ?, ?)`).run(2, 75000, 50000, '2026-05-15', 3);
    db.prepare(`INSERT INTO fees (studentId, total, paid, dueDate, semester) VALUES (?, ?, ?, ?, ?)`).run(3, 75000, 75000, '2026-05-15', 3);

    // Insert sample admissions
    db.prepare(`INSERT INTO admissions (name, dept, contact, date, status) VALUES (?, ?, ?, ?, ?)`).run('Amit Singh', 'Computer Science', '9876543210', '2026-04-10', 'pending');
    db.prepare(`INSERT INTO admissions (name, dept, contact, date, status) VALUES (?, ?, ?, ?, ?)`).run('Neha Gupta', 'Mathematics', '9876543211', '2026-04-12', 'approved');

    console.log('✅ Sample data inserted into database!');
}

module.exports = db;
