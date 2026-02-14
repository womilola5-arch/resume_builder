// Global state
let resumeData = {
    personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: []
};

let currentTemplate = 'professional';
let experienceCounter = 0;
let educationCounter = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSavedProgress();
    addExperience(); // Add first experience form
    addEducation(); // Add first education form
});

// Initialize all event listeners
function initializeEventListeners() {
    // Personal information listeners
    const personalFields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'website'];
    personalFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', function(e) {
                resumeData.personal[field] = e.target.value;
                updatePreview();
                updateProgress();
            });
        }
    });

    // Summary listener
    const summaryField = document.getElementById('summary');
    if (summaryField) {
        summaryField.addEventListener('input', function(e) {
            resumeData.summary = e.target.value;
            updatePreview();
            updateProgress();
        });
    }

    // Skills input listener
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim());
                this.value = '';
            }
        });
    }

    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
}

// Toggle section expand/collapse
function toggleSection(sectionName) {
    const section = document.querySelector(`[data-section="${sectionName}"]`);
    if (section) {
        section.classList.toggle('active');
    }
}

// Add Experience Entry
function addExperience() {
    experienceCounter++;
    const experienceList = document.getElementById('experienceList');
    
    const experienceHTML = `
        <div class="experience-item" data-id="${experienceCounter}">
            <button class="item-remove" onclick="removeExperience(${experienceCounter})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" id="exp-title-${experienceCounter}" 
                    placeholder="Software Engineer" 
                    onchange="updateExperience(${experienceCounter})">
            </div>
            <div class="form-group">
                <label>Company Name *</label>
                <input type="text" id="exp-company-${experienceCounter}" 
                    placeholder="Tech Corp" 
                    onchange="updateExperience(${experienceCounter})">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="exp-location-${experienceCounter}" 
                    placeholder="San Francisco, CA" 
                    onchange="updateExperience(${experienceCounter})">
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" id="exp-start-${experienceCounter}" 
                    onchange="updateExperience(${experienceCounter})">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" id="exp-end-${experienceCounter}" 
                    onchange="updateExperience(${experienceCounter})">
                <label style="margin-top: 0.5rem;">
                    <input type="checkbox" id="exp-current-${experienceCounter}" 
                        onchange="updateExperience(${experienceCounter})"> 
                    Currently working here
                </label>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="exp-description-${experienceCounter}" 
                    rows="4" 
                    placeholder="• Developed and maintained web applications
• Led a team of 5 developers
• Improved system performance by 40%"
                    onchange="updateExperience(${experienceCounter})"></textarea>
                <button class="btn-ai" onclick="optimizeDescription(${experienceCounter}, 'experience')">
                    <i class="fas fa-magic"></i> AI Optimize
                </button>
            </div>
        </div>
    `;
    
    experienceList.insertAdjacentHTML('beforeend', experienceHTML);
    
    // Initialize the experience in resumeData
    resumeData.experiences.push({
        id: experienceCounter,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });
}

// Update experience data
function updateExperience(id) {
    const experience = resumeData.experiences.find(exp => exp.id === id);
    if (experience) {
        experience.title = document.getElementById(`exp-title-${id}`).value;
        experience.company = document.getElementById(`exp-company-${id}`).value;
        experience.location = document.getElementById(`exp-location-${id}`).value;
        experience.startDate = document.getElementById(`exp-start-${id}`).value;
        experience.endDate = document.getElementById(`exp-end-${id}`).value;
        experience.current = document.getElementById(`exp-current-${id}`).checked;
        experience.description = document.getElementById(`exp-description-${id}`).value;
        
        updatePreview();
        updateProgress();
    }
}

// Remove experience
function removeExperience(id) {
    if (confirm('Are you sure you want to remove this experience?')) {
        document.querySelector(`.experience-item[data-id="${id}"]`).remove();
        resumeData.experiences = resumeData.experiences.filter(exp => exp.id !== id);
        updatePreview();
        updateProgress();
    }
}

// Add Education Entry
function addEducation() {
    educationCounter++;
    const educationList = document.getElementById('educationList');
    
    const educationHTML = `
        <div class="education-item" data-id="${educationCounter}">
            <button class="item-remove" onclick="removeEducation(${educationCounter})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" id="edu-degree-${educationCounter}" 
                    placeholder="Bachelor of Science in Computer Science" 
                    onchange="updateEducation(${educationCounter})">
            </div>
            <div class="form-group">
                <label>School/University *</label>
                <input type="text" id="edu-school-${educationCounter}" 
                    placeholder="Stanford University" 
                    onchange="updateEducation(${educationCounter})">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="edu-location-${educationCounter}" 
                    placeholder="Stanford, CA" 
                    onchange="updateEducation(${educationCounter})">
            </div>
            <div class="form-group">
                <label>Graduation Date</label>
                <input type="month" id="edu-date-${educationCounter}" 
                    onchange="updateEducation(${educationCounter})">
            </div>
            <div class="form-group">
                <label>GPA (Optional)</label>
                <input type="text" id="edu-gpa-${educationCounter}" 
                    placeholder="3.8/4.0" 
                    onchange="updateEducation(${educationCounter})">
            </div>
            <div class="form-group">
                <label>Additional Details</label>
                <textarea id="edu-details-${educationCounter}" 
                    rows="3" 
                    placeholder="Relevant coursework, honors, or achievements..."
                    onchange="updateEducation(${educationCounter})"></textarea>
            </div>
        </div>
    `;
    
    educationList.insertAdjacentHTML('beforeend', educationHTML);
    
    // Initialize the education in resumeData
    resumeData.education.push({
        id: educationCounter,
        degree: '',
        school: '',
        location: '',
        date: '',
        gpa: '',
        details: ''
    });
}

