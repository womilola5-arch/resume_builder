// Application Tracker
// Phase 3: Extended Features

class ApplicationTracker {
    constructor() {
        this.applications = this.loadSaved();
        this.statuses = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected', 'Accepted', 'Withdrawn'];
        this.priorities = ['Low', 'Medium', 'High'];
    }

    loadSaved() {
        const saved = localStorage.getItem('applications');
        return saved ? JSON.parse(saved) : [];
    }

    save() {
        localStorage.setItem('applications', JSON.stringify(this.applications));
    }

    add(application) {
        const newApp = {
            id: Date.now(),
            company: application.company,
            position: application.position,
            location: application.location || '',
            jobUrl: application.jobUrl || '',
            status: application.status || 'Applied',
            priority: application.priority || 'Medium',
            salary: application.salary || '',
            appliedDate: application.appliedDate || new Date().toISOString(),
            followUpDate: application.followUpDate || null,
            notes: application.notes || '',
            contacts: application.contacts || [],
            interviews: application.interviews || [],
            resumeVersion: application.resumeVersion || null,
            coverLetterId: application.coverLetterId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.applications.unshift(newApp);
        this.save();
        return newApp;
    }

    update(id, updates) {
        const app = this.applications.find(a => a.id === id);
        if (app) {
            Object.assign(app, updates);
            app.updatedAt = new Date().toISOString();
            this.save();
            return app;
        }
        return null;
    }

    delete(id) {
        this.applications = this.applications.filter(a => a.id !== id);
        this.save();
    }

    getAll() {
        return this.applications;
    }

    get(id) {
        return this.applications.find(a => a.id === id);
    }

    // Filter applications
    filter(criteria) {
        return this.applications.filter(app => {
            if (criteria.status && app.status !== criteria.status) return false;
            if (criteria.priority && app.priority !== criteria.priority) return false;
            if (criteria.company && !app.company.toLowerCase().includes(criteria.company.toLowerCase())) return false;
            return true;
        });
    }

    // Get statistics
    getStats() {
        const total = this.applications.length;
        const byStatus = {};
        const byPriority = {};
        
        this.statuses.forEach(status => {
            byStatus[status] = this.applications.filter(a => a.status === status).length;
        });
        
        this.priorities.forEach(priority => {
            byPriority[priority] = this.applications.filter(a => a.priority === priority).length;
        });
        
        const thisMonth = this.applications.filter(a => {
            const appDate = new Date(a.appliedDate);
            const now = new Date();
            return appDate.getMonth() === now.getMonth() && 
                   appDate.getFullYear() === now.getFullYear();
        }).length;
        
        const responseRate = total > 0 ? 
            ((byStatus['Phone Screen'] + byStatus['Interview'] + byStatus['Offer']) / total * 100).toFixed(1) : 0;
        
        return {
            total,
            byStatus,
            byPriority,
            thisMonth,
            responseRate
        };
    }

    // Get applications needing follow-up
    getNeedingFollowUp() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.applications.filter(app => {
            if (!app.followUpDate) return false;
            const followUp = new Date(app.followUpDate);
            followUp.setHours(0, 0, 0, 0);
            return followUp <= today && app.status !== 'Rejected' && app.status !== 'Withdrawn';
        });
    }

    // Add interview to application
    addInterview(appId, interview) {
        const app = this.get(appId);
        if (app) {
            app.interviews.push({
                id: Date.now(),
                date: interview.date,
                time: interview.time,
                type: interview.type, // Phone, Video, In-person
                interviewer: interview.interviewer || '',
                notes: interview.notes || '',
                createdAt: new Date().toISOString()
            });
            this.save();
        }
    }

    // Add contact to application
    addContact(appId, contact) {
        const app = this.get(appId);
        if (app) {
            app.contacts.push({
                id: Date.now(),
                name: contact.name,
                title: contact.title || '',
                email: contact.email || '',
                phone: contact.phone || '',
                notes: contact.notes || ''
            });
            this.save();
        }
    }

