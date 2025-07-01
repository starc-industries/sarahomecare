// Employee Dashboard JavaScript - Standalone Version
let currentUser = null;
let allAppointments = [];
let allContacts = [];
let currentTask = null;
let currentWeekStart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
    initializeSchedule();
});

// Check authentication and employee role
function checkAuthentication() {
    const authToken = localStorage.getItem('hospital_auth_token');
    const userData = localStorage.getItem('hospital_current_user');
    
    if (!authToken || !userData) {
        window.location.href = 'index_standalone.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        
        if (currentUser.role !== 'employee') {
            alert('Access denied. Employee access required.');
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
    document.getElementById('currentUserRole').textContent = currentUser.department || 'Staff';
    
    // Update profile section
    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileDepartment').textContent = currentUser.department || 'Not assigned';
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileEmployeeId').textContent = currentUser.employeeId || 'N/A';
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
        'my-tasks': 'My Tasks',
        appointments: 'My Appointments',
        contacts: 'My Messages',
        schedule: 'My Schedule',
        profile: 'My Profile'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName];
    
    // Load section data
    loadSectionData(sectionName);
}

// Load dashboard data
function loadDashboardData() {
    try {
        // Load data from localStorage
        allAppointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
        allContacts = JSON.parse(localStorage.getItem('hospital_contacts') || '[]');
        
        // Filter data assigned to current employee
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        const myContacts = allContacts.filter(contact => contact.assignedTo === currentUser.id);
        
        // Calculate statistics
        const assignedAppointments = myAppointments.length;
        const pendingTasks = myAppointments.filter(apt => apt.status === 'pending' || apt.status === 'assigned').length +
                           myContacts.filter(contact => contact.status === 'assigned').length;
        const assignedMessages = myContacts.length;
        
        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = myAppointments.filter(apt => apt.appointmentDate === today).length;
        
        // Update statistics
        document.getElementById('assignedAppointments').textContent = assignedAppointments;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('assignedMessages').textContent = assignedMessages;
        document.getElementById('todayAppointments').textContent = todayAppointments;
        
        // Update notification count
        document.getElementById('notificationCount').textContent = pendingTasks;
        
        // Load dashboard components
        loadTodaySchedule();
        loadRecentActivities();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Load section-specific data
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'my-tasks':
            loadMyTasks();
            break;
        case 'appointments':
            loadMyAppointments();
            break;
        case 'contacts':
            loadMyMessages();
            break;
        case 'schedule':
            loadSchedule();
            break;
        case 'profile':
            loadProfileStats();
            break;
    }
}

// Load my tasks
function loadMyTasks() {
    try {
        // Get my assignments
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        const myContacts = allContacts.filter(contact => contact.assignedTo === currentUser.id);
        
        // Convert to task format
        const tasks = [
            ...myAppointments.map(apt => ({
                ...apt,
                type: 'appointment',
                title: `Appointment: ${apt.patientName}`,
                description: `${apt.department} - ${apt.appointmentDate} ${apt.appointmentTime}`
            })),
            ...myContacts.map(contact => ({
                ...contact,
                type: 'contact',
                title: `Message: ${contact.subject}`,
                description: `From: ${contact.name} (${contact.email})`
            }))
        ];
        
        // Group tasks by status
        const pendingTasks = tasks.filter(t => ['pending', 'assigned', 'unread'].includes(t.status));
        const inProgressTasks = tasks.filter(t => ['confirmed', 'in_progress'].includes(t.status));
        const completedTasks = tasks.filter(t => ['completed', 'resolved'].includes(t.status));
        
        populateTaskColumn('pendingTasksList', pendingTasks);
        populateTaskColumn('inProgressTasksList', inProgressTasks);
        populateTaskColumn('completedTasksList', completedTasks);
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks');
    }
}

// Populate task column
function populateTaskColumn(columnId, tasks) {
    const column = document.getElementById(columnId);
    if (!column) return;
    
    column.innerHTML = '';
    
    if (tasks.length === 0) {
        column.innerHTML = '<div class="empty-state">No tasks</div>';
        return;
    }
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        column.appendChild(taskCard);
    });
}

// Create task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.onclick = () => openTaskDetail(task);
    
    const priorityClass = task.priority ? `priority-${task.priority}` : 'priority-medium';
    
    card.innerHTML = `
        <div class="task-header">
            <h4 class="task-title">${task.title}</h4>
            <span class="status-badge ${priorityClass}">${task.priority || 'medium'}</span>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
            <span class="task-type"><i class="fas fa-${task.type === 'appointment' ? 'calendar' : 'envelope'}"></i> ${task.type}</span>
            <span class="task-date">${formatDate(task.createdAt)}</span>
        </div>
    `;
    
    return card;
}

