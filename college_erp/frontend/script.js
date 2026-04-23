// ===================== DATABASE =====================
let DB = {
    users: [
        { id:1, name:'Admin User',     username:'admin',    password:'admin123', role:'admin' },
        { id:2, name:'Rahul Kumar',    username:'student1', password:'pass123',  role:'student', rollNo:'CS2024001', dept:'Computer Science', semester:3 },
        { id:3, name:'Priya Sharma',   username:'student2', password:'pass123',  role:'student', rollNo:'CS2024002', dept:'Computer Science', semester:3 },
        { id:4, name:'Prof. R. Verma', username:'staff1',   password:'pass123',  role:'staff', dept:'Computer Science', subject:'Data Structures' },
        { id:5, name:'Prof. S. Patel', username:'staff2',   password:'pass123',  role:'staff', dept:'Mathematics', subject:'Calculus' }
    ],
    attendance: [
        { studentId:2, subject:'Data Structures', date:'2026-04-20', status:'present' },
        { studentId:2, subject:'Data Structures', date:'2026-04-19', status:'present' },
        { studentId:2, subject:'Data Structures', date:'2026-04-18', status:'absent'  },
        { studentId:2, subject:'Data Structures', date:'2026-04-17', status:'present' },
        { studentId:2, subject:'Calculus',        date:'2026-04-20', status:'present' },
        { studentId:2, subject:'Calculus',        date:'2026-04-19', status:'absent'  },
        { studentId:2, subject:'Calculus',        date:'2026-04-18', status:'absent'  },
        { studentId:2, subject:'Calculus',        date:'2026-04-17', status:'present' },
        { studentId:3, subject:'Data Structures', date:'2026-04-20', status:'present' },
        { studentId:3, subject:'Calculus',        date:'2026-04-20', status:'present' },
    ],
    marks: [
        { studentId:2, subject:'Data Structures',  internal1:18, internal2:20, semesterMarks:78 },
        { studentId:2, subject:'Calculus',          internal1:15, internal2:17, semesterMarks:65 },
        { studentId:2, subject:'Operating Systems', internal1:20, internal2:19, semesterMarks:82 },
        { studentId:3, subject:'Data Structures',  internal1:20, internal2:20, semesterMarks:91 },
        { studentId:3, subject:'Calculus',          internal1:18, internal2:19, semesterMarks:75 },
    ],
    notes: [
        { id:1, title:'Arrays & Linked Lists', subject:'Data Structures', staffId:4,
          content:'Arrays are fixed-size data structures stored in contiguous memory. Linked Lists are dynamic and use pointers.\n\nKey Operations:\n• Array: Access O(1), Insert O(n), Delete O(n)\n• Linked List: Access O(n), Insert O(1), Delete O(1)',
          date:'2026-04-18' },
        { id:2, title:'Sorting Algorithms', subject:'Data Structures', staffId:4,
          content:'Common Sorting Algorithms:\n\n1. Bubble Sort — O(n²)\n2. Merge Sort — O(n log n)\n3. Quick Sort — O(n log n) avg\n4. Heap Sort — O(n log n)',
          date:'2026-04-20' },
        { id:3, title:'Integration Formulas', subject:'Calculus', staffId:5,
          content:'Basic Integration Rules:\n\n∫ xⁿ dx = xⁿ⁺¹/(n+1) + C\n∫ eˣ dx = eˣ + C\n∫ sin(x) dx = -cos(x) + C',
          date:'2026-04-19' }
    ],
    fees: [
        { studentId:2, total:75000, paid:50000, dueDate:'2026-05-15', semester:3 },
        { studentId:3, total:75000, paid:75000, dueDate:'2026-05-15', semester:3 }
    ],
    admissions: [
        { id:1, name:'Amit Singh',   dept:'Computer Science', date:'2026-04-10', status:'pending',  contact:'9876543210' },
        { id:2, name:'Neha Gupta',   dept:'Mathematics',      date:'2026-04-12', status:'approved', contact:'9876543211' },
        { id:3, name:'Rohan Mishra', dept:'Physics',          date:'2026-04-15', status:'pending',  contact:'9876543212' }
    ],
    departments: ['Computer Science','Mathematics','Physics','Chemistry','Electronics','Civil Engineering'],
    courses: ['B.Tech','B.Sc','M.Tech','M.Sc','BCA','MCA']
};

if (localStorage.getItem('erpDB')) {
    try { DB = JSON.parse(localStorage.getItem('erpDB')); } catch(e) {}
}
function saveDB() { localStorage.setItem('erpDB', JSON.stringify(DB)); }

// ===================== DARK MODE =====================
let isDark = localStorage.getItem('darkMode') === 'true';
function applyDark() {
    document.body.classList.toggle('dark', isDark);
    const toggle = document.getElementById('darkToggle');
    if (toggle) toggle.classList.toggle('on', isDark);
}
function toggleDark() {
    isDark = !isDark;
    localStorage.setItem('darkMode', isDark);
    applyDark();
}
applyDark();

// ===================== AUTH =====================
let currentUser = null;
let selectedRole = null;

function selectRole(role, el) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('loginUser').focus();
}