    // Export to CSV
    exportCSV() {
        const headers = ['Company', 'Position', 'Location', 'Status', 'Priority', 'Applied Date', 'Salary', 'Job URL', 'Notes'];
        const rows = this.applications.map(app => [
            app.company,
            app.position,
            app.location,
            app.status,
            app.priority,
            new Date(app.appliedDate).toLocaleDateString(),
            app.salary,
            app.jobUrl,
            app.notes.replace(/\n/g, ' ')
        ]);
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `job_applications_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// UI Functions

function showApplicationTracker() {
    const modal = document.createElement('div');
    modal.id = 'trackerModal';
    modal.className = 'tracker-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeTrackerModal()">
            <div class="modal-content tracker-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-clipboard-list"></i> Application Tracker</h2>
                    <div class="header-actions">
                        <button class="btn-outline" onclick="window.appTracker.exportCSV()">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                        <button class="btn-close" onclick="closeTrackerModal()">×</button>
                    </div>
                </div>
                
                <div class="tracker-stats">
                    ${renderTrackerStats()}
                </div>
                
                <div class="tracker-toolbar">
                    <div class="tracker-filters">
                        <select id="statusFilter" onchange="filterApplications()">
                            <option value="">All Statuses</option>
                            ${window.appTracker.statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                        
                        <select id="priorityFilter" onchange="filterApplications()">
                            <option value="">All Priorities</option>
                            ${window.appTracker.priorities.map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                        
                        <input type="text" id="searchFilter" placeholder="Search company..." onkeyup="filterApplications()">
                    </div>
                    
                    <button class="btn-primary" onclick="showAddApplicationForm()">
                        <i class="fas fa-plus"></i> Add Application
                    </button>
                </div>
                
                <div id="applicationsContainer" class="applications-container">
                    ${renderApplications(window.appTracker.getAll())}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeTrackerModal() {
    const modal = document.getElementById('trackerModal');
    if (modal) modal.remove();
}

function renderTrackerStats() {
    const stats = window.appTracker.getStats();
    
    return `
        <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Applications</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.thisMonth}</div>
            <div class="stat-label">This Month</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.responseRate}%</div>
            <div class="stat-label">Response Rate</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.byStatus['Interview'] || 0}</div>
            <div class="stat-label">Interviews</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.byStatus['Offer'] || 0}</div>
            <div class="stat-label">Offers</div>
        </div>
    `;
}

function renderApplications(applications) {
    if (applications.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No applications yet</p>
                <p class="subtext">Start tracking your job applications!</p>
            </div>
        `;
    }
    
    return applications.map(app => {
        const priorityColor = app.priority === 'High' ? '#ef4444' : app.priority === 'Medium' ? '#f59e0b' : '#64748b';
        const statusColor = getStatusColor(app.status);
        
        return `
            <div class="application-card">
                <div class="app-header">
                    <div>
                        <h3>${app.company}</h3>
                        <p class="app-position">${app.position}</p>
                        ${app.location ? `<p class="app-location"><i class="fas fa-map-marker-alt"></i> ${app.location}</p>` : ''}
                    </div>
                    <div class="app-badges">
                        <span class="badge" style="background: ${priorityColor};">${app.priority}</span>
                        <span class="badge" style="background: ${statusColor};">${app.status}</span>
                    </div>
                </div>
                
                <div class="app-details">
                    <div class="app-meta">
                        <span><i class="fas fa-calendar"></i> Applied: ${new Date(app.appliedDate).toLocaleDateString()}</span>
                        ${app.salary ? `<span><i class="fas fa-dollar-sign"></i> ${app.salary}</span>` : ''}
                        ${app.interviews.length > 0 ? `<span><i class="fas fa-video"></i> ${app.interviews.length} Interview${app.interviews.length > 1 ? 's' : ''}</span>` : ''}
                    </div>
                    
                    ${app.followUpDate ? `
                        <div class="app-followup ${isOverdue(app.followUpDate) ? 'overdue' : ''}">
                            <i class="fas fa-bell"></i> Follow up: ${new Date(app.followUpDate).toLocaleDateString()}
                            ${isOverdue(app.followUpDate) ? '<span class="overdue-badge">Overdue</span>' : ''}
                        </div>
                    ` : ''}
                    
                    ${app.notes ? `<div class="app-notes">${app.notes}</div>` : ''}
                </div>
                
                <div class="app-actions">
                    ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" class="btn-icon" title="View Job"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    <button class="btn-icon" onclick="editApplication(${app.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="viewApplicationDetails(${app.id})" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" onclick="deleteApplication(${app.id})" title="Delete" style="color: #ef4444;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusColor(status) {
    const colors = {
        'Applied': '#64748b',
        'Phone Screen': '#3b82f6',
        'Interview': '#8b5cf6',
        'Offer': '#10b981',
        'Rejected': '#ef4444',
        'Accepted': '#059669',
        'Withdrawn': '#94a3b8'
    };
    return colors[status] || '#64748b';
}

function isOverdue(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
}

function filterApplications() {
    const status = document.getElementById('statusFilter').value;
    const priority = document.getElementById('priorityFilter').value;
    const search = document.getElementById('searchFilter').value;
    
    let filtered = window.appTracker.getAll();
    
    if (status) {
        filtered = filtered.filter(app => app.status === status);
    }
    
    if (priority) {
        filtered = filtered.filter(app => app.priority === priority);
    }
    
    if (search) {
        filtered = filtered.filter(app => 
            app.company.toLowerCase().includes(search.toLowerCase()) ||
            app.position.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    document.getElementById('applicationsContainer').innerHTML = renderApplications(filtered);
}

function showAddApplicationForm() {
    const modal = document.createElement('div');
    modal.id = 'addAppModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAddAppModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Add Application</h2>
                    <button class="modal-close" onclick="closeAddAppModal()">×</button>
                </div>
                <div class="modal-body">
                    <form id="addAppForm" onsubmit="saveApplication(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Company Name *</label>
                                <input type="text" name="company" required>
                            </div>
                            <div class="form-group">
                                <label>Position *</label>
                                <input type="text" name="position" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Location</label>
                                <input type="text" name="location">
                            </div>
                            <div class="form-group">
                                <label>Salary Range</label>
                                <input type="text" name="salary" placeholder="$80k - $100k">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Job URL</label>
                            <input type="url" name="jobUrl" placeholder="https://...">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Status</label>
                                <select name="status">
                                    ${window.appTracker.statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select name="priority">
                                    ${window.appTracker.priorities.map(p => `<option value="${p}" ${p === 'Medium' ? 'selected' : ''}>${p}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Applied Date</label>
                                <input type="date" name="appliedDate" value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Follow Up Date</label>
                                <input type="date" name="followUpDate">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea name="notes" rows="4"></textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            <i class="fas fa-save"></i> Save Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeAddAppModal() {
    const modal = document.getElementById('addAppModal');
    if (modal) modal.remove();
}

function saveApplication(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    window.appTracker.add(data);
    closeAddAppModal();
    
    // Refresh tracker if open
    if (document.getElementById('trackerModal')) {
        const container = document.getElementById('applicationsContainer');
        container.innerHTML = renderApplications(window.appTracker.getAll());
        document.querySelector('.tracker-stats').innerHTML = renderTrackerStats();
    }
}

function editApplication(id) {
    // Similar to add but pre-filled
    // Implementation similar to showAddApplicationForm
    alert('Edit functionality - to be implemented in full version');
}

function viewApplicationDetails(id) {
    const app = window.appTracker.get(id);
    if (!app) return;
    
    alert(`Full details view for ${app.company} - ${app.position}\n\nThis would show:\n- Full history\n- Interview schedule\n- Contacts\n- Documents\n- Timeline`);
}

function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        window.appTracker.delete(id);
        
        if (document.getElementById('trackerModal')) {
            const container = document.getElementById('applicationsContainer');
            container.innerHTML = renderApplications(window.appTracker.getAll());
            document.querySelector('.tracker-stats').innerHTML = renderTrackerStats();
        }
    }
}

