// AI UI Components and Integration
// Connects AI optimizer with the resume builder interface

// Show loading state
function showAILoading(elementId, message = 'AI is thinking...') {
    const element = document.getElementById(elementId);
    const originalContent = element.innerHTML;
    
    element.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #667eea;">
            <i class="fas fa-spinner fa-spin"></i> ${message}
        </div>
    `;
    
    return originalContent;
}

// Hide loading state
function hideAILoading(elementId, originalContent) {
    document.getElementById(elementId).innerHTML = originalContent;
}

// Enhanced AI optimize summary function
async function optimizeSummary() {
    const summaryField = document.getElementById('summary');
    const currentSummary = summaryField.value;
    
    if (!currentSummary || currentSummary.trim().length < 20) {
        alert('Please write a brief summary first (at least a few sentences) so AI can enhance it.');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        const shouldSetup = confirm(
            'AI features require an Anthropic API key.\n\n' +
            'Get a FREE key at: https://console.anthropic.com/\n\n' +
            'Click OK to enter your API key now, or Cancel to skip.'
        );
        
        if (!shouldSetup) return;
        
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    try {
        summaryField.disabled = true;
        summaryField.style.opacity = '0.6';
        
        const optimizedSummary = await window.aiOptimizer.optimizeSummary(
            currentSummary,
            resumeData
        );
        
        summaryField.value = optimizedSummary;
        resumeData.summary = optimizedSummary;
        updatePreview();
        updateProgress();
        
        alert('✨ Summary optimized! Review the changes and edit as needed.');
    } catch (error) {
        console.error('AI Optimization Error:', error);
        alert('Error optimizing summary: ' + error.message + '\n\nPlease check your API key and try again.');
    } finally {
        summaryField.disabled = false;
        summaryField.style.opacity = '1';
    }
}

// Enhanced optimize description function
async function optimizeDescription(id, type) {
    const descField = document.getElementById(`exp-description-${id}`);
    const titleField = document.getElementById(`exp-title-${id}`);
    const companyField = document.getElementById(`exp-company-${id}`);
    
    const currentDesc = descField.value;
    const title = titleField.value;
    const company = companyField.value;
    
    if (!currentDesc || currentDesc.trim().length < 20) {
        alert('Please write a brief description first so AI can enhance it.');
        return;
    }
    
    if (!title || !company) {
        alert('Please fill in job title and company name first.');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    try {
        descField.disabled = true;
        descField.style.opacity = '0.6';
        
        const optimizedDesc = await window.aiOptimizer.optimizeJobDescription(
            currentDesc,
            title,
            company
        );
        
        descField.value = optimizedDesc;
        updateExperience(id);
        
        alert('✨ Description optimized! Review and adjust as needed.');
    } catch (error) {
        console.error('AI Optimization Error:', error);
        alert('Error optimizing description: ' + error.message);
    } finally {
        descField.disabled = false;
        descField.style.opacity = '1';
    }
}

// Job-specific tailoring modal
function showJobTailoringModal() {
    const modal = document.createElement('div');
    modal.id = 'jobTailoringModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeJobTailoringModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-bullseye"></i> Tailor Resume for Job</h2>
                    <button class="modal-close" onclick="closeJobTailoringModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Paste the job description below, and AI will analyze it to optimize your resume:</p>
                    <textarea id="jobDescriptionInput" 
                              placeholder="Paste the complete job description here..."
                              rows="10"
                              style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6;"></textarea>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-primary" onclick="analyzeJobDescription()" style="width: 100%;">
                            <i class="fas fa-magic"></i> Analyze & Get Recommendations
                        </button>
                    </div>
                    
                    <div id="tailoringResults" style="margin-top: 20px;"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeJobTailoringModal() {
    const modal = document.getElementById('jobTailoringModal');
    if (modal) modal.remove();
}

async function analyzeJobDescription() {
    const jobDesc = document.getElementById('jobDescriptionInput').value;
    const resultsDiv = document.getElementById('tailoringResults');
    
    if (!jobDesc || jobDesc.trim().length < 50) {
        alert('Please paste a complete job description (at least a paragraph).');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    try {
        resultsDiv.innerHTML = `
            <div style="padding: 30px; text-align: center; color: #667eea;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2em;"></i>
                <p style="margin-top: 15px;">Analyzing job description...</p>
            </div>
        `;
        
        const analysis = await window.aiOptimizer.tailorForJob(resumeData, jobDesc);
        
        displayTailoringResults(analysis);
    } catch (error) {
        console.error('Job Tailoring Error:', error);
        resultsDiv.innerHTML = `
            <div style="padding: 20px; background: #fee; border-radius: 8px; color: #c00;">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

function displayTailoringResults(analysis) {
    const resultsDiv = document.getElementById('tailoringResults');
    
    if (analysis.error) {
        resultsDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h4>Analysis Results:</h4>
                <pre style="white-space: pre-wrap; font-size: 13px;">${analysis.rawResponse}</pre>
            </div>
        `;
        return;
    }
    
    let html = '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">';
    html += '<h4 style="color: #667eea; margin-bottom: 15px;">📊 Tailoring Recommendations</h4>';
    
    // Keywords to add
    if (analysis.keywords?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h5 style="color: #1e293b; margin-bottom: 10px;">🔑 Important Keywords:</h5>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        analysis.keywords.forEach(keyword => {
            html += `<span style="background: #667eea; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px;">${keyword}</span>`;
        });
        html += '</div></div>';
    }
    
    // Skills to emphasize
    if (analysis.emphasizeSkills?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h5 style="color: #1e293b; margin-bottom: 10px;">⭐ Skills to Emphasize:</h5>';
        html += '<ul style="margin-left: 20px; font-size: 13px;">';
        analysis.emphasizeSkills.forEach(skill => {
            html += `<li>${skill}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Skills to add
    if (analysis.addSkills?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h5 style="color: #1e293b; margin-bottom: 10px;">➕ Consider Adding These Skills:</h5>';
        html += '<ul style="margin-left: 20px; font-size: 13px;">';
        analysis.addSkills.forEach(skill => {
            html += `<li>${skill} <button onclick="addSkill('${skill}')" style="margin-left: 10px; padding: 2px 8px; font-size: 11px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Add</button></li>`;
        });
        html += '</ul></div>';
    }
    
    // Summary tips
    if (analysis.summaryTips?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h5 style="color: #1e293b; margin-bottom: 10px;">📝 Summary Optimization Tips:</h5>';
        html += '<ul style="margin-left: 20px; font-size: 13px;">';
        analysis.summaryTips.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// Skills gap analysis modal
function showSkillsGapModal() {
    const modal = document.createElement('div');
    modal.id = 'skillsGapModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeSkillsGapModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-line"></i> Skills Gap Analysis</h2>
                    <button class="modal-close" onclick="closeSkillsGapModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Paste a job description to compare your skills against requirements:</p>
                    <textarea id="skillsGapJobDesc" 
                              placeholder="Paste job description here..."
                              rows="8"
                              style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6;"></textarea>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-primary" onclick="analyzeSkillsGap()" style="width: 100%;">
                            <i class="fas fa-search"></i> Analyze Skills Gap
                        </button>
                    </div>
                    
                    <div id="skillsGapResults" style="margin-top: 20px;"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeSkillsGapModal() {
    const modal = document.getElementById('skillsGapModal');
    if (modal) modal.remove();
}

async function analyzeSkillsGap() {
    const jobDesc = document.getElementById('skillsGapJobDesc').value;
    const resultsDiv = document.getElementById('skillsGapResults');
    
    if (!jobDesc || jobDesc.trim().length < 50) {
        alert('Please paste a job description.');
        return;
    }
    
    if (resumeData.skills.length === 0) {
        alert('Please add some skills to your resume first.');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    try {
        resultsDiv.innerHTML = `
            <div style="padding: 30px; text-align: center; color: #667eea;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2em;"></i>
                <p style="margin-top: 15px;">Analyzing your skills...</p>
            </div>
        `;
        
        const analysis = await window.aiOptimizer.analyzeSkillsGap(resumeData.skills, jobDesc);
        
        displaySkillsGapResults(analysis);
    } catch (error) {
        console.error('Skills Gap Error:', error);
        resultsDiv.innerHTML = `
            <div style="padding: 20px; background: #fee; border-radius: 8px; color: #c00;">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

function displaySkillsGapResults(analysis) {
    const resultsDiv = document.getElementById('skillsGapResults');
    
    if (analysis.error) {
        resultsDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <pre style="white-space: pre-wrap; font-size: 13px;">${analysis.rawResponse}</pre>
            </div>
        `;
        return;
    }
    
    let html = '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">';
    
    // Matching skills
    if (analysis.matchingSkills?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h4 style="color: #10b981; margin-bottom: 10px;">✅ Matching Skills:</h4>';
        html += '<div style="display: grid; gap: 8px;">';
        analysis.matchingSkills.forEach(item => {
            const relevance = item.relevance || 5;
            const barWidth = (relevance / 10) * 100;
            html += `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="flex: 0 0 150px; font-size: 13px; font-weight: 600;">${item.skill}</span>
                    <div style="flex: 1; background: #e2e8f0; border-radius: 10px; height: 20px; overflow: hidden;">
                        <div style="width: ${barWidth}%; background: #10b981; height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 5px;">
                            <span style="color: white; font-size: 11px; font-weight: 600;">${relevance}/10</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
    }
    
    // Missing skills
    if (analysis.missingSkills?.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<h4 style="color: #ef4444; margin-bottom: 10px;">❌ Missing Skills:</h4>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        analysis.missingSkills.forEach(item => {
            const priorityColor = item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#64748b';
            html += `
                <span style="background: ${priorityColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px;">
                    ${item.skill} <span style="opacity: 0.8;">(${item.priority})</span>
                </span>
            `;
        });
        html += '</div></div>';
    }
    
    // Recommendations
    if (analysis.recommendations?.length > 0) {
        html += '<div>';
        html += '<h4 style="color: #667eea; margin-bottom: 10px;">💡 Learning Recommendations:</h4>';
        html += '<ul style="margin-left: 20px; font-size: 13px;">';
        analysis.recommendations.forEach(rec => {
            html += `<li style="margin-bottom: 8px;">${rec}</li>`;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// ATS Compatibility Checker
async function checkATSCompatibility() {
    if (!resumeData.personal.fullName) {
        alert('Please fill out your resume first.');
        return;
    }
    
    if (!window.aiOptimizer.apiKey) {
        window.aiOptimizer.getAPIKey();
        if (!window.aiOptimizer.apiKey) return;
    }
    
    // Show loading modal
    const modal = document.createElement('div');
    modal.id = 'atsModal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-robot"></i> ATS Compatibility Check</h2>
                </div>
                <div class="modal-body">
                    <div id="atsResults" style="padding: 30px; text-align: center; color: #667eea;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2em;"></i>
                        <p style="margin-top: 15px;">Analyzing your resume...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeATSModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    try {
        const analysis = await window.aiOptimizer.checkATSCompatibility(resumeData);
        displayATSResults(analysis);
    } catch (error) {
        console.error('ATS Check Error:', error);
        document.getElementById('atsResults').innerHTML = `
            <div style="padding: 20px; background: #fee; border-radius: 8px; color: #c00;">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

function displayATSResults(analysis) {
    const resultsDiv = document.getElementById('atsResults');
    
    if (analysis.error) {
        resultsDiv.innerHTML = `<pre style="white-space: pre-wrap; font-size: 13px;">${analysis.rawResponse}</pre>`;
        return;
    }
    
    const score = analysis.overallScore || 0;
    const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    
    let html = '<div style="text-align: left;">';
    
    // Overall score
    html += `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 150px; height: 150px; margin: 0 auto; border-radius: 50%; border: 10px solid ${scoreColor}; display: flex; align-items: center; justify-content: center;">
                <div>
                    <div style="font-size: 48px; font-weight: 700; color: ${scoreColor};">${score}</div>
                    <div style="font-size: 14px; color: #64748b;">ATS Score</div>
                </div>
            </div>
        </div>
    `;
    
    // Category scores
    if (analysis.categoryScores) {
        html += '<h4 style="margin-bottom: 15px;">Category Breakdown:</h4>';
        html += '<div style="display: grid; gap: 12px; margin-bottom: 25px;">';
        
        Object.entries(analysis.categoryScores).forEach(([category, score]) => {
            const barWidth = score;
            const barColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
            html += `
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="text-transform: capitalize; font-size: 13px; font-weight: 600;">${category}</span>
                        <span style="font-size: 13px; color: #64748b;">${score}/100</span>
                    </div>
                    <div style="background: #e2e8f0; border-radius: 10px; height: 12px; overflow: hidden;">
                        <div style="width: ${barWidth}%; background: ${barColor}; height: 100%;"></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Issues
    if (analysis.issues?.length > 0) {
        html += '<h4 style="color: #ef4444; margin-bottom: 10px;">⚠️ Issues Found:</h4>';
        html += '<ul style="margin-left: 20px; margin-bottom: 25px; font-size: 13px;">';
        analysis.issues.forEach(issue => {
            html += `<li style="margin-bottom: 8px;">${issue}</li>`;
        });
        html += '</ul>';
    }
    
    // Recommendations
    if (analysis.recommendations?.length > 0) {
        html += '<h4 style="color: #667eea; margin-bottom: 10px;">💡 Recommendations:</h4>';
        html += '<ul style="margin-left: 20px; font-size: 13px;">';
        analysis.recommendations.forEach(rec => {
            html += `<li style="margin-bottom: 8px;">${rec}</li>`;
        });
        html += '</ul>';
    }
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

function closeATSModal() {
    const modal = document.getElementById('atsModal');
    if (modal) modal.remove();
}

// API key management modal
function showAPIKeySettings() {
    const currentKey = window.aiOptimizer.apiKey || '';
    const maskedKey = currentKey ? currentKey.substring(0, 8) + '...' + currentKey.substring(currentKey.length - 4) : 'Not set';
    
    const modal = document.createElement('div');
    modal.id = 'apiKeyModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAPIKeyModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-key"></i> AI Settings</h2>
                    <button class="modal-close" onclick="closeAPIKeyModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>To use AI features, you need an Anthropic API key.</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0; font-size: 13px;"><strong>Current Key:</strong> ${maskedKey}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">New API Key:</label>
                        <input type="password" id="newApiKey" placeholder="sk-ant-..." 
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    </div>
                    
                    <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0; font-size: 12px;">
                            <strong>ℹ️ How to get an API key:</strong><br>
                            1. Visit <a href="https://console.anthropic.com/" target="_blank" style="color: #2563eb;">console.anthropic.com</a><br>
                            2. Sign up for free<br>
                            3. Go to API Keys section<br>
                            4. Create a new key and paste it above
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button class="btn-primary" onclick="saveAPIKey()" style="flex: 1;">
                            <i class="fas fa-save"></i> Save Key
                        </button>
                        <button class="btn-secondary" onclick="clearAPIKey()" style="flex: 1;">
                            <i class="fas fa-trash"></i> Clear Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeAPIKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (modal) modal.remove();
}

function saveAPIKey() {
    const newKey = document.getElementById('newApiKey').value.trim();
    
    if (!newKey) {
        alert('Please enter an API key.');
        return;
    }
    
    if (!newKey.startsWith('sk-ant-')) {
        alert('Invalid API key format. Anthropic keys start with "sk-ant-"');
        return;
    }
    
    window.aiOptimizer.setAPIKey(newKey);
    alert('API key saved successfully!');
    closeAPIKeyModal();
}

function clearAPIKey() {
    if (confirm('Are you sure you want to remove your API key? AI features will be disabled.')) {
        window.aiOptimizer.clearAPIKey();
        alert('API key cleared.');
        closeAPIKeyModal();
    }
}

// Add modal styles
const modalStyles = `
    <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .modal-header {
            padding: 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 20px;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        
        .modal-close:hover {
            background: #f1f5f9;
            color: #1e293b;
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .modal-footer {
            padding: 24px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
    </style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', modalStyles);