function login() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value.trim();
    const errEl = document.getElementById('loginErr');
    if (!selectedRole) { showNotif('Please select a role first!', 'error'); return; }
    const user = DB.users.find(x => x.username === u && x.password === p && x.role === selectedRole);
    if (!user) { errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    currentUser = user;
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('uName').textContent = user.name;
    document.getElementById('uRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('uAvatar').textContent = { admin:'👨‍💼', student:'👨‍🎓', staff:'👨‍🏫' }[user.role];
    applyDark();
    buildNav();
    goDefault();
}

function logout() {
    currentUser = null; selectedRole = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('loginForm').classList.add('hidden');
}

// ===================== NAVIGATION =====================
const NAV = {
    admin:[
        {id:'adm-dashboard', icon:'📊', label:'Dashboard'},
        {id:'adm-students',  icon:'👨‍🎓', label:'Students'},
        {id:'adm-staff',     icon:'👨‍🏫', label:'Staff'},
        {id:'adm-admissions',icon:'📋', label:'Admissions'},
        {id:'adm-fees',      icon:'💰', label:'Fees'},
        {id:'adm-results',   icon:'📈', label:'Results'},
        {id:'adm-depts',     icon:'🏛️', label:'Departments'},
    ],
    student:[
        {id:'stu-dashboard', icon:'📊', label:'Dashboard'},
        {id:'stu-attendance',icon:'✅', label:'My Attendance'},
        {id:'stu-results',   icon:'📈', label:'My Results'},
        {id:'stu-fees',      icon:'💰', label:'My Fees'},
        {id:'stu-notes',     icon:'📝', label:'Notes'},
    ],
    staff:[
        {id:'sta-dashboard', icon:'📊', label:'Dashboard'},
        {id:'sta-attendance',icon:'✅', label:'Mark Attendance'},
        {id:'sta-marks',     icon:'📊', label:'Upload Marks'},
        {id:'sta-notes',     icon:'📝', label:'Share Notes'},
    ]
};

function buildNav() {
    document.getElementById('navMenu').innerHTML =
        NAV[currentUser.role].map(n =>
            `<div class="nav-item" id="nav-${n.id}" onclick="gotoSection('${n.id}')">
                <span class="nav-icon">${n.icon}</span><span>${n.label}</span>
            </div>`
        ).join('');
}

function goDefault() {
    const def = { admin:'adm-dashboard', student:'stu-dashboard', staff:'sta-dashboard' };
    gotoSection(def[currentUser.role]);
}

const SECTIONS = {
    'adm-dashboard': admDashboard, 'adm-students': admStudents,
    'adm-staff': admStaff, 'adm-admissions': admAdmissions,
    'adm-fees': admFees, 'adm-results': admResults, 'adm-depts': admDepts,
    'stu-dashboard': stuDashboard, 'stu-attendance': stuAttendance,
    'stu-results': stuResults, 'stu-fees': stuFees, 'stu-notes': stuNotes,
    'sta-dashboard': staDashboard, 'sta-attendance': staAttendance,
    'sta-marks': staMarks, 'sta-notes': staNotes,
};

function gotoSection(id) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('nav-' + id);
    if (el) el.classList.add('active');
    if (SECTIONS[id]) SECTIONS[id]();
}

function set(html) { document.getElementById('mainContent').innerHTML = html; }

// Animated counter
function animateCounter(el, target, prefix='', suffix='') {
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
        if (start >= target) clearInterval(timer);
    }, 16);
}

// ===================== ADMIN =====================
function admDashboard() {
    const students  = DB.users.filter(u => u.role === 'student');
    const staff     = DB.users.filter(u => u.role === 'staff');
    const pending   = DB.admissions.filter(a => a.status === 'pending').length;
    const collected = DB.fees.reduce((s,f) => s + f.paid, 0);

    set(`
        <div class="topbar">
            <div class="page-title">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, ${currentUser.name}! Here's what's happening today.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-trend trend-up">↑ Active</div>
                <div class="stat-icon-wrap">👨‍🎓</div>
                <div class="stat-value" id="cnt1">0</div>
                <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-trend trend-up">↑ Active</div>
                <div class="stat-icon-wrap">👨‍🏫</div>
                <div class="stat-value" id="cnt2">0</div>
                <div class="stat-label">Total Staff</div>
            </div>
            <div class="stat-card">
                <div class="stat-trend trend-down">⏳ Pending</div>
                <div class="stat-icon-wrap">📋</div>
                <div class="stat-value" id="cnt3">0</div>
                <div class="stat-label">Pending Admissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-trend trend-up">↑ Collected</div>
                <div class="stat-icon-wrap">💰</div>
                <div class="stat-value" id="cnt4">₹0</div>
                <div class="stat-label">Fee Collected</div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px">
            <div class="card">
                <div class="card-header"><h3>📊 Fee Collection Overview</h3></div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="feeChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3>🏛️ Students by Department</h3></div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="deptChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>📋 Recent Admissions</h3>
                <button class="btn btn-primary btn-sm" onclick="gotoSection('adm-admissions')">View All →</button>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table>
                    <thead><tr><th>#</th><th>Name</th><th>Department</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>${DB.admissions.map((a,i)=>`
                        <tr>
                            <td style="color:var(--text-muted)">${i+1}</td>
                            <td><strong>${a.name}</strong></td>
                            <td>${a.dept}</td><td>${a.date}</td>
                            <td><span class="badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `);

    // Animate counters
    setTimeout(() => {
        animateCounter(document.getElementById('cnt1'), students.length);
        animateCounter(document.getElementById('cnt2'), staff.length);
        animateCounter(document.getElementById('cnt3'), pending);
        document.getElementById('cnt4').textContent = '₹' + Math.floor(collected/1000) + 'K';
    }, 100);

    // Fee Chart
    setTimeout(() => {
        const totalFees = DB.fees.reduce((s,f) => s+f.total, 0);
        const paidFees  = DB.fees.reduce((s,f) => s+f.paid, 0);
        new Chart(document.getElementById('feeChart'), {
            type: 'doughnut',
            data: {
                labels: ['Collected', 'Pending'],
                datasets: [{
                    data: [paidFees, totalFees - paidFees],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0, hoverOffset: 8
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 16, font: { size: 12, family: 'Plus Jakarta Sans' } } }
                },
                cutout: '70%'
            }
        });

        // Dept chart
        const deptCounts = {};
        DB.users.filter(u=>u.role==='student').forEach(s => { deptCounts[s.dept] = (deptCounts[s.dept]||0)+1; });
        new Chart(document.getElementById('deptChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(deptCounts),
                datasets: [{
                    label: 'Students',
                    data: Object.values(deptCounts),
                    backgroundColor: ['#4f46e5','#06b6d4','#10b981','#f59e0b'],
                    borderRadius: 8, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 } } },
                    y: { grid: { color: isDark ? '#334155' : '#f1f5f9' }, ticks: { color: isDark ? '#94a3b8' : '#64748b', stepSize: 1 } }
                }
            }
        });
    }, 200);
}