// Update education data
function updateEducation(id) {
    const education = resumeData.education.find(edu => edu.id === id);
    if (education) {
        education.degree = document.getElementById(`edu-degree-${id}`).value;
        education.school = document.getElementById(`edu-school-${id}`).value;
        education.location = document.getElementById(`edu-location-${id}`).value;
        education.date = document.getElementById(`edu-date-${id}`).value;
        education.gpa = document.getElementById(`edu-gpa-${id}`).value;
        education.details = document.getElementById(`edu-details-${id}`).value;
        
        updatePreview();
        updateProgress();
    }
}

// Remove education
function removeEducation(id) {
    if (confirm('Are you sure you want to remove this education entry?')) {
        document.querySelector(`.education-item[data-id="${id}"]`).remove();
        resumeData.education = resumeData.education.filter(edu => edu.id !== id);
        updatePreview();
        updateProgress();
    }
}

// Add skill tag
function addSkill(skill) {
    if (skill && !resumeData.skills.includes(skill)) {
        resumeData.skills.push(skill);
        renderSkills();
        updatePreview();
        updateProgress();
    }
}

// Remove skill
function removeSkill(skill) {
    resumeData.skills = resumeData.skills.filter(s => s !== skill);
    renderSkills();
    updatePreview();
    updateProgress();
}

// Render skills tags
function renderSkills() {
    const skillsTags = document.getElementById('skillsTags');
    skillsTags.innerHTML = resumeData.skills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <button onclick="removeSkill('${skill}')">×</button>
        </span>
    `).join('');
}

// Update progress bar
function updateProgress() {
    let totalFields = 0;
    let filledFields = 0;
    
    // Check personal info
    Object.values(resumeData.personal).forEach(value => {
        totalFields++;
        if (value) filledFields++;
    });
    
    // Check summary
    totalFields++;
    if (resumeData.summary) filledFields++;
    
    // Check experience
    if (resumeData.experiences.length > 0) {
        resumeData.experiences.forEach(exp => {
            totalFields += 4; // title, company, startDate, description
            if (exp.title) filledFields++;
            if (exp.company) filledFields++;
            if (exp.startDate) filledFields++;
            if (exp.description) filledFields++;
        });
    }
    
    // Check education
    if (resumeData.education.length > 0) {
        resumeData.education.forEach(edu => {
            totalFields += 3; // degree, school, date
            if (edu.degree) filledFields++;
            if (edu.school) filledFields++;
            if (edu.date) filledFields++;
        });
    }
    
    // Check skills
    totalFields++;
    if (resumeData.skills.length > 0) filledFields++;
    
    const percentage = Math.round((filledFields / totalFields) * 100);
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = percentage;
}

// Update preview (will be enhanced with templates)
function updatePreview() {
    const previewContainer = document.getElementById('resumePreview');
    
    // Check if there's any data
    const hasData = resumeData.personal.fullName || 
                    resumeData.summary || 
                    resumeData.experiences.length > 0 || 
                    resumeData.education.length > 0 || 
                    resumeData.skills.length > 0;
    
    if (!hasData) {
        previewContainer.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Start filling out the form to see your resume preview</p>
            </div>
        `;
        return;
    }
    
    // Generate preview based on current template
    const template = getTemplateHTML(currentTemplate);
    previewContainer.innerHTML = template;
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    alert('Progress saved successfully!');
}

// Auto-save
function autoSave() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    console.log('Auto-saved at', new Date().toLocaleTimeString());
}

// Load saved progress
function loadSavedProgress() {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        const shouldLoad = confirm('We found a saved resume. Would you like to continue where you left off?');
        if (shouldLoad) {
            resumeData = JSON.parse(saved);
            populateForm();
        }
    }
}

// Populate form with saved data
function populateForm() {
    // Personal info
    Object.keys(resumeData.personal).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = resumeData.personal[key];
    });
    
    // Summary
    document.getElementById('summary').value = resumeData.summary;
    
    // Skills
    renderSkills();
    
    // Note: Experiences and education need to be recreated with their IDs
    // This is a simplified version - you'd want to restore these properly
    
    updatePreview();
    updateProgress();
}

// Scroll to builder
function scrollToBuilder() {
    document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}

// Show templates
function showTemplates() {
    alert('Template gallery coming soon! For now, you can select templates in the builder.');
}

// Change template
function changeTemplate() {
    currentTemplate = document.getElementById('templateSelector').value;
    updatePreview();
}

// Zoom controls
let zoomLevel = 1;
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 1.5);
    document.getElementById('resumePreview').style.transform = `scale(${zoomLevel})`;
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    document.getElementById('resumePreview').style.transform = `scale(${zoomLevel})`;
}

// AI Optimization (placeholder - will connect to API later)
function optimizeSummary() {
    alert('AI Optimization coming soon! This will use Claude API to enhance your summary.');
    // TODO: Implement Claude API integration
}

function optimizeDescription(id, type) {
    alert('AI Optimization coming soon! This will use Claude API to enhance your description.');
    // TODO: Implement Claude API integration
}

// Generate Resume (final step before export)
function generateResume() {
    if (!resumeData.personal.fullName || !resumeData.personal.email) {
        alert('Please fill in at least your name and email to generate a resume.');
        return;
    }
    
    updatePreview();
    alert('Resume generated! You can now export it as PDF or DOCX.');
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
}