// Initialize
window.appTracker = new ApplicationTracker();

// Add tracker styles
const trackerStyles = `
    <style>
        .tracker-modal .modal-content {
            max-width: 1200px;
            max-height: 90vh;
        }
        
        .tracker-content {
            display: flex;
            flex-direction: column;
        }
        
        .header-actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .btn-close {
            background: none;
            border: none;
            font-size: 28px;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
        }
        
        .tracker-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            padding: 20px 24px;
            background: #f8f9fa;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .stat-card {
            text-align: center;
        }
        
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
        }
        
        .stat-label {
            font-size: 12px;
            color: #64748b;
            margin-top: 5px;
        }
        
        .tracker-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .tracker-filters {
            display: flex;
            gap: 10px;
            flex: 1;
        }
        
        .tracker-filters select,
        .tracker-filters input {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .tracker-filters input {
            flex: 1;
            max-width: 300px;
        }
        
        .applications-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
        }
        
        .application-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            transition: box-shadow 0.3s;
        }
        
        .application-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
        }
        
        .app-header h3 {
            margin: 0 0 5px 0;
            color: #1e293b;
            font-size: 18px;
        }
        
        .app-position {
            color: #2563eb;
            font-weight: 600;
            margin: 0 0 5px 0;
        }
        
        .app-location {
            color: #64748b;
            font-size: 13px;
            margin: 0;
        }
        
        .app-badges {
            display: flex;
            gap: 8px;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            color: white;
            font-size: 11px;
            font-weight: 600;
        }
        
        .app-details {
            margin-bottom: 15px;
        }
        
        .app-meta {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 13px;
            color: #64748b;
            margin-bottom: 10px;
        }
        
        .app-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .app-followup {
            padding: 10px;
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            border-radius: 4px;
            font-size: 13px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .app-followup.overdue {
            background: #fee2e2;
            border-left-color: #ef4444;
        }
        
        .overdue-badge {
            margin-left: auto;
            padding: 2px 8px;
            background: #ef4444;
            color: white;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .app-notes {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 13px;
            color: #475569;
        }
        
        .app-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #94a3b8;
        }
        
        .empty-state i {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.3;
        }
        
        .empty-state p {
            margin: 10px 0;
        }
        
        .empty-state .subtext {
            font-size: 14px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', trackerStyles);