function admStudents() {
    const students = DB.users.filter(u => u.role === 'student');
    set(`
        <div class="topbar">
            <div class="page-title"><h1>👨‍🎓 Students</h1><p>Manage all enrolled students</p></div>
            <button class="btn btn-primary" onclick="showModal('addStudent')">+ Add Student</button>
        </div>
        <div class="card">
            <div class="card-header">
                <h3>All Students <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${students.length}</span></h3>
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input placeholder="Search students..." oninput="filterTable(this,'stuTable')">
                </div>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table id="stuTable">
                    <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Username</th><th>Department</th><th>Semester</th><th>Action</th></tr></thead>
                    <tbody>${students.map((s,i)=>`
                        <tr>
                            <td style="color:var(--text-muted)">${i+1}</td>
                            <td><strong>👨‍🎓 ${s.name}</strong></td>
                            <td><code style="background:var(--bg);padding:2px 8px;border-radius:6px;font-size:12px">${s.rollNo||'—'}</code></td>
                            <td style="color:var(--text-muted)">${s.username}</td>
                            <td>${s.dept||'—'}</td>
                            <td><span class="badge badge-partial">Sem ${s.semester||1}</span></td>
                            <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${s.id})">🗑 Delete</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `);
}

function admStaff() {
    const staffList = DB.users.filter(u => u.role === 'staff');
    set(`
        <div class="topbar">
            <div class="page-title"><h1>👨‍🏫 Staff</h1><p>Manage all faculty members</p></div>
            <button class="btn btn-primary" onclick="showModal('addStaff')">+ Add Staff</button>
        </div>
        <div class="card">
            <div class="card-header">
                <h3>All Staff <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${staffList.length}</span></h3>
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input placeholder="Search staff..." oninput="filterTable(this,'staffTable')">
                </div>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table id="staffTable">
                    <thead><tr><th>#</th><th>Name</th><th>Username</th><th>Department</th><th>Subject</th><th>Action</th></tr></thead>
                    <tbody>${staffList.map((s,i)=>`
                        <tr>
                            <td style="color:var(--text-muted)">${i+1}</td>
                            <td><strong>👨‍🏫 ${s.name}</strong></td>
                            <td style="color:var(--text-muted)">${s.username}</td>
                            <td>${s.dept||'—'}</td>
                            <td><span class="badge badge-partial">${s.subject||'—'}</span></td>
                            <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${s.id})">🗑 Delete</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `);
}