// Load my appointments
function loadMyAppointments() {
    try {
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        const tbody = document.querySelector('#appointmentsTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        myAppointments.forEach(appointment => {
            const row = createAppointmentRow(appointment);
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading appointments:', error);
        showError('Failed to load appointments');
    }
}

// Create appointment table row
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div>
                <strong>${appointment.patientName}</strong><br>
                <small class="text-muted">${appointment.patientEmail}</small>
            </div>
        </td>
        <td>
            <div>
                ${formatDate(appointment.appointmentDate)}<br>
                <small>${appointment.appointmentTime}</small>
            </div>
        </td>
        <td>${appointment.department}</td>
        <td>${appointment.symptoms || '-'}</td>
        <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
        <td><span class="priority-${appointment.priority || 'medium'} status-badge">${appointment.priority || 'medium'}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewAppointmentDetail(${appointment.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="updateAppointmentStatus(${appointment.id}, 'completed')">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Load my messages
function loadMyMessages() {
    try {
        const myContacts = allContacts.filter(contact => contact.assignedTo === currentUser.id);
        const tbody = document.querySelector('#messagesTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        myContacts.forEach(contact => {
            const row = createMessageRow(contact);
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading messages:', error);
        showError('Failed to load messages');
    }
}

// Create message table row
function createMessageRow(contact) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div>
                <strong>${contact.name}</strong><br>
                <small class="text-muted">${contact.email}</small>
            </div>
        </td>
        <td>${contact.subject}</td>
        <td><span class="priority-${contact.priority || 'medium'} status-badge">${contact.priority || 'medium'}</span></td>
        <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
        <td>${formatDate(contact.createdAt)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewMessageDetail(${contact.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="resolveMessage(${contact.id})">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Load today's schedule
function loadTodaySchedule() {
    try {
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = myAppointments.filter(apt => apt.appointmentDate === today);
        
        const container = document.getElementById('todaySchedule');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (todayAppointments.length === 0) {
            container.innerHTML = '<div class="empty-state">No appointments scheduled for today</div>';
            return;
        }
        
        todayAppointments
            .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
            .forEach(appointment => {
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `
                    <div class="schedule-time">${appointment.appointmentTime}</div>
                    <div class="schedule-details">
                        <strong>${appointment.patientName}</strong><br>
                        <small>${appointment.department}</small>
                    </div>
                    <div class="schedule-status">
                        <span class="status-badge status-${appointment.status}">${appointment.status}</span>
                    </div>
                `;
                container.appendChild(item);
            });
        
    } catch (error) {
        console.error('Error loading today schedule:', error);
    }
}

// Load recent activities
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    // Simulate recent activities
    const activities = [
        { action: 'Updated appointment status', time: '2 hours ago', type: 'appointment' },
        { action: 'Responded to patient inquiry', time: '4 hours ago', type: 'message' },
        { action: 'Completed patient consultation', time: '1 day ago', type: 'appointment' },
        { action: 'Assigned new appointment', time: '2 days ago', type: 'appointment' }
    ];
    
    container.innerHTML = '';
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.type === 'appointment' ? 'calendar' : 'envelope'}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.action}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        `;
        container.appendChild(item);
    });
}

// Initialize schedule
function initializeSchedule() {
    currentWeekStart = getWeekStart(new Date());
    updateWeekDisplay();
}

// Load schedule calendar
function loadSchedule() {
    try {
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        generateCalendar(myAppointments);
    } catch (error) {
        console.error('Error loading schedule:', error);
        showError('Failed to load schedule');
    }
}

// Generate calendar grid
function generateCalendar(appointments) {
    const calendar = document.getElementById('scheduleCalendar');
    if (!calendar) return;
    
    calendar.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    calendar.appendChild(headerRow);
    
    // Create week row
    const weekRow = document.createElement('div');
    weekRow.className = 'calendar-week';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        
        const dateStr = date.toISOString().split('T')[0];
        const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);
        
        dayCell.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            <div class="day-appointments">
                ${dayAppointments.map(apt => `
                    <div class="appointment-item status-${apt.status}">
                        <span class="appointment-time">${apt.appointmentTime}</span>
                        <span class="appointment-patient">${apt.patientName}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        weekRow.appendChild(dayCell);
    }
    calendar.appendChild(weekRow);
}

// Load profile statistics
function loadProfileStats() {
    try {
        const myAppointments = allAppointments.filter(apt => apt.assignedTo === currentUser.id);
        const myContacts = allContacts.filter(contact => contact.assignedTo === currentUser.id);
        
        const totalHandled = myAppointments.filter(apt => apt.status === 'completed').length;
        const messagesResolved = myContacts.filter(msg => msg.status === 'resolved').length;
        
        document.getElementById('totalHandled').textContent = totalHandled;
        document.getElementById('messagesResolved').textContent = messagesResolved;
        document.getElementById('avgResponseTime').textContent = '2.3 hours';
        
    } catch (error) {
        console.error('Error loading profile stats:', error);
    }
}

// Utility functions for schedule
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function updateWeekDisplay() {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    const weekDisplay = `${formatter.format(currentWeekStart)} - ${formatter.format(weekEnd)}`;
    
    const weekDisplayElement = document.getElementById('currentWeek');
    if (weekDisplayElement) {
        weekDisplayElement.textContent = weekDisplay;
    }
}

function previousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekDisplay();
    loadSchedule();
}

function nextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekDisplay();
    loadSchedule();
}

// Task and appointment actions
function openTaskDetail(task) {
    currentTask = task;
    document.getElementById('taskDetailTitle').textContent = task.title;
    
    const content = document.getElementById('taskDetailContent');
    content.innerHTML = `
        <div class="task-detail">
            <p><strong>Type:</strong> ${task.type}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Priority:</strong> ${task.priority || 'medium'}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            ${task.symptoms ? `<p><strong>Symptoms:</strong> ${task.symptoms}</p>` : ''}
            ${task.message ? `<p><strong>Message:</strong> ${task.message}</p>` : ''}
            <p><strong>Created:</strong> ${formatDate(task.createdAt)}</p>
        </div>
    `;
    
    document.getElementById('taskDetailModal').style.display = 'block';
}

function closeTaskDetailModal() {
    document.getElementById('taskDetailModal').style.display = 'none';
    currentTask = null;
}

function markTaskCompleted() {
    if (!currentTask) return;
    
    try {
        if (currentTask.type === 'appointment') {
            const appointment = allAppointments.find(apt => apt.id === currentTask.id);
            if (appointment) {
                appointment.status = 'completed';
                localStorage.setItem('hospital_appointments', JSON.stringify(allAppointments));
            }
        } else if (currentTask.type === 'contact') {
            const contact = allContacts.find(c => c.id === currentTask.id);
            if (contact) {
                contact.status = 'resolved';
                localStorage.setItem('hospital_contacts', JSON.stringify(allContacts));
            }
        }
        
        logActivity(currentUser.id, 'Task Completed', 'Tasks', currentTask.id, {
            taskType: currentTask.type,
            taskTitle: currentTask.title
        });
        
        showSuccess('Task marked as completed');
        closeTaskDetailModal();
        loadMyTasks();
        loadDashboardData();
        
    } catch (error) {
        console.error('Error marking task completed:', error);
        showError('Failed to complete task');
    }
}

// Filter functions
function filterTasks() {
    loadMyTasks();
}

function filterAppointments() {
    const dateFilter = document.getElementById('appointmentDateFilter').value;
    const statusFilter = document.getElementById('appointmentStatusFilter').value;
    
    const rows = document.querySelectorAll('#appointmentsTable tbody tr');
    
    rows.forEach(row => {
        const dateCell = row.cells[1].textContent;
        const statusCell = row.cells[4].textContent.toLowerCase();
        
        const matchesDate = !dateFilter || dateCell.includes(dateFilter);
        const matchesStatus = !statusFilter || statusCell.includes(statusFilter);
        
        row.style.display = matchesDate && matchesStatus ? '' : 'none';
    });
}

function filterMessages() {
    const statusFilter = document.getElementById('messageStatusFilter').value;
    const rows = document.querySelectorAll('#messagesTable tbody tr');
    
    rows.forEach(row => {
        const statusCell = row.cells[3].textContent.toLowerCase();
        const matches = !statusFilter || statusCell.includes(statusFilter);
        row.style.display = matches ? '' : 'none';
    });
}

// Action functions
function updateAppointmentStatus(id, status) {
    try {
        const appointment = allAppointments.find(apt => apt.id === id);
        if (appointment) {
            appointment.status = status;
            localStorage.setItem('hospital_appointments', JSON.stringify(allAppointments));
            
            logActivity(currentUser.id, 'Appointment Status Updated', 'Appointments', id, {
                patient: appointment.patientName,
                newStatus: status
            });
            
            showSuccess('Appointment status updated');
            loadMyAppointments();
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        showError('Failed to update appointment');
    }
}

function resolveMessage(id) {
    try {
        const contact = allContacts.find(c => c.id === id);
        if (contact) {
            contact.status = 'resolved';
            localStorage.setItem('hospital_contacts', JSON.stringify(allContacts));
            
            logActivity(currentUser.id, 'Message Resolved', 'Contacts', id, {
                subject: contact.subject,
                sender: contact.name
            });
            
            showSuccess('Message marked as resolved');
            loadMyMessages();
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error resolving message:', error);
        showError('Failed to resolve message');
    }
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
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
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function logout() {
    if (currentUser) {
        logActivity(currentUser.id, 'Employee Logout', 'Authentication', null, {
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

// Placeholder functions
function viewAppointmentDetail(id) {
    const appointment = allAppointments.find(apt => apt.id === id);
    if (appointment) {
        alert(`Appointment Details:\n\nPatient: ${appointment.patientName}\nDepartment: ${appointment.department}\nDate: ${appointment.appointmentDate} ${appointment.appointmentTime}\nSymptoms: ${appointment.symptoms}\nStatus: ${appointment.status}`);
    }
}

function viewMessageDetail(id) {
    const contact = allContacts.find(c => c.id === id);
    if (contact) {
        alert(`Message Details:\n\nFrom: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}\nStatus: ${contact.status}`);
    }
}

function editProfile() {
    showSuccess('Edit profile functionality - Feature to be implemented');
}

function changePassword() {
    showSuccess('Change password functionality - Feature to be implemented');
}

function updateTaskStatus() {
    showSuccess('Update task status functionality - Feature to be implemented');
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