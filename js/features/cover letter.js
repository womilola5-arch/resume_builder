// Cover Letter Generator
// Phase 3: Extended Features

class CoverLetterGenerator {
    constructor() {
        this.coverLetters = this.loadSaved();
    }

    // Load saved cover letters from localStorage
    loadSaved() {
        const saved = localStorage.getItem('coverLetters');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cover letters to localStorage
    save() {
        localStorage.setItem('coverLetters', JSON.stringify(this.coverLetters));
    }

    // Generate cover letter using AI
    async generate(resumeData, jobDescription, companyName, jobTitle) {
        if (!window.aiOptimizer.apiKey) {
            throw new Error('AI API key not configured');
        }

        const coverLetter = await window.aiOptimizer.generateCoverLetter(
            resumeData,
            jobDescription,
            companyName
        );

        // Save the generated cover letter
        const newLetter = {
            id: Date.now(),
            companyName,
            jobTitle,
            content: coverLetter,
            jobDescription,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.coverLetters.unshift(newLetter);
        this.save();

        return newLetter;
    }

    // Update existing cover letter
    update(id, content) {
        const letter = this.coverLetters.find(l => l.id === id);
        if (letter) {
            letter.content = content;
            letter.updatedAt = new Date().toISOString();
            this.save();
            return letter;
        }
        return null;
    }

    // Delete cover letter
    delete(id) {
        this.coverLetters = this.coverLetters.filter(l => l.id !== id);
        this.save();
    }

    // Get all cover letters
    getAll() {
        return this.coverLetters;
    }

    // Get single cover letter
    get(id) {
        return this.coverLetters.find(l => l.id === id);
    }

    // Export cover letter as PDF
    async exportPDF(id) {
        const letter = this.get(id);
        if (!letter) throw new Error('Cover letter not found');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Add content
        const lines = pdf.splitTextToSize(letter.content, 170);
        
        // Header
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(resumeData.personal.fullName, 20, 20);
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text(resumeData.personal.email, 20, 26);
        pdf.text(resumeData.personal.phone, 20, 32);
        
        // Date
        pdf.text(new Date(letter.createdAt).toLocaleDateString(), 20, 45);
        
        // Company info
        pdf.text(letter.companyName, 20, 55);
        if (letter.jobTitle) {
            pdf.text(`Re: ${letter.jobTitle}`, 20, 61);
        }
        
        // Body
        pdf.setFontSize(11);
        pdf.text(lines, 20, 75);

        pdf.save(`Cover_Letter_${letter.companyName.replace(/\s+/g, '_')}.pdf`);
    }

    // Export as DOCX
    exportDOCX(id) {
        const letter = this.get(id);
        if (!letter) throw new Error('Cover letter not found');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; margin: 1in; }
                    .header { margin-bottom: 20pt; }
                    .date { margin: 20pt 0; }
                    .company { margin-bottom: 20pt; }
                    p { margin-bottom: 12pt; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div style="font-weight: bold; font-size: 12pt;">${resumeData.personal.fullName}</div>
                    <div>${resumeData.personal.email}</div>
                    <div>${resumeData.personal.phone}</div>
                    ${resumeData.personal.location ? `<div>${resumeData.personal.location}</div>` : ''}
                </div>
                
                <div class="date">${new Date(letter.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                
                <div class="company">
                    <div style="font-weight: bold;">${letter.companyName}</div>
                    ${letter.jobTitle ? `<div>Re: ${letter.jobTitle}</div>` : ''}
                </div>
                
                <div>${letter.content.split('\n\n').map(para => `<p>${para}</p>`).join('')}</div>
                
                <div style="margin-top: 20pt;">
                    <p>Sincerely,<br><br>${resumeData.personal.fullName}</p>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Cover_Letter_${letter.companyName.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// UI Functions for Cover Letter

function showCoverLetterModal() {
    const modal = document.createElement('div');
    modal.id = 'coverLetterModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCoverLetterModal()">
            <div class="modal-content large-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-file-alt"></i> Cover Letter Generator</h2>
                    <button class="modal-close" onclick="closeCoverLetterModal()">×</button>
                </div>
                <div class="modal-body">
                    <div id="coverLetterContent">
                        <div class="cover-letter-tabs">
                            <button class="tab-btn active" onclick="showCoverLetterTab('generate')">Generate New</button>
                            <button class="tab-btn" onclick="showCoverLetterTab('saved')">Saved Letters (${window.coverLetterGen.getAll().length})</button>
                        </div>
                        
                        <div id="generateTab" class="tab-content active">
                            <div class="form-group">
                                <label>Company Name *</label>
                                <input type="text" id="clCompanyName" placeholder="Acme Corporation">
                            </div>
                            
                            <div class="form-group">
                                <label>Job Title *</label>
                                <input type="text" id="clJobTitle" placeholder="Senior Software Engineer">
                            </div>
                            
                            <div class="form-group">
                                <label>Job Description *</label>
                                <textarea id="clJobDescription" rows="6" placeholder="Paste the job description here..."></textarea>
                            </div>
                            
                            <button class="btn-primary" onclick="generateCoverLetter()" style="width: 100%;">
                                <i class="fas fa-magic"></i> Generate Cover Letter with AI
                            </button>
                            
                            <div id="generatedCoverLetter" style="margin-top: 20px;"></div>
                        </div>
                        
                        <div id="savedTab" class="tab-content">
                            <div id="savedCoverLetters"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    loadSavedCoverLetters();
}

function closeCoverLetterModal() {
    const modal = document.getElementById('coverLetterModal');
    if (modal) modal.remove();
}

function showCoverLetterTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
    
    if (tab === 'saved') {
        loadSavedCoverLetters();
    }
}

async function generateCoverLetter() {
    const companyName = document.getElementById('clCompanyName').value.trim();
    const jobTitle = document.getElementById('clJobTitle').value.trim();
    const jobDescription = document.getElementById('clJobDescription').value.trim();
    
    if (!companyName || !jobTitle || !jobDescription) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (!resumeData.personal.fullName) {
        alert('Please fill out your resume first.');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    const resultsDiv = document.getElementById('generatedCoverLetter');
    resultsDiv.innerHTML = `
        <div style="padding: 30px; text-align: center; color: #667eea;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2em;"></i>
            <p style="margin-top: 15px;">Generating your cover letter...</p>
        </div>
    `;
    
    try {
        const letter = await window.coverLetterGen.generate(
            resumeData,
            jobDescription,
            companyName,
            jobTitle
        );
        
        displayGeneratedCoverLetter(letter);
    } catch (error) {
        console.error('Cover Letter Generation Error:', error);
        resultsDiv.innerHTML = `
            <div style="padding: 20px; background: #fee; border-radius: 8px; color: #c00;">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

function displayGeneratedCoverLetter(letter) {
    const resultsDiv = document.getElementById('generatedCoverLetter');
    
    resultsDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 24px; border-radius: 8px;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #1e293b;">Generated Cover Letter</h3>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-outline" onclick="window.coverLetterGen.exportPDF(${letter.id})">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button class="btn-outline" onclick="window.coverLetterGen.exportDOCX(${letter.id})">
                        <i class="fas fa-file-word"></i> DOCX
                    </button>
                </div>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 4px; line-height: 1.8; font-family: Georgia, serif;">
                <div style="margin-bottom: 20px;">
                    <strong>${resumeData.personal.fullName}</strong><br>
                    ${resumeData.personal.email}<br>
                    ${resumeData.personal.phone}<br>
                    ${resumeData.personal.location || ''}
                </div>
                
                <div style="margin-bottom: 20px;">
                    ${new Date(letter.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>${letter.companyName}</strong><br>
                    Re: ${letter.jobTitle}
                </div>
                
                <textarea id="coverLetterContent${letter.id}" 
                          style="width: 100%; min-height: 400px; border: 1px solid #e2e8f0; padding: 15px; border-radius: 4px; font-family: Georgia, serif; font-size: 14px; line-height: 1.8;"
                          onchange="window.coverLetterGen.update(${letter.id}, this.value)">${letter.content}</textarea>
                
                <div style="margin-top: 20px;">
                    Sincerely,<br><br>
                    ${resumeData.personal.fullName}
                </div>
            </div>
        </div>
    `;
}

function loadSavedCoverLetters() {
    const container = document.getElementById('savedCoverLetters');
    const letters = window.coverLetterGen.getAll();
    
    if (letters.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #64748b;">
                <i class="fas fa-inbox" style="font-size: 3em; opacity: 0.3; margin-bottom: 15px;"></i>
                <p>No saved cover letters yet.<br>Generate your first one!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = letters.map(letter => `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #1e293b;">${letter.companyName}</h4>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">${letter.jobTitle}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">
                        Created: ${new Date(letter.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-icon" onclick="viewCoverLetter(${letter.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="window.coverLetterGen.exportPDF(${letter.id})" title="Export PDF">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    <button class="btn-icon" onclick="window.coverLetterGen.exportDOCX(${letter.id})" title="Export DOCX">
                        <i class="fas fa-file-word"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteCoverLetter(${letter.id})" title="Delete" style="color: #ef4444;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p style="font-size: 13px; color: #475569; margin: 0; white-space: pre-line; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                ${letter.content}
            </p>
        </div>
    `).join('');
}

function viewCoverLetter(id) {
    const letter = window.coverLetterGen.get(id);
    if (!letter) return;
    
    displayGeneratedCoverLetter(letter);
    showCoverLetterTab('generate');
}

function deleteCoverLetter(id) {
    if (confirm('Are you sure you want to delete this cover letter?')) {
        window.coverLetterGen.delete(id);
        loadSavedCoverLetters();
    }
}

// Initialize
window.coverLetterGen = new CoverLetterGenerator();

// Add tab styles
const tabStyles = `
    <style>
        .large-modal .modal-content {
            max-width: 900px;
        }
        
        .cover-letter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .tab-btn {
            padding: 12px 24px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 600;
            color: #64748b;
            transition: all 0.3s;
        }
        
        .tab-btn:hover {
            color: #1e293b;
        }
        
        .tab-btn.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', tabStyles);
