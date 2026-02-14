// Quick Menu - Access all tools and features
// Unified menu for all Phase 2 and Phase 3 features

function showQuickMenu() {
    const modal = document.createElement('div');
    modal.id = 'quickMenuModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeQuickMenu()">
            <div class="modal-content quick-menu-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-th"></i> Tools & Features</h2>
                    <button class="modal-close" onclick="closeQuickMenu()">×</button>
                </div>
                <div class="modal-body">
                    <div class="quick-menu-grid">
                        <!-- AI Features -->
                        <div class="menu-section">
                            <h3><i class="fas fa-brain"></i> AI Tools</h3>
                            <div class="menu-items">
                                <button class="menu-item" onclick="closeQuickMenu(); showJobTailoringModal();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                        <i class="fas fa-bullseye"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Job Tailoring</h4>
                                        <p>Optimize resume for specific job</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); showSkillsGapModal();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Skills Gap Analysis</h4>
                                        <p>Compare your skills vs job requirements</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); checkATSCompatibility();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                                        <i class="fas fa-robot"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>ATS Checker</h4>
                                        <p>Check resume compatibility</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); showAPIKeySettings();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                                        <i class="fas fa-key"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>AI Settings</h4>
                                        <p>Configure API key</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Document Management -->
                        <div class="menu-section">
                            <h3><i class="fas fa-file-alt"></i> Documents</h3>
                            <div class="menu-items">
                                <button class="menu-item" onclick="closeQuickMenu(); showResumeVersions();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                                        <i class="fas fa-layer-group"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Resume Versions</h4>
                                        <p>${window.versionManager?.getAllVersions().length || 0} saved versions</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); showCoverLetterModal();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Cover Letters</h4>
                                        <p>${window.coverLetterGen?.getAll().length || 0} saved letters</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); exportPDF();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);">
                                        <i class="fas fa-file-pdf"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Export PDF</h4>
                                        <p>Download as PDF</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); exportDOCX();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);">
                                        <i class="fas fa-file-word"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Export DOCX</h4>
                                        <p>Download as Word doc</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Job Search -->
                        <div class="menu-section">
                            <h3><i class="fas fa-briefcase"></i> Job Search</h3>
                            <div class="menu-items">
                                <button class="menu-item" onclick="closeQuickMenu(); showApplicationTracker();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);">
                                        <i class="fas fa-clipboard-list"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Application Tracker</h4>
                                        <p>${window.appTracker?.getAll().length || 0} applications tracked</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); showFollowUpReminders();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #fddb92 0%, #d1fdff 100%);">
                                        <i class="fas fa-bell"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Follow-Up Reminders</h4>
                                        <p>${window.appTracker?.getNeedingFollowUp().length || 0} pending</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Settings & Data -->
                        <div class="menu-section">
                            <h3><i class="fas fa-cog"></i> Settings</h3>
                            <div class="menu-items">
                                <button class="menu-item" onclick="closeQuickMenu(); saveProgress();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);">
                                        <i class="fas fa-save"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Save Progress</h4>
                                        <p>Save current resume</p>
                                    </div>
                                </button>
                                
                                <button class="menu-item" onclick="closeQuickMenu(); showDataManager();">
                                    <div class="menu-item-icon" style="background: linear-gradient(135deg, #f77062 0%, #fe5196 100%);">
                                        <i class="fas fa-database"></i>
                                    </div>
                                    <div class="menu-item-content">
                                        <h4>Manage Data</h4>
                                        <p>Import/Export/Clear data</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-menu-footer">
                        <p style="text-align: center; color: #64748b; font-size: 13px; margin: 0;">
                            <i class="fas fa-lightbulb"></i> Tip: All data is stored locally in your browser
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeQuickMenu() {
    const modal = document.getElementById('quickMenuModal');
    if (modal) modal.remove();
}

