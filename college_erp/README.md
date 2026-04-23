# 🎓 College ERP System

A complete College Management System built with HTML, CSS, JavaScript (Frontend) and Node.js + Express + SQLite (Backend).

---

## 👥 Student Details

| Role    | Username  | Password  |
|---------|-----------|-----------|
| Admin   | admin     | admin123  |
| Student | student1  | pass123   |
| Student | student2  | pass123   |
| Staff   | staff1    | pass123   |
| Staff   | staff2    | pass123   |

---

## 📁 Project Structure

```
college-erp/
│
├── frontend/
│   ├── index.html      ← Main HTML page
│   ├── style.css       ← All CSS styles
│   └── script.js       ← All JavaScript logic
│
├── backend/
│   ├── server.js       ← Express server entry point
│   ├── db.js           ← SQLite database setup
│   ├── package.json    ← Node.js dependencies
│   └── routes/
│       ├── auth.js         ← Login/Logout APIs
│       ├── students.js     ← Student CRUD APIs
│       ├── staff.js        ← Staff CRUD APIs
│       ├── attendance.js   ← Attendance APIs
│       ├── fees.js         ← Fee management APIs
│       ├── marks.js        ← Marks/Results APIs
│       ├── notes.js        ← Study notes APIs
│       └── admissions.js   ← Admission APIs
│
├── database/
│   └── erp.db          ← SQLite database file (auto-created)
│
└── README.md
```

---

## 🚀 How to Run

### Option 1: Frontend Only (Simple - No Backend Needed)
1. Open VS Code
2. Install **Live Server** extension
3. Open `frontend/index.html`
4. Right-click → **Open with Live Server**
5. Done! ✅

### Option 2: Full Stack (Frontend + Backend)
1. Install Node.js from https://nodejs.org
2. Open terminal in the `backend/` folder:
```bash
cd backend
npm install
node server.js
```
3. Open browser: http://localhost:3000

---

## ✨ Features

### Admin Portal
- Dashboard with stats (students, staff, fees, admissions)
- Add/Delete students and staff
- Approve admission applications
- Manage fee payments
- View all results/marks
- Manage departments and courses

### Staff Portal
- Dashboard with subject stats
- Mark student attendance
- Upload marks (Internal 1, Internal 2, Semester)
- Share study notes

### Student Portal
- Personal dashboard
- View attendance per subject with progress bar
- View results with grades (A+, A, B, C, F)
- View fee status
- Read notes uploaded by teachers

---

## 🛠️ Technologies Used

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | HTML5, CSS3, JavaScript (Vanilla) |
| Backend   | Node.js, Express.js |
| Database  | SQLite (better-sqlite3) |
| Storage   | LocalStorage (frontend-only mode) |

---

## 📌 Key Concepts Used
- Role-based Authentication (Admin/Staff/Student)
- CRUD Operations
- REST API Design
- Single Page Application (SPA)
- Responsive Design
- localStorage for data persistence