function admAdmissions() {
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📋 Admissions</h1><p>Manage admission applications</p></div>
            <button class="btn btn-primary" onclick="showModal('addAdmission')">+ New Application</button>
        </div>
        <div class="card">
            <div class="card-header"><h3>Applications <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${DB.admissions.length}</span></h3></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table>
                    <thead><tr><th>#</th><th>Name</th><th>Department</th><th>Contact</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>${DB.admissions.map((a,i)=>`
                        <tr>
                            <td style="color:var(--text-muted)">${i+1}</td>
                            <td><strong>${a.name}</strong></td>
                            <td>${a.dept}</td>
                            <td style="color:var(--text-muted)">${a.contact}</td>
                            <td>${a.date}</td>
                            <td><span class="badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
                            <td>${a.status==='pending'?`<button class="btn btn-success btn-sm" onclick="approveAdm(${a.id})">✓ Approve</button>`:'<span style="color:var(--success)">✅ Done</span>'}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `);
}

function approveAdm(id) {
    const a = DB.admissions.find(x => x.id === id);
    if (a) { a.status = 'approved'; saveDB(); showNotif('Admission approved!', 'success'); admAdmissions(); }
}

function admFees() {
    const totalAll = DB.fees.reduce((s,f) => s+f.total, 0);
    const paidAll  = DB.fees.reduce((s,f) => s+f.paid, 0);
    set(`
        <div class="topbar">
            <div class="page-title"><h1>💰 Fee Management</h1><p>Track and manage student fees</p></div>
            <button class="btn btn-outline" onclick="window.print()">🖨 Print Report</button>
        </div>
        <div class="fee-overview">
            <div class="fee-card total">
                <div class="amount" id="fTotal">₹0</div>
                <div class="flabel">Total Fees</div>
            </div>
            <div class="fee-card paid">
                <div class="amount" id="fPaid">₹0</div>
                <div class="flabel">Collected</div>
            </div>
            <div class="fee-card due">
                <div class="amount" id="fDue">₹0</div>
                <div class="flabel">Pending</div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3>All Fee Records</h3></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table>
                    <thead><tr><th>Student</th><th>Sem</th><th>Total</th><th>Paid</th><th>Due</th><th>Due Date</th><th>Progress</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>${DB.fees.map(f => {
                        const s = DB.users.find(u => u.id === f.studentId);
                        const due = f.total - f.paid;
                        const pct = Math.round(f.paid/f.total*100);
                        const status = f.paid===0?'unpaid':f.paid>=f.total?'paid':'partial';
                        return `<tr>
                            <td><strong>${s?s.name:'—'}</strong></td>
                            <td><span class="badge badge-partial">Sem ${f.semester}</span></td>
                            <td>₹${f.total.toLocaleString()}</td>
                            <td style="color:var(--success)"><strong>₹${f.paid.toLocaleString()}</strong></td>
                            <td style="color:var(--danger)">₹${due.toLocaleString()}</td>
                            <td style="color:var(--text-muted)">${f.dueDate}</td>
                            <td style="min-width:100px">
                                <div class="progress-bar"><div class="progress-fill ${pct>=100?'high':pct>=50?'medium':'low'}" style="width:${pct}%"></div></div>
                                <small style="color:var(--text-muted)">${pct}%</small>
                            </td>
                            <td><span class="badge badge-${status}">${status.toUpperCase()}</span></td>
                            <td>${due>0?`<button class="btn btn-warning btn-sm" onclick="addPayment(${f.studentId})">+ Pay</button>`:'✅'}</td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
                </div>
            </div>
        </div>
    `);
    setTimeout(() => {
        animateCounter(document.getElementById('fTotal'), totalAll, '₹');
        animateCounter(document.getElementById('fPaid'), paidAll, '₹');
        animateCounter(document.getElementById('fDue'), totalAll-paidAll, '₹');
    }, 100);
}

function addPayment(sid) {
    const amt = prompt('Enter payment amount (₹):');
    if (!amt || isNaN(amt) || parseInt(amt) <= 0) return;
    const f = DB.fees.find(x => x.studentId === sid);
    if (f) { f.paid = Math.min(f.paid + parseInt(amt), f.total); saveDB(); showNotif(`₹${parseInt(amt).toLocaleString()} payment recorded! ✓`, 'success'); admFees(); }
}

function admResults() {
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📈 All Results</h1><p>Academic performance overview</p></div>
            <button class="btn btn-outline" onclick="window.print()">🖨 Print Results</button>
        </div>
        <div class="card">
            <div class="card-header"><h3>Marks Report</h3></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table>
                    <thead><tr><th>Student</th><th>Subject</th><th>Int-1 /20</th><th>Int-2 /20</th><th>Sem /100</th><th>Total /140</th><th>%</th><th>Grade</th></tr></thead>
                    <tbody>${DB.marks.map(m => {
                        const s = DB.users.find(u => u.id === m.studentId);
                        const total = m.internal1+m.internal2+m.semesterMarks;
                        const pct = Math.round(total/140*100);
                        const grade = pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':'F';
                        return `<tr>
                            <td><strong>${s?s.name:'—'}</strong></td>
                            <td>${m.subject}</td>
                            <td>${m.internal1}</td><td>${m.internal2}</td><td>${m.semesterMarks}</td>
                            <td><strong>${total}</strong></td>
                            <td style="color:${pct>=60?'var(--success)':'var(--danger)'}">${pct}%</td>
                            <td><span class="badge ${pct>=60?'badge-success':'badge-danger'}">${grade}</span></td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
                </div>
            </div>
        </div>
    `);
}

function admDepts() {
    set(`
        <div class="topbar">
            <div class="page-title"><h1>🏛️ Departments & Courses</h1><p>Manage academic structure</p></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div class="card">
                <div class="card-header">
                    <h3>Departments <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${DB.departments.length}</span></h3>
                    <button class="btn btn-primary btn-sm" onclick="addDept()">+ Add</button>
                </div>
                <div class="card-body">
                    ${DB.departments.map((d,i)=>`
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
                        <span style="font-weight:500">🏛️ ${d}</span>
                        <button class="btn btn-danger btn-sm" onclick="delDept(${i})">✕</button>
                    </div>`).join('')}
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>Courses <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${DB.courses.length}</span></h3>
                    <button class="btn btn-primary btn-sm" onclick="addCourse()">+ Add</button>
                </div>
                <div class="card-body">
                    ${DB.courses.map((c,i)=>`
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
                        <span style="font-weight:500">📚 ${c}</span>
                        <button class="btn btn-danger btn-sm" onclick="delCourse(${i})">✕</button>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    `);
}

function addDept()    { const n=prompt('Department name:'); if(n&&n.trim()){ DB.departments.push(n.trim()); saveDB(); admDepts(); showNotif('Department added!','success'); } }
function delDept(i)   { DB.departments.splice(i,1); saveDB(); admDepts(); }
function addCourse()  { const n=prompt('Course name:'); if(n&&n.trim()){ DB.courses.push(n.trim()); saveDB(); admDepts(); showNotif('Course added!','success'); } }
function delCourse(i) { DB.courses.splice(i,1); saveDB(); admDepts(); }

// ===================== STUDENT =====================
function stuDashboard() {
    const myAtt   = DB.attendance.filter(a => a.studentId === currentUser.id);
    const present = myAtt.filter(a => a.status === 'present').length;
    const attPct  = myAtt.length ? Math.round(present/myAtt.length*100) : 0;
    const myMarks = DB.marks.filter(m => m.studentId === currentUser.id);
    const myFee   = DB.fees.find(f => f.studentId === currentUser.id);
    const feeDue  = myFee ? myFee.total - myFee.paid : 0;

    set(`
        <div class="topbar">
            <div class="page-title">
                <h1>My Dashboard</h1>
                <p>${currentUser.dept} · Roll: ${currentUser.rollNo} · Semester ${currentUser.semester}</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon-wrap">✅</div>
                <div class="stat-value" id="cnt1">0%</div>
                <div class="stat-label">Attendance</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon-wrap">📚</div>
                <div class="stat-value" id="cnt2">0</div>
                <div class="stat-label">Subjects</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon-wrap">📝</div>
                <div class="stat-value" id="cnt3">0</div>
                <div class="stat-label">Notes Available</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon-wrap">💰</div>
                <div class="stat-value" id="cnt4">₹0</div>
                <div class="stat-label">Fee Due</div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px">
            <div class="card">
                <div class="card-header"><h3>📊 Attendance Overview</h3></div>
                <div class="card-body">
                    <div class="chart-container"><canvas id="attChart"></canvas></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3>📈 Subject Performance</h3></div>
                <div class="card-body">
                    <div class="chart-container"><canvas id="marksChart"></canvas></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3>My Marks Summary</h3><button class="btn btn-ghost btn-sm" onclick="gotoSection('stu-results')">View Full →</button></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrap">
                <table>
                    <thead><tr><th>Subject</th><th>Int-1</th><th>Int-2</th><th>Sem</th><th>Total</th><th>Grade</th></tr></thead>
                    <tbody>${myMarks.length ? myMarks.map(m => {
                        const t = m.internal1+m.internal2+m.semesterMarks;
                        const p = Math.round(t/140*100);
                        const g = p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':'F';
                        return `<tr>
                            <td><strong>${m.subject}</strong></td>
                            <td>${m.internal1}/20</td><td>${m.internal2}/20</td><td>${m.semesterMarks}/100</td>
                            <td><strong>${t}/140</strong></td>
                            <td><span class="badge ${p>=60?'badge-success':'badge-danger'}">${g}</span></td>
                        </tr>`;
                    }).join('') : `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📊</div><p>No results uploaded yet</p></div></td></tr>`}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `);

    setTimeout(() => {
        document.getElementById('cnt1').textContent = attPct + '%';
        animateCounter(document.getElementById('cnt2'), myMarks.length);
        animateCounter(document.getElementById('cnt3'), DB.notes.length);
        animateCounter(document.getElementById('cnt4'), feeDue, '₹');

        // Attendance donut chart
        new Chart(document.getElementById('attChart'), {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent'],
                datasets: [{ data: [present, myAtt.length-present], backgroundColor: ['#10b981','#ef4444'], borderWidth: 0, hoverOffset: 6 }]
            },
            options: { responsive:true, maintainAspectRatio:false, cutout:'72%',
                plugins: { legend: { position:'bottom', labels: { color: isDark?'#94a3b8':'#64748b', padding:16, font:{size:12} } } }
            }
        });

        // Marks bar chart
        new Chart(document.getElementById('marksChart'), {
            type: 'bar',
            data: {
                labels: myMarks.map(m => m.subject.split(' ')[0]),
                datasets: [
                    { label:'Internal 1', data: myMarks.map(m=>m.internal1), backgroundColor:'#4f46e5', borderRadius:6 },
                    { label:'Internal 2', data: myMarks.map(m=>m.internal2), backgroundColor:'#06b6d4', borderRadius:6 },
                ]
            },
            options: { responsive:true, maintainAspectRatio:false,
                plugins: { legend: { labels: { color: isDark?'#94a3b8':'#64748b', font:{size:11} } } },
                scales: {
                    x: { grid:{display:false}, ticks:{color: isDark?'#94a3b8':'#64748b'} },
                    y: { max:20, grid:{color: isDark?'#334155':'#f1f5f9'}, ticks:{color: isDark?'#94a3b8':'#64748b'} }
                }
            }
        });
    }, 150);
}

function stuAttendance() {
    const myAtt  = DB.attendance.filter(a => a.studentId === currentUser.id);
    const subjects = [...new Set(myAtt.map(a => a.subject))];
    set(`
        <div class="topbar">
            <div class="page-title"><h1>✅ My Attendance</h1><p>Track your class attendance</p></div>
        </div>
        ${subjects.length ? subjects.map(subj => {
            const sa = myAtt.filter(a => a.subject === subj);
            const present = sa.filter(a => a.status === 'present').length;
            const pct = Math.round(present/sa.length*100);
            const cls = pct>=75?'high':pct>=60?'medium':'low';
            const color = pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)';
            return `
            <div class="card">
                <div class="card-header">
                    <h3>📚 ${subj}</h3>
                    <span style="font-weight:800;font-size:22px;color:${color}">${pct}%</span>
                </div>
                <div class="card-body">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                        <div class="progress-bar" style="flex:1">
                            <div class="progress-fill ${cls}" style="width:${pct}%"></div>
                        </div>
                        <span style="font-size:12px;color:var(--text-muted);white-space:nowrap">
                            ${present}/${sa.length} classes
                        </span>
                    </div>
                    ${pct<75?`<div class="info-banner warning">⚠️ Below 75% — You need ${Math.ceil(sa.length*0.75)-present} more classes to meet requirement!</div>`:'<div class="info-banner success">✅ Good! You meet the attendance requirement.</div>'}
                    <div class="table-wrap" style="margin-top:16px">
                    <table>
                        <thead><tr><th>Date</th><th>Status</th></tr></thead>
                        <tbody>${sa.map(a=>`
                            <tr>
                                <td>${a.date}</td>
                                <td><span class="badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>`;
        }).join('') : `<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-icon">✅</div><p>No attendance records found</p></div></div></div>`}
    `);
}

function stuResults() {
    const myMarks = DB.marks.filter(m => m.studentId === currentUser.id);
    const totalScored = myMarks.reduce((s,m) => s+m.internal1+m.internal2+m.semesterMarks, 0);
    const maxPossible = myMarks.length * 140;
    const overallPct  = maxPossible ? Math.round(totalScored/maxPossible*100) : 0;
    const grade = overallPct>=90?'A+':overallPct>=80?'A':overallPct>=70?'B':overallPct>=60?'C':'F';
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📈 My Results</h1><p>Academic performance details</p></div>
            <button class="btn btn-outline" onclick="window.print()">🖨 Print</button>
        </div>
        <div style="display:grid;grid-template-columns:220px 1fr;gap:20px;margin-bottom:22px">
            <div class="card" style="text-align:center;padding:36px 20px">
                <p style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;font-weight:700">Overall Grade</p>
                <div class="grade-display">${grade}</div>
                <div class="grade-sub" style="margin-top:10px;font-size:16px;font-weight:700;color:var(--text)">${overallPct}%</div>
                <div class="grade-sub">${totalScored} / ${maxPossible} marks</div>
                <div class="info-banner ${overallPct>=60?'success':'danger'}" style="margin-top:16px">
                    ${overallPct>=60?'🎉 Passing Grade':'⚠️ Below passing grade'}
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3>Subject-wise Performance</h3></div>
                <div class="card-body" style="padding:0">
                    <div class="table-wrap">
                    <table>
                        <thead><tr><th>Subject</th><th>Int-1 /20</th><th>Int-2 /20</th><th>Sem /100</th><th>Total /140</th><th>%</th><th>Grade</th></tr></thead>
                        <tbody>${myMarks.length ? myMarks.map(m => {
                            const t = m.internal1+m.internal2+m.semesterMarks;
                            const p = Math.round(t/140*100);
                            const g = p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':'F';
                            return `<tr>
                                <td><strong>${m.subject}</strong></td>
                                <td>${m.internal1}</td><td>${m.internal2}</td><td>${m.semesterMarks}</td>
                                <td><strong>${t}</strong></td>
                                <td style="color:${p>=60?'var(--success)':'var(--danger)'};font-weight:700">${p}%</td>
                                <td><span class="badge ${p>=60?'badge-success':'badge-danger'}">${g}</span></td>
                            </tr>`;
                        }).join('') : `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📊</div><p>No results yet</p></div></td></tr>`}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function stuFees() {
    const f = DB.fees.find(x => x.studentId === currentUser.id);
    const pct = f ? Math.round(f.paid/f.total*100) : 0;
    set(`
        <div class="topbar">
            <div class="page-title"><h1>💰 My Fees</h1><p>Fee payment status</p></div>
        </div>
        ${f ? `
        <div class="fee-overview">
            <div class="fee-card total"><div class="amount" id="fTotal">₹0</div><div class="flabel">Total Fee</div></div>
            <div class="fee-card paid"><div class="amount" id="fPaid">₹0</div><div class="flabel">Amount Paid</div></div>
            <div class="fee-card due"><div class="amount" id="fDue">₹0</div><div class="flabel">Amount Due</div></div>
        </div>
        <div class="card">
            <div class="card-body">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                    <span style="font-size:13px;font-weight:600;color:var(--text)">Payment Progress</span>
                    <span style="font-size:13px;font-weight:700;color:var(--primary)">${pct}%</span>
                </div>
                <div class="progress-bar" style="height:12px;margin-bottom:18px">
                    <div class="progress-fill ${pct>=100?'high':pct>=50?'medium':'low'}" style="width:${pct}%"></div>
                </div>
                <div style="display:flex;gap:20px;font-size:13px;color:var(--text-muted)">
                    <span>📅 Semester: <strong style="color:var(--text)">${f.semester}</strong></span>
                    <span>⏰ Due Date: <strong style="color:var(--text)">${f.dueDate}</strong></span>
                </div>
                ${f.paid < f.total ?
                    `<div class="info-banner warning">⚠️ ₹${(f.total-f.paid).toLocaleString()} remaining. Please contact admin office for payment.</div>` :
                    `<div class="info-banner success">🎉 All fees cleared! Thank you for timely payment.</div>`}
            </div>
        </div>` : `<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-icon">💰</div><p>No fee records found</p></div></div></div>`}
    `);
    if (f) {
        setTimeout(() => {
            animateCounter(document.getElementById('fTotal'), f.total, '₹');
            animateCounter(document.getElementById('fPaid'), f.paid, '₹');
            animateCounter(document.getElementById('fDue'), f.total-f.paid, '₹');
        }, 100);
    }
}

function stuNotes() {
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📝 Study Notes</h1><p>Notes shared by your teachers</p></div>
        </div>
        ${DB.notes.length ? `<div class="notes-grid">${DB.notes.map(n => {
            const staff = DB.users.find(u => u.id === n.staffId);
            return `<div class="note-card">
                <h4>📄 ${n.title}</h4>
                <div class="note-meta">📚 ${n.subject}<br>👨‍🏫 ${staff?staff.name:'Staff'} &nbsp;|&nbsp; 📅 ${n.date}</div>
                <div class="note-content">${n.content.substring(0,120)}${n.content.length>120?'…':''}</div>
                <br><button class="btn btn-primary btn-sm" onclick="viewNote(${n.id})">Read Full →</button>
            </div>`;
        }).join('')}</div>` : `<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-icon">📝</div><p>No notes uploaded yet</p></div></div></div>`}
    `);
}

function viewNote(id) {
    const n = DB.notes.find(x => x.id === id); if(!n) return;
    openModal(`<h3>📄 ${n.title}</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">📚 ${n.subject} &nbsp;|&nbsp; 📅 ${n.date}</p>
        <div style="background:var(--bg);padding:20px;border-radius:12px;font-size:13px;line-height:1.9;white-space:pre-wrap;color:var(--text);border:1px solid var(--border)">${n.content}</div>
        <div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Close</button></div>`);
}

// ===================== STAFF =====================
function staDashboard() {
    const myStudents = DB.users.filter(u => u.role==='student' && u.dept===currentUser.dept);
    const myNotes    = DB.notes.filter(n => n.staffId === currentUser.id);
    const myAtt      = DB.attendance.filter(a => a.subject === currentUser.subject);
    const myMarks    = DB.marks.filter(m => m.subject === currentUser.subject);
    set(`
        <div class="topbar">
            <div class="page-title">
                <h1>Staff Dashboard</h1>
                <p>${currentUser.dept} · Subject: ${currentUser.subject}</p>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon-wrap">👨‍🎓</div><div class="stat-value" id="cnt1">0</div><div class="stat-label">My Students</div></div>
            <div class="stat-card"><div class="stat-icon-wrap">📝</div><div class="stat-value" id="cnt2">0</div><div class="stat-label">Notes Shared</div></div>
            <div class="stat-card"><div class="stat-icon-wrap">✅</div><div class="stat-value" id="cnt3">0</div><div class="stat-label">Attendance Records</div></div>
            <div class="stat-card"><div class="stat-icon-wrap">📊</div><div class="stat-value" id="cnt4">0</div><div class="stat-label">Marks Uploaded</div></div>
        </div>
    `);
    setTimeout(() => {
        animateCounter(document.getElementById('cnt1'), myStudents.length);
        animateCounter(document.getElementById('cnt2'), myNotes.length);
        animateCounter(document.getElementById('cnt3'), myAtt.length);
        animateCounter(document.getElementById('cnt4'), myMarks.length);
    }, 100);
}

function staAttendance() {
    const students = DB.users.filter(u => u.role === 'student');
    const today = new Date().toISOString().split('T')[0];
    set(`
        <div class="topbar">
            <div class="page-title"><h1>✅ Mark Attendance</h1><p>Record today's attendance</p></div>
        </div>
        <div class="card">
            <div class="card-header"><h3>Mark Attendance</h3></div>
            <div class="card-body">
                <div class="form-row" style="margin-bottom:22px">
                    <div class="form-field"><label>Date</label><input type="date" id="attDate" value="${today}"></div>
                    <div class="form-field"><label>Subject</label><input id="attSubj" value="${currentUser.subject||''}" placeholder="Subject name"></div>
                </div>
                <div style="display:flex;gap:10px;margin-bottom:16px">
                    <button class="btn btn-success btn-sm" onclick="markAll('present')">✅ Mark All Present</button>
                    <button class="btn btn-danger btn-sm" onclick="markAll('absent')">❌ Mark All Absent</button>
                </div>
                <div class="table-wrap">
                <table>
                    <thead><tr><th>#</th><th>Roll No</th><th>Student Name</th><th>Department</th><th>Status</th></tr></thead>
                    <tbody>${students.map((s,i)=>`
                        <tr>
                            <td style="color:var(--text-muted)">${i+1}</td>
                            <td><code style="background:var(--bg);padding:2px 8px;border-radius:6px;font-size:12px">${s.rollNo||'—'}</code></td>
                            <td><strong>${s.name}</strong></td>
                            <td>${s.dept||'—'}</td>
                            <td>
                                <select id="att-${s.id}" style="padding:7px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif">
                                    <option value="present">✅ Present</option>
                                    <option value="absent">❌ Absent</option>
                                </select>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
                <div style="margin-top:20px">
                    <button class="btn btn-success" onclick="submitAtt()">💾 Save Attendance</button>
                </div>
            </div>
        </div>
    `);
}

function markAll(status) {
    document.querySelectorAll('[id^="att-"]').forEach(el => el.value = status);
    showNotif(`All marked as ${status}!`, 'info');
}

function submitAtt() {
    const date = document.getElementById('attDate').value;
    const subj = document.getElementById('attSubj').value.trim();
    if (!date || !subj) { showNotif('Fill date and subject!', 'error'); return; }
    DB.users.filter(u => u.role === 'student').forEach(s => {
        const status = document.getElementById('att-'+s.id).value;
        DB.attendance = DB.attendance.filter(a => !(a.studentId===s.id && a.subject===subj && a.date===date));
        DB.attendance.push({ studentId:s.id, subject:subj, date, status });
    });
    saveDB(); showNotif('Attendance saved successfully! ✓', 'success');
}

function staMarks() {
    const students = DB.users.filter(u => u.role === 'student');
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📊 Upload Marks</h1><p>Enter student marks</p></div>
        </div>
        <div class="card">
            <div class="card-header"><h3>Enter Student Marks</h3></div>
            <div class="card-body">
                <div class="form-field" style="max-width:280px;margin-bottom:22px">
                    <label>Subject</label>
                    <input id="marksSubj" value="${currentUser.subject||''}" placeholder="Subject name">
                </div>
                <div class="table-wrap">
                <table>
                    <thead><tr><th>Student</th><th>Internal 1 (/20)</th><th>Internal 2 (/20)</th><th>Semester (/100)</th></tr></thead>
                    <tbody>${students.map(s => {
                        const ex = DB.marks.find(m => m.studentId===s.id && m.subject===currentUser.subject);
                        return `<tr>
                            <td><strong>${s.name}</strong></td>
                            <td><input type="number" id="m1-${s.id}" min="0" max="20" value="${ex?ex.internal1:''}" style="width:75px;padding:7px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif"></td>
                            <td><input type="number" id="m2-${s.id}" min="0" max="20" value="${ex?ex.internal2:''}" style="width:75px;padding:7px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif"></td>
                            <td><input type="number" id="ms-${s.id}" min="0" max="100" value="${ex?ex.semesterMarks:''}" style="width:85px;padding:7px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif"></td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
                </div>
                <div style="margin-top:20px">
                    <button class="btn btn-success" onclick="submitMarks()">💾 Save Marks</button>
                </div>
            </div>
        </div>
    `);
}

function submitMarks() {
    const subj = document.getElementById('marksSubj').value.trim();
    if (!subj) { showNotif('Enter subject!', 'error'); return; }
    DB.users.filter(u => u.role === 'student').forEach(s => {
        const m1 = parseInt(document.getElementById('m1-'+s.id).value)||0;
        const m2 = parseInt(document.getElementById('m2-'+s.id).value)||0;
        const ms = parseInt(document.getElementById('ms-'+s.id).value)||0;
        DB.marks = DB.marks.filter(m => !(m.studentId===s.id && m.subject===subj));
        DB.marks.push({ studentId:s.id, subject:subj, internal1:Math.min(m1,20), internal2:Math.min(m2,20), semesterMarks:Math.min(ms,100) });
    });
    saveDB(); showNotif('Marks saved successfully! ✓', 'success');
}

function staNotes() {
    const myNotes = DB.notes.filter(n => n.staffId === currentUser.id);
    set(`
        <div class="topbar">
            <div class="page-title"><h1>📝 Share Notes</h1><p>Upload study material for students</p></div>
        </div>
        <div class="card" style="margin-bottom:22px">
            <div class="card-header"><h3>Upload New Note</h3></div>
            <div class="card-body">
                <div class="form-row">
                    <div class="form-field"><label>Title</label><input id="ntTitle" placeholder="Note title"></div>
                    <div class="form-field"><label>Subject</label><input id="ntSubj" value="${currentUser.subject||''}" placeholder="Subject"></div>
                </div>
                <div class="form-field" style="margin-bottom:16px">
                    <label>Content</label>
                    <textarea id="ntContent" rows="5" placeholder="Write your note content here..." style="resize:vertical"></textarea>
                </div>
                <button class="btn btn-success" onclick="addNote()">📤 Share Note</button>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3>My Notes <span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:12px;color:var(--text-muted)">${myNotes.length}</span></h3></div>
            <div class="card-body">
                ${myNotes.length ? myNotes.map(n=>`
                    <div style="padding:16px;border:1px solid var(--border);border-radius:12px;margin-bottom:12px;background:var(--bg)">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                            <strong style="font-size:14px;color:var(--text)">📄 ${n.title}</strong>
                            <button class="btn btn-danger btn-sm" onclick="delNote(${n.id})">🗑 Delete</button>
                        </div>
                        <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px">📚 ${n.subject} | 📅 ${n.date}</p>
                        <p style="font-size:13px;color:var(--text-muted)">${n.content.substring(0,120)}…</p>
                    </div>`).join('') : `<div class="empty-state"><div class="empty-icon">📝</div><p>No notes yet. Share your first note above!</p></div>`}
            </div>
        </div>
    `);
}

function addNote() {
    const title   = document.getElementById('ntTitle').value.trim();
    const subj    = document.getElementById('ntSubj').value.trim();
    const content = document.getElementById('ntContent').value.trim();
    if (!title || !content) { showNotif('Fill title and content!', 'error'); return; }
    const id = DB.notes.length ? Math.max(...DB.notes.map(n=>n.id))+1 : 1;
    DB.notes.push({ id, title, subject:subj, content, staffId:currentUser.id, date:new Date().toISOString().split('T')[0] });
    saveDB(); showNotif('Note shared successfully! ✓', 'success'); staNotes();
}

function delNote(id) {
    DB.notes = DB.notes.filter(n => n.id !== id); saveDB(); showNotif('Note deleted!', 'success'); staNotes();
}

// ===================== MODALS =====================
function showModal(type) {
    let html = '';
    if (type === 'addStudent') {
        html = `<h3>➕ Add New Student</h3>
        <div class="form-row">
            <div class="form-field"><label>Full Name</label><input id="m-name" placeholder="Student Name"></div>
            <div class="form-field"><label>Roll No</label><input id="m-roll" placeholder="CS2024XXX"></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Username</label><input id="m-user" placeholder="login username"></div>
            <div class="form-field"><label>Password</label><input id="m-pass" type="password" placeholder="password"></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Department</label><select id="m-dept">${DB.departments.map(d=>`<option>${d}</option>`).join('')}</select></div>
            <div class="form-field"><label>Semester</label><select id="m-sem">${[1,2,3,4,5,6,7,8].map(s=>`<option value="${s}">Semester ${s}</option>`).join('')}</select></div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="addStudent()">✓ Add Student</button>
        </div>`;
    } else if (type === 'addStaff') {
        html = `<h3>➕ Add New Staff</h3>
        <div class="form-row">
            <div class="form-field"><label>Full Name</label><input id="m-name" placeholder="Prof. Name"></div>
            <div class="form-field"><label>Subject</label><input id="m-subj" placeholder="Subject taught"></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Username</label><input id="m-user" placeholder="login username"></div>
            <div class="form-field"><label>Password</label><input id="m-pass" type="password" placeholder="password"></div>
        </div>
        <div class="form-field" style="margin-bottom:14px"><label>Department</label><select id="m-dept">${DB.departments.map(d=>`<option>${d}</option>`).join('')}</select></div>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="addStaff()">✓ Add Staff</button>
        </div>`;
    } else if (type === 'addAdmission') {
        html = `<h3>📋 New Admission Application</h3>
        <div class="form-row">
            <div class="form-field"><label>Applicant Name</label><input id="m-name" placeholder="Full Name"></div>
            <div class="form-field"><label>Contact Number</label><input id="m-contact" placeholder="Phone number"></div>
        </div>
        <div class="form-field" style="margin-bottom:14px"><label>Department</label><select id="m-dept">${DB.departments.map(d=>`<option>${d}</option>`).join('')}</select></div>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="addAdmission()">✓ Submit</button>
        </div>`;
    }
    openModal(html);
}

function openModal(html) {
    closeModal();
    const el = document.createElement('div');
    el.className = 'modal-overlay'; el.id = 'modalOverlay';
    el.innerHTML = `<div class="modal">${html}</div>`;
    el.addEventListener('click', e => { if(e.target === el) closeModal(); });
    document.body.appendChild(el);
}

function closeModal() { const m = document.getElementById('modalOverlay'); if(m) m.remove(); }

function addStudent() {
    const name = document.getElementById('m-name').value.trim();
    const roll = document.getElementById('m-roll').value.trim();
    const user = document.getElementById('m-user').value.trim();
    const pass = document.getElementById('m-pass').value.trim();
    const dept = document.getElementById('m-dept').value;
    const sem  = parseInt(document.getElementById('m-sem').value);
    if (!name||!user||!pass) { showNotif('Fill all required fields!','error'); return; }
    if (DB.users.find(u => u.username === user)) { showNotif('Username already taken!','error'); return; }
    const id = Math.max(...DB.users.map(u=>u.id)) + 1;
    DB.users.push({ id, name, username:user, password:pass, role:'student', rollNo:roll, dept, semester:sem });
    DB.fees.push({ studentId:id, total:75000, paid:0, dueDate:'2026-06-30', semester:sem });
    saveDB(); closeModal(); showNotif('Student added successfully! ✓','success'); admStudents();
}

function addStaff() {
    const name = document.getElementById('m-name').value.trim();
    const subj = document.getElementById('m-subj').value.trim();
    const user = document.getElementById('m-user').value.trim();
    const pass = document.getElementById('m-pass').value.trim();
    const dept = document.getElementById('m-dept').value;
    if (!name||!user||!pass) { showNotif('Fill all required fields!','error'); return; }
    if (DB.users.find(u => u.username === user)) { showNotif('Username already taken!','error'); return; }
    const id = Math.max(...DB.users.map(u=>u.id)) + 1;
    DB.users.push({ id, name, username:user, password:pass, role:'staff', dept, subject:subj });
    saveDB(); closeModal(); showNotif('Staff added successfully! ✓','success'); admStaff();
}

function addAdmission() {
    const name    = document.getElementById('m-name').value.trim();
    const contact = document.getElementById('m-contact').value.trim();
    const dept    = document.getElementById('m-dept').value;
    if (!name) { showNotif('Enter applicant name!','error'); return; }
    const id = DB.admissions.length ? Math.max(...DB.admissions.map(a=>a.id))+1 : 1;
    DB.admissions.push({ id, name, dept, contact, date:new Date().toISOString().split('T')[0], status:'pending' });
    saveDB(); closeModal(); showNotif('Application submitted! ✓','success'); admAdmissions();
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    DB.users = DB.users.filter(u => u.id !== id);
    DB.fees  = DB.fees.filter(f => f.studentId !== id);
    saveDB(); showNotif('User deleted!','success');
    if (currentUser.role === 'admin') admStudents();
}

// ===================== SEARCH FILTER =====================
function filterTable(input, tableId) {
    const q = input.value.toLowerCase();
    const rows = document.getElementById(tableId).querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

// ===================== NOTIFICATION =====================
function showNotif(msg, type = 'success') {
    const icons = { success:'✅', error:'❌', info:'ℹ️' };
    const el = document.getElementById('notification');
    el.innerHTML = `<span>${icons[type]||''}</span> ${msg}`;
    el.className = `notification ${type} show`;
    setTimeout(() => { el.className = 'notification'; }, 3500);
}
