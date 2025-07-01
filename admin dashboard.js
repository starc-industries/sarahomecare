// Admin Dashboard JavaScript - Standalone Version
let currentUser = null;
let allUsers = [];
let allAppointments = [];
let allContacts = [];
let activityLogs = [];
let currentAssignmentType = null;
let currentAssignmentId = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
});

// Check authentication and admin role
function checkAuthentication() {
    const authToken = localStorage.getItem('hospital_auth_token');
    const userData = localStorage.getItem('hospital_current_user');
    
    if (!authToken || !userData) {
        window.location.href = 'index_standalone.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        
        if (currentUser.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index_standalone.html';
            return;
        }
        
        updateUserInfo();
        loadDashboardData();
    } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
    }
}

// Update user information
function updateUserInfo() {
    document.getElementById('currentUserName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('currentUserRole').textContent = 'Administrator';
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Forms
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    const assignmentForm = document.getElementById('assignmentForm');
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', handleAssignment);
    }
}

// Show specific section
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        appointments: 'Appointments',
        contacts: 'Contact Messages',
        monitoring: 'User Monitoring',
        reports: 'Reports & Analytics',
        settings: 'System Settings'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName];
    
    // Load section data
    loadSectionData(sectionName);
}

// Load dashboard data
function loadDashboardData() {
    try {
        // Load data from localStorage
        allUsers = JSON.parse(localStorage.getItem('hospital_users') || '[]');
        allAppointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
        allContacts = JSON.parse(localStorage.getItem('hospital_contacts') || '[]');
        activityLogs = JSON.parse(localStorage.getItem('hospital_activity_logs') || '[]');
        
        // Update statistics
        document.getElementById('totalUsers').textContent = allUsers.length;
        document.getElementById('totalAppointments').textContent = allAppointments.length;
        document.getElementById('pendingAppointments').textContent = 
            allAppointments.filter(apt => apt.status === 'pending').length;
        document.getElementById('unreadContacts').textContent = 
            allContacts.filter(contact => contact.status === 'unread').length;
        
        // Update notification count
        const pendingCount = allAppointments.filter(apt => apt.status === 'pending').length +
                           allContacts.filter(contact => contact.status === 'unread').length;
        document.getElementById('notificationCount').textContent = pendingCount;
        
        // Load dashboard components
        loadRecentAppointments();
        loadRecentContacts();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Load section-specific data
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'users':
            loadUsers();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'monitoring':
            loadMonitoringData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Load users
function loadUsers() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    allUsers.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
    
    // Populate assignment dropdown
    loadStaffOptions();
}

// Create user table row
function createUserRow(user) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div>
                <strong>${user.firstName} ${user.lastName}</strong><br>
                <small class="text-muted">${user.employeeId || 'N/A'}</small>
            </div>
        </td>
        <td>${user.email}</td>
        <td><span class="status-badge status-${user.role}">${user.role}</span></td>
        <td>${user.department || 'N/A'}</td>
        <td><span class="status-badge status-${user.status}">${user.status}</span></td>
        <td>${formatDate(user.lastLogin)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Load appointments
function loadAppointments() {
    const tbody = document.querySelector('#appointmentsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    allAppointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        tbody.appendChild(row);
    });
}

// Create appointment table row
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    const assignedUser = allUsers.find(u => u.id === appointment.assignedTo);
    
    row.innerHTML = `
        <td>
            <div>
                <strong>${appointment.patientName}</strong><br>
                <small class="text-muted">${appointment.patientEmail}</small>
            </div>
        </td>
        <td>${appointment.department}</td>
        <td>
            <div>
                ${formatDate(appointment.appointmentDate)}<br>
                <small>${appointment.appointmentTime}</small>
            </div>
        </td>
        <td>${assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}</td>
        <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
        <td><span class="priority-${appointment.priority} status-badge">${appointment.priority}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewAppointment(${appointment.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="assignAppointment(${appointment.id})">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="updateAppointmentStatus(${appointment.id}, '${appointment.status}')">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Load contacts
function loadContacts() {
    const tbody = document.querySelector('#contactsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    allContacts.forEach(contact => {
        const row = createContactRow(contact);
        tbody.appendChild(row);
    });
}

// Create contact table row
function createContactRow(contact) {
    const row = document.createElement('tr');
    const assignedUser = allUsers.find(u => u.id === contact.assignedTo);
    
    row.innerHTML = `
        <td>
            <div>
                <strong>${contact.name}</strong><br>
                <small class="text-muted">${contact.phone || 'No phone'}</small>
            </div>
        </td>
        <td>${contact.email}</td>
        <td>${contact.subject}</td>
        <td><span class="priority-${contact.priority || 'medium'} status-badge">${contact.priority || 'medium'}</span></td>
        <td>${assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}</td>
        <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
        <td>${formatDate(contact.createdAt)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewContact(${contact.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="assignContact(${contact.id})">
                    <i class="fas fa-user-plus"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Load monitoring data
function loadMonitoringData() {
    loadActiveUsers();
    loadActivityLogs();
    loadPerformanceMetrics();
    generateLoginChart();
}

// Load active users
function loadActiveUsers() {
    const container = document.getElementById('activeUsersList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Simulate active users (users who logged in today)
    const today = new Date().toDateString();
    const activeUsers = allUsers.filter(user => {
        const lastLogin = new Date(user.lastLogin).toDateString();
        return lastLogin === today;
    });
    
    activeUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'active-user-item';
        userItem.innerHTML = `
            <div class="user-status"></div>
            <div>
                <strong>${user.firstName} ${user.lastName}</strong><br>
                <small class="text-muted">${user.role} - ${user.department || 'N/A'}</small>
            </div>
        `;
        container.appendChild(userItem);
    });
    
    if (activeUsers.length === 0) {
        container.innerHTML = '<div class="empty-state">No active users</div>';
    }
}

// Load activity logs
function loadActivityLogs() {
    const tbody = document.querySelector('#activityLogTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Show latest 20 logs
    const recentLogs = activityLogs.slice(-20).reverse();
    
    recentLogs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.userName}</td>
            <td>${log.action}</td>
            <td>${log.ipAddress}</td>
            <td>${formatDate(log.timestamp)}</td>
            <td><small>${log.details}</small></td>
        `;
        tbody.appendChild(row);
    });
}

// Load performance metrics
function loadPerformanceMetrics() {
    // Simulate performance data
    document.getElementById('totalPageViews').textContent = Math.floor(Math.random() * 10000) + 5000;
    document.getElementById('uniqueVisitors').textContent = Math.floor(Math.random() * 1000) + 500;
    document.getElementById('avgSessionTime').textContent = Math.floor(Math.random() * 30) + 15 + ' min';
    document.getElementById('bounceRate').textContent = Math.floor(Math.random() * 20) + 20 + '%';
}

// Generate login chart (simplified)
function generateLoginChart() {
    const canvas = document.getElementById('loginChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple bar chart simulation
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 150, 40, -Math.random() * 100);
    ctx.fillRect(100, 150, 40, -Math.random() * 100);
    ctx.fillRect(150, 150, 40, -Math.random() * 100);
    ctx.fillRect(200, 150, 40, -Math.random() * 100);
    ctx.fillRect(250, 150, 40, -Math.random() * 100);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Mon', 70, 170);
    ctx.fillText('Tue', 120, 170);
    ctx.fillText('Wed', 170, 170);
    ctx.fillText('Thu', 220, 170);
    ctx.fillText('Fri', 270, 170);
}

// Load reports data
function loadReportsData() {
    loadMonthlySummary();
    generateReportCharts();
}

// Load monthly summary
function loadMonthlySummary() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyUsers = allUsers.filter(user => {
        const createdDate = new Date(user.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    const monthlyAppointments = allAppointments.filter(apt => {
        const createdDate = new Date(apt.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    const monthlyMessages = allContacts.filter(contact => {
        const createdDate = new Date(contact.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    const resolvedMessages = allContacts.filter(contact => contact.status === 'resolved').length;
    const resolutionRate = allContacts.length > 0 ? Math.round((resolvedMessages / allContacts.length) * 100) : 0;
    
    document.getElementById('monthlyNewUsers').textContent = monthlyUsers;
    document.getElementById('monthlyAppointments').textContent = monthlyAppointments;
    document.getElementById('monthlyMessages').textContent = monthlyMessages;
    document.getElementById('resolutionRate').textContent = resolutionRate + '%';
}

// Generate report charts
function generateReportCharts() {
    generateUserGrowthChart();
    generateAppointmentTrendChart();
    generateDepartmentChart();
}

// Generate user growth chart
function generateUserGrowthChart() {
    const canvas = document.getElementById('userGrowthChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple line chart simulation
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(100, 120);
    ctx.lineTo(150, 100);
    ctx.lineTo(200, 80);
    ctx.lineTo(250, 60);
    ctx.lineTo(300, 40);
    ctx.stroke();
    
    // Add points
    ctx.fillStyle = '#10b981';
    [50, 100, 150, 200, 250, 300].forEach((x, i) => {
        const y = 150 - (i * 20) - 10;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Generate appointment trend chart
function generateAppointmentTrendChart() {
    const canvas = document.getElementById('appointmentTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple area chart simulation
    ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(100, 130);
    ctx.lineTo(150, 110);
    ctx.lineTo(200, 90);
    ctx.lineTo(250, 70);
    ctx.lineTo(300, 50);
    ctx.lineTo(300, 150);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(100, 130);
    ctx.lineTo(150, 110);
    ctx.lineTo(200, 90);
    ctx.lineTo(250, 70);
    ctx.lineTo(300, 50);
    ctx.stroke();
}

// Generate department chart
function generateDepartmentChart() {
    const canvas = document.getElementById('departmentChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple pie chart simulation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    let currentAngle = 0;
    
    for (let i = 0; i < 5; i++) {
        const sliceAngle = (Math.PI * 2) / 5;
        
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
    }
}

// Load settings data
function loadSettingsData() {
    // Settings are pre-filled in HTML, no additional loading needed
}

// Recent data loaders
function loadRecentAppointments() {
    const tbody = document.querySelector('#recentAppointmentsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const recentAppointments = allAppointments.slice(-5).reverse();
    
    recentAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.patientName}</td>
            <td>${appointment.department}</td>
            <td>${formatDate(appointment.appointmentDate)}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewAppointment(${appointment.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadRecentContacts() {
    const tbody = document.querySelector('#recentContactsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const recentContacts = allContacts.slice(-5).reverse();
    
    recentContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.subject}</td>
            <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewContact(${contact.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Form handlers
function handleAddUser(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    try {
        // Check if email already exists
        if (allUsers.some(u => u.email === userData.email)) {
            showError('Email already exists. Please use a different email.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: allUsers.length + 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone || '',
            role: userData.role,
            department: userData.department || '',
            employeeId: userData.role === 'employee' ? `EMP${String(allUsers.length + 1).padStart(3, '0')}` : null,
            password: userData.password,
            status: 'active',
            lastLogin: 'Never',
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        allUsers.push(newUser);
        localStorage.setItem('hospital_users', JSON.stringify(allUsers));
        
        // Log activity
        logActivity(currentUser.id, 'User Created', 'Users', newUser.id, {
            name: `${newUser.firstName} ${newUser.lastName}`,
            role: newUser.role,
            email: newUser.email
        });
        
        showSuccess('User created successfully!');
        closeAddUserModal();
        e.target.reset();
        
        // Reload users if on users section
        if (document.getElementById('users-section').classList.contains('active')) {
            loadUsers();
        }
        
        // Update dashboard stats
        loadDashboardData();
        
    } catch (error) {
        console.error('Error creating user:', error);
        showError('Failed to create user');
    }
}

function handleAssignment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const assignmentData = Object.fromEntries(formData);
    
    try {
        if (currentAssignmentType === 'appointment') {
            // Find and update appointment
            const appointment = allAppointments.find(apt => apt.id === currentAssignmentId);
            if (appointment) {
                appointment.assignedTo = parseInt(assignmentData.assignTo);
                appointment.priority = assignmentData.priority;
                appointment.status = 'assigned';
                
                localStorage.setItem('hospital_appointments', JSON.stringify(allAppointments));
                
                logActivity(currentUser.id, 'Appointment Assigned', 'Appointments', appointment.id, {
                    patient: appointment.patientName,
                    assignedTo: allUsers.find(u => u.id === appointment.assignedTo)?.firstName + ' ' + allUsers.find(u => u.id === appointment.assignedTo)?.lastName,
                    priority: assignmentData.priority
                });
            }
        } else if (currentAssignmentType === 'contact') {
            // Find and update contact
            const contact = allContacts.find(c => c.id === currentAssignmentId);
            if (contact) {
                contact.assignedTo = parseInt(assignmentData.assignTo);
                contact.priority = assignmentData.priority;
                contact.status = 'assigned';
                
                localStorage.setItem('hospital_contacts', JSON.stringify(allContacts));
                
                logActivity(currentUser.id, 'Message Assigned', 'Contacts', contact.id, {
                    subject: contact.subject,
                    assignedTo: allUsers.find(u => u.id === contact.assignedTo)?.firstName + ' ' + allUsers.find(u => u.id === contact.assignedTo)?.lastName,
                    priority: assignmentData.priority
                });
            }
        }
        
        showSuccess('Assignment completed successfully!');
        closeAssignmentModal();
        e.target.reset();
        
        // Reload current section
        const activeSection = document.querySelector('.content-section.active').id.replace('-section', '');
        loadSectionData(activeSection);
        
        // Update dashboard stats
        loadDashboardData();
        
    } catch (error) {
        console.error('Error handling assignment:', error);
        showError('Failed to complete assignment');
    }
}

// Assignment functions
function assignAppointment(id) {
    currentAssignmentType = 'appointment';
    currentAssignmentId = id;
    
    const appointment = allAppointments.find(apt => apt.id === id);
    if (appointment) {
        openAssignmentModal('appointment', id, `Appointment: ${appointment.patientName}`);
    }
}

function assignContact(id) {
    currentAssignmentType = 'contact';
    currentAssignmentId = id;
    
    const contact = allContacts.find(c => c.id === id);
    if (contact) {
        openAssignmentModal('contact', id, `Message: ${contact.subject}`);
    }
}

// Modal functions
function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

function openAssignmentModal(type, id, title) {
    document.getElementById('assignmentModalTitle').textContent = `Assign ${type === 'appointment' ? 'Appointment' : 'Message'}: ${title}`;
    
    // Populate staff dropdown
    loadStaffOptions();
    
    document.getElementById('assignmentModal').style.display = 'block';
}

function closeAssignmentModal() {
    document.getElementById('assignmentModal').style.display = 'none';
    currentAssignmentType = null;
    currentAssignmentId = null;
}

// Load staff options for assignment
function loadStaffOptions() {
    const select = document.getElementById('assignToUser');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Employee</option>';
    
    const employees = allUsers.filter(user => user.role === 'employee' && user.status === 'active');
    
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.firstName} ${employee.lastName} (${employee.department})`;
        select.appendChild(option);
    });
}

// Filter functions
function filterUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const role = row.cells[2].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = !roleFilter || role.includes(roleFilter);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        
        row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
    });
}

