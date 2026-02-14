// Resume Versions Manager
// Phase 3: Extended Features - Manage multiple resume versions for different job types

class ResumeVersionManager {
    constructor() {
        this.versions = this.loadSaved();
    }

    loadSaved() {
        const saved = localStorage.getItem('resumeVersions');
        return saved ? JSON.parse(saved) : [];
    }

    save() {
        localStorage.setItem('resumeVersions', JSON.stringify(this.versions));
    }

    // Save current resume as a new version
    saveVersion(name, description = '') {
        const version = {
            id: Date.now(),
            name: name,
            description: description,
            data: JSON.parse(JSON.stringify(resumeData)), // Deep clone
            template: currentTemplate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.versions.unshift(version);
        this.save();
        return version;
    }

    // Update existing version
    updateVersion(id, updates) {
        const version = this.versions.find(v => v.id === id);
        if (version) {
            Object.assign(version, updates);
            version.updatedAt = new Date().toISOString();
            this.save();
            return version;
        }
        return null;
    }

    // Delete version
    deleteVersion(id) {
        this.versions = this.versions.filter(v => v.id !== id);
        this.save();
    }

    // Get all versions
    getAllVersions() {
        return this.versions;
    }

    // Get single version
    getVersion(id) {
        return this.versions.find(v => v.id === id);
    }

    // Load a version into the editor
    loadVersion(id) {
        const version = this.getVersion(id);
        if (version) {
            // Update global resume data
            resumeData = JSON.parse(JSON.stringify(version.data));
            currentTemplate = version.template;
            
            // Update the form
            populateForm();
            
            // Update template selector
            document.getElementById('templateSelector').value = version.template;
            
            // Update preview
            updatePreview();
            updateProgress();
            
            return true;
        }
        return false;
    }

    // Duplicate a version
    duplicate(id) {
        const version = this.getVersion(id);
        if (version) {
            const newVersion = {
                ...version,
                id: Date.now(),
                name: version.name + ' (Copy)',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.versions.unshift(newVersion);
            this.save();
            return newVersion;
        }
        return null;
    }

    // Compare two versions
    compareVersions(id1, id2) {
        const v1 = this.getVersion(id1);
        const v2 = this.getVersion(id2);
        
        if (!v1 || !v2) return null;
        
        return {
            version1: v1,
            version2: v2,
            differences: this.findDifferences(v1.data, v2.data)
        };
    }

    // Find differences between two resume data objects
    findDifferences(data1, data2) {
        const diffs = [];
        
        // Compare personal info
        Object.keys(data1.personal).forEach(key => {
            if (data1.personal[key] !== data2.personal[key]) {
                diffs.push({
                    section: 'personal',
                    field: key,
                    value1: data1.personal[key],
                    value2: data2.personal[key]
                });
            }
        });
        
        // Compare summary
        if (data1.summary !== data2.summary) {
            diffs.push({
                section: 'summary',
                field: 'content',
                value1: data1.summary,
                value2: data2.summary
            });
        }
        
        // Compare skills
        const skills1 = new Set(data1.skills);
        const skills2 = new Set(data2.skills);
        const addedSkills = [...skills2].filter(s => !skills1.has(s));
        const removedSkills = [...skills1].filter(s => !skills2.has(s));
        
        if (addedSkills.length > 0 || removedSkills.length > 0) {
            diffs.push({
                section: 'skills',
                added: addedSkills,
                removed: removedSkills
            });
        }
        
        return diffs;
    }
}

// UI Functions

function showResumeVersions() {
    const modal = document.createElement('div');
    modal.id = 'versionsModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeVersionsModal()">
            <div class="modal-content versions-modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-layer-group"></i> Resume Versions</h2>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="showSaveVersionForm()">
                            <i class="fas fa-save"></i> Save Current as Version
                        </button>
                        <button class="btn-close" onclick="closeVersionsModal()">×</button>
                    </div>
                </div>
                <div class="modal-body">
                    <div id="versionsContainer">
                        ${renderVersionsList()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeVersionsModal() {
    const modal = document.getElementById('versionsModal');
    if (modal) modal.remove();
}

function renderVersionsList() {
    const versions = window.versionManager.getAllVersions();
    
    if (versions.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-layer-group"></i>
                <p>No saved versions yet</p>
                <p class="subtext">Save your current resume to create your first version</p>
            </div>
        `;
    }
    
    return `
        <div class="versions-grid">
            ${versions.map(version => `
                <div class="version-card">
                    <div class="version-header">
                        <div>
                            <h3>${version.name}</h3>
                            <p class="version-date">
                                <i class="fas fa-clock"></i> 
                                ${new Date(version.createdAt).toLocaleDateString()}
                                ${version.updatedAt !== version.createdAt ? ` (Modified: ${new Date(version.updatedAt).toLocaleDateString()})` : ''}
                            </p>
                        </div>
                        <span class="version-template">${version.template}</span>
                    </div>
                    
                    ${version.description ? `
                        <p class="version-description">${version.description}</p>
                    ` : ''}
                    
                    <div class="version-preview">
                        <div class="preview-stats">
                            <span><i class="fas fa-briefcase"></i> ${version.data.experiences?.length || 0} Jobs</span>
                            <span><i class="fas fa-graduation-cap"></i> ${version.data.education?.length || 0} Education</span>
                            <span><i class="fas fa-code"></i> ${version.data.skills?.length || 0} Skills</span>
                        </div>
                    </div>
                    
                    <div class="version-actions">
                        <button class="btn-outline btn-sm" onclick="loadResumeVersion(${version.id})" title="Load this version">
                            <i class="fas fa-upload"></i> Load
                        </button>
                        <button class="btn-outline btn-sm" onclick="previewVersion(${version.id})" title="Preview">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn-outline btn-sm" onclick="duplicateVersion(${version.id})" title="Duplicate">
                            <i class="fas fa-copy"></i> Duplicate
                        </button>
                        <button class="btn-outline btn-sm" onclick="editVersionMetadata(${version.id})" title="Edit details">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-outline btn-sm" onclick="exportVersion(${version.id})" title="Export">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-outline btn-sm" onclick="deleteVersion(${version.id})" title="Delete" style="color: #ef4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showSaveVersionForm() {
    const modal = document.createElement('div');
    modal.id = 'saveVersionModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeSaveVersionModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-save"></i> Save Resume Version</h2>
                    <button class="modal-close" onclick="closeSaveVersionModal()">×</button>
                </div>
                <div class="modal-body">
                    <form id="saveVersionForm" onsubmit="saveResumeVersion(event)">
                        <div class="form-group">
                            <label>Version Name *</label>
                            <input type="text" name="name" required placeholder="e.g., Software Engineer - Tech Companies">
                        </div>
                        
                        <div class="form-group">
                            <label>Description (Optional)</label>
                            <textarea name="description" rows="3" placeholder="e.g., Optimized for FAANG applications with emphasis on system design..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <p style="font-size: 13px; color: #64748b; margin: 0;">
                                <strong>Current Stats:</strong><br>
                                • ${resumeData.experiences?.length || 0} work experiences<br>
                                • ${resumeData.education?.length || 0} education entries<br>
                                • ${resumeData.skills?.length || 0} skills<br>
                                • Template: ${currentTemplate}
                            </p>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            <i class="fas fa-save"></i> Save Version
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeSaveVersionModal() {
    const modal = document.getElementById('saveVersionModal');
    if (modal) modal.remove();
}

function saveResumeVersion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const description = formData.get('description');
    
    window.versionManager.saveVersion(name, description);
    closeSaveVersionModal();
    
    // Refresh versions list if modal is open
    if (document.getElementById('versionsModal')) {
        document.getElementById('versionsContainer').innerHTML = renderVersionsList();
    }
    
    alert(`✅ Version "${name}" saved successfully!`);
}

function loadResumeVersion(id) {
    if (confirm('Loading this version will replace your current resume. Continue?')) {
        if (window.versionManager.loadVersion(id)) {
            alert('✅ Version loaded successfully!');
            closeVersionsModal();
        } else {
            alert('❌ Error loading version.');
        }
    }
}

function previewVersion(id) {
    const version = window.versionManager.getVersion(id);
    if (!version) return;
    
    // Create preview modal
    const modal = document.createElement('div');
    modal.id = 'previewVersionModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePreviewVersionModal()">
            <div class="modal-content large-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-eye"></i> Preview: ${version.name}</h2>
                    <button class="modal-close" onclick="closePreviewVersionModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="preview-container" style="padding: 20px; background: #f8f9fa;">
                        <div class="resume-preview" style="background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; max-width: 850px;">
                            ${generateVersionPreview(version)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closePreviewVersionModal() {
    const modal = document.getElementById('previewVersionModal');
    if (modal) modal.remove();
}

function generateVersionPreview(version) {
    // Temporarily set the version data
    const originalData = resumeData;
    const originalTemplate = currentTemplate;
    
    resumeData = version.data;
    currentTemplate = version.template;
    
    const preview = getTemplateHTML(version.template);
    
    // Restore original data
    resumeData = originalData;
    currentTemplate = originalTemplate;
    
    return preview;
}

function duplicateVersion(id) {
    const duplicated = window.versionManager.duplicate(id);
    if (duplicated) {
        if (document.getElementById('versionsModal')) {
            document.getElementById('versionsContainer').innerHTML = renderVersionsList();
        }
        alert(`✅ Version duplicated as "${duplicated.name}"`);
    }
}

function editVersionMetadata(id) {
    const version = window.versionManager.getVersion(id);
    if (!version) return;
    
    const modal = document.createElement('div');
    modal.id = 'editVersionModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeEditVersionModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Version Details</h2>
                    <button class="modal-close" onclick="closeEditVersionModal()">×</button>
                </div>
                <div class="modal-body">
                    <form onsubmit="updateVersionMetadata(event, ${id})">
                        <div class="form-group">
                            <label>Version Name</label>
                            <input type="text" name="name" value="${version.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="3">${version.description || ''}</textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            <i class="fas fa-save"></i> Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeEditVersionModal() {
    const modal = document.getElementById('editVersionModal');
    if (modal) modal.remove();
}

function updateVersionMetadata(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    window.versionManager.updateVersion(id, {
        name: formData.get('name'),
        description: formData.get('description')
    });
    
    closeEditVersionModal();
    
    if (document.getElementById('versionsModal')) {
        document.getElementById('versionsContainer').innerHTML = renderVersionsList();
    }
    
    alert('✅ Version updated!');
}

function exportVersion(id) {
    const version = window.versionManager.getVersion(id);
    if (!version) return;
    
    // Temporarily set the version data for export
    const originalData = resumeData;
    const originalTemplate = currentTemplate;
    
    resumeData = version.data;
    currentTemplate = version.template;
    
    // Show export options
    const modal = document.createElement('div');
    modal.id = 'exportVersionModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeExportVersionModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 400px;">
                <div class="modal-header">
                    <h2><i class="fas fa-download"></i> Export Version</h2>
                    <button class="modal-close" onclick="closeExportVersionModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Export "${version.name}" as:</p>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                        <button class="btn-primary" onclick="exportVersionPDF(${id})">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                        <button class="btn-primary" onclick="exportVersionDOCX(${id})">
                            <i class="fas fa-file-word"></i> DOCX
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeExportVersionModal() {
    const modal = document.getElementById('exportVersionModal');
    if (modal) modal.remove();
}

async function exportVersionPDF(id) {
    const version = window.versionManager.getVersion(id);
    const originalData = resumeData;
    const originalTemplate = currentTemplate;
    
    resumeData = version.data;
    currentTemplate = version.template;
    
    await exportPDF();
    
    resumeData = originalData;
    currentTemplate = originalTemplate;
    
    closeExportVersionModal();
}

function exportVersionDOCX(id) {
    const version = window.versionManager.getVersion(id);
    const originalData = resumeData;
    const originalTemplate = currentTemplate;
    
    resumeData = version.data;
    currentTemplate = version.template;
    
    exportDOCX();
    
    resumeData = originalData;
    currentTemplate = originalTemplate;
    
    closeExportVersionModal();
}

function deleteVersion(id) {
    const version = window.versionManager.getVersion(id);
    if (!version) return;
    
    if (confirm(`Are you sure you want to delete "${version.name}"? This cannot be undone.`)) {
        window.versionManager.deleteVersion(id);
        
        if (document.getElementById('versionsModal')) {
            document.getElementById('versionsContainer').innerHTML = renderVersionsList();
        }
        
        alert('✅ Version deleted.');
    }
}

// Initialize
window.versionManager = new ResumeVersionManager();

// Add version manager styles
const versionStyles = `
    <style>
        .versions-modal-content {
            max-width: 1100px;
        }
        
        .versions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .version-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s;
        }
        
        .version-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: #cbd5e1;
        }
        
        .version-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 12px;
        }
        
        .version-header h3 {
            margin: 0 0 5px 0;
            color: #1e293b;
            font-size: 16px;
        }
        
        .version-date {
            font-size: 12px;
            color: #94a3b8;
            margin: 0;
        }
        
        .version-template {
            background: #667eea;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
        }
        
        .version-description {
            font-size: 13px;
            color: #64748b;
            margin: 0 0 15px 0;
            line-height: 1.5;
        }
        
        .version-preview {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        
        .preview-stats {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: #64748b;
        }
        
        .preview-stats span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .version-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        
        .btn-sm {
            padding: 6px 12px;
            font-size: 12px;
        }
        
        @media (max-width: 768px) {
            .versions-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', versionStyles);