function showFollowUpReminders() {
    const needFollowUp = window.appTracker.getNeedingFollowUp();
    
    if (needFollowUp.length === 0) {
        alert('🎉 No follow-ups needed! You\'re all caught up.');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'followUpModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeFollowUpModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-bell"></i> Follow-Up Reminders</h2>
                    <button class="modal-close" onclick="closeFollowUpModal()">×</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 20px;">You have ${needFollowUp.length} application${needFollowUp.length > 1 ? 's' : ''} needing follow-up:</p>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${needFollowUp.map(app => `
                            <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                <h4 style="margin: 0 0 5px 0;">${app.company} - ${app.position}</h4>
                                <p style="margin: 0; font-size: 13px; color: #92400e;">
                                    <i class="fas fa-calendar"></i> Follow up by: ${new Date(app.followUpDate).toLocaleDateString()}
                                    ${isOverdue(app.followUpDate) ? '<span style="color: #dc2626; font-weight: bold;"> (OVERDUE)</span>' : ''}
                                </p>
                                <button class="btn-outline btn-sm" onclick="viewApplicationDetails(${app.id})" style="margin-top: 10px;">
                                    View Details
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeFollowUpModal() {
    const modal = document.getElementById('followUpModal');
    if (modal) modal.remove();
}

function showDataManager() {
    const modal = document.createElement('div');
    modal.id = 'dataManagerModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDataManager()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-database"></i> Data Manager</h2>
                    <button class="modal-close" onclick="closeDataManager()">×</button>
                </div>
                <div class="modal-body">
                    <div class="data-section">
                        <h3><i class="fas fa-download"></i> Export All Data</h3>
                        <p>Download all your resumes, cover letters, and applications as a backup.</p>
                        <button class="btn-primary" onclick="exportAllData()">
                            <i class="fas fa-download"></i> Export Everything (JSON)
                        </button>
                    </div>
                    
                    <div class="data-section">
                        <h3><i class="fas fa-upload"></i> Import Data</h3>
                        <p>Restore data from a previous backup.</p>
                        <input type="file" id="importDataFile" accept=".json" style="display: none;" onchange="importAllData(event)">
                        <button class="btn-primary" onclick="document.getElementById('importDataFile').click()">
                            <i class="fas fa-upload"></i> Import from Backup
                        </button>
                    </div>
                    
                    <div class="data-section" style="border: 2px solid #fee2e2; background: #fef2f2;">
                        <h3 style="color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> Clear All Data</h3>
                        <p>Permanently delete all stored data. This cannot be undone!</p>
                        <button class="btn-secondary" onclick="clearAllData()" style="background: #dc2626;">
                            <i class="fas fa-trash"></i> Clear Everything
                        </button>
                    </div>
                    
                    <div class="data-stats">
                        <h4>Storage Overview:</h4>
                        <ul style="font-size: 13px; line-height: 2;">
                            <li>Resume Versions: ${window.versionManager?.getAllVersions().length || 0}</li>
                            <li>Cover Letters: ${window.coverLetterGen?.getAll().length || 0}</li>
                            <li>Job Applications: ${window.appTracker?.getAll().length || 0}</li>
                            <li>Current Resume: ${resumeData.personal.fullName ? 'Saved' : 'Not saved'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeDataManager() {
    const modal = document.getElementById('dataManagerModal');
    if (modal) modal.remove();
}

function exportAllData() {
    const allData = {
        currentResume: resumeData,
        currentTemplate: currentTemplate,
        versions: window.versionManager?.getAllVersions() || [],
        coverLetters: window.coverLetterGen?.getAll() || [],
        applications: window.appTracker?.getAll() || [],
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-builder-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ All data exported successfully!');
}

function importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.exportDate) {
                throw new Error('Invalid backup file');
            }
            
            if (confirm('This will replace all current data. Continue?')) {
                // Restore data
                if (data.currentResume) {
                    resumeData = data.currentResume;
                    currentTemplate = data.currentTemplate || 'professional';
                    populateForm();
                    updatePreview();
                    updateProgress();
                }
                
                if (data.versions) {
                    localStorage.setItem('resumeVersions', JSON.stringify(data.versions));
                    window.versionManager = new ResumeVersionManager();
                }
                
                if (data.coverLetters) {
                    localStorage.setItem('coverLetters', JSON.stringify(data.coverLetters));
                    window.coverLetterGen = new CoverLetterGenerator();
                }
                
                if (data.applications) {
                    localStorage.setItem('applications', JSON.stringify(data.applications));
                    window.appTracker = new ApplicationTracker();
                }
                
                alert('✅ Data imported successfully!');
                closeDataManager();
            }
        } catch (error) {
            alert('❌ Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    const confirmation = prompt('This will permanently delete ALL your data!\n\nType "DELETE" to confirm:');
    
    if (confirmation === 'DELETE') {
        localStorage.clear();
        location.reload();
    } else {
        alert('Data clear cancelled.');
    }
}

// Add quick menu styles
const quickMenuStyles = `
    <style>
        .quick-menu-content {
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .quick-menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .menu-section h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .menu-items {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .menu-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
        }
        
        .menu-item:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        .menu-item-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .menu-item-content h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            color: #1e293b;
        }
        
        .menu-item-content p {
            margin: 0;
            font-size: 12px;
            color: #64748b;
        }
        
        .quick-menu-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        
        .data-section {
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .data-section h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .data-section p {
            margin: 0 0 15px 0;
            font-size: 13px;
            color: #64748b;
        }
        
        .data-stats {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .data-stats h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        
        .data-stats ul {
            margin: 0;
            padding-left: 20px;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', quickMenuStyles);