function filterAppointments() {
    const statusFilter = document.getElementById('appointmentStatusFilter').value;
    const rows = document.querySelectorAll('#appointmentsTable tbody tr');
    
    rows.forEach(row => {
        const status = row.cells[4].textContent.toLowerCase();
        const matches = !statusFilter || status.includes(statusFilter);
        row.style.display = matches ? '' : 'none';
    });
}

function filterContacts() {
    const statusFilter = document.getElementById('contactStatusFilter').value;
    const rows = document.querySelectorAll('#contactsTable tbody tr');
    
    rows.forEach(row => {
        const status = row.cells[5].textContent.toLowerCase();
        const matches = !statusFilter || status.includes(statusFilter);
        row.style.display = matches ? '' : 'none';
    });
}

// Monitoring functions
function refreshMonitoring() {
    loadMonitoringData();
    showSuccess('Monitoring data refreshed');
}

function filterMonitoringData() {
    // Implementation for time-based filtering
    loadMonitoringData();
}

// Report functions
function generateReport() {
    // Simulate report generation
    showSuccess('Report generated successfully! Check your downloads folder.');
}

// Action functions
function viewAppointment(id) {
    const appointment = allAppointments.find(apt => apt.id === id);
    if (appointment) {
        alert(`Appointment Details:\n\nPatient: ${appointment.patientName}\nDepartment: ${appointment.department}\nDate: ${appointment.appointmentDate} ${appointment.appointmentTime}\nSymptoms: ${appointment.symptoms}\nStatus: ${appointment.status}`);
    }
}

function viewContact(id) {
    const contact = allContacts.find(c => c.id === id);
    if (contact) {
        alert(`Message Details:\n\nFrom: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}\nStatus: ${contact.status}`);
    }
}

function editUser(id) {
    showSuccess('Edit user functionality - Feature to be implemented');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to deactivate this user?')) {
        const user = allUsers.find(u => u.id === id);
        if (user) {
            user.status = 'inactive';
            localStorage.setItem('hospital_users', JSON.stringify(allUsers));
            
            logActivity(currentUser.id, 'User Deactivated', 'Users', user.id, {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            });
            
            showSuccess('User deactivated successfully');
            loadUsers();
            loadDashboardData();
        }
    }
}

function updateAppointmentStatus(id, currentStatus) {
    const appointment = allAppointments.find(apt => apt.id === id);
    if (appointment) {
        const newStatus = currentStatus === 'pending' ? 'confirmed' : 
                         currentStatus === 'confirmed' ? 'completed' : 'pending';
        
        appointment.status = newStatus;
        localStorage.setItem('hospital_appointments', JSON.stringify(allAppointments));
        
        logActivity(currentUser.id, 'Appointment Status Updated', 'Appointments', appointment.id, {
            patient: appointment.patientName,
            oldStatus: currentStatus,
            newStatus: newStatus
        });
        
        showSuccess(`Appointment status updated to ${newStatus}`);
        loadAppointments();
        loadDashboardData();
    }
}

// Utility functions
function formatDate(dateString) {
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleString();
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 3000;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function logout() {
    if (currentUser) {
        logActivity(currentUser.id, 'Admin Logout', 'Authentication', null, {
            role: currentUser.role,
            email: currentUser.email
        });
    }
    
    localStorage.removeItem('hospital_auth_token');
    localStorage.removeItem('hospital_current_user');
    window.location.href = 'index_standalone.html';
}

function logActivity(userId, action, module, recordId = null, details = {}) {
    try {
        const logs = JSON.parse(localStorage.getItem('hospital_activity_logs') || '[]');
        
        const logEntry = {
            id: logs.length + 1,
            userId: userId || null,
            userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'System',
            action: action,
            module: module,
            recordId: recordId,
            details: JSON.stringify(details),
            ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
            timestamp: new Date().toISOString()
        };
        
        logs.push(logEntry);
        localStorage.setItem('hospital_activity_logs', JSON.stringify(logs));
        
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}