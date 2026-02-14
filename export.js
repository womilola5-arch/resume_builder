// Export functionality for PDF and DOCX

// Export as PDF
async function exportPDF() {
    const resumeElement = document.getElementById('resumePreview');
    
    if (!resumeData.personal.fullName) {
        alert('Please add at least your name before exporting.');
        return;
    }
    
    try {
        // Show loading state
        const originalHTML = resumeElement.innerHTML;
        resumeElement.innerHTML = '<div style="padding: 100px; text-align: center;">Generating PDF...</div>';
        
        // Use html2canvas to capture the resume
        const canvas = await html2canvas(resumeElement.parentElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        // Restore original content
        resumeElement.innerHTML = originalHTML;
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        const fileName = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        pdf.save(fileName);
        
        alert('PDF downloaded successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Export as DOCX (simplified version using plain text)
function exportDOCX() {
    if (!resumeData.personal.fullName) {
        alert('Please add at least your name before exporting.');
        return;
    }
    
    try {
        // Generate text content
        let content = generateTextContent();
        
        // Create a simple HTML structure that Word can interpret
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
                    h1 { font-size: 18pt; margin-bottom: 10pt; }
                    h2 { font-size: 14pt; margin-top: 16pt; margin-bottom: 8pt; color: #2563eb; }
                    h3 { font-size: 12pt; margin-bottom: 4pt; }
                    p { margin-bottom: 8pt; }
                    .contact { font-size: 10pt; color: #666; margin-bottom: 16pt; }
                    .date { float: right; font-size: 10pt; color: #666; }
                    .company { color: #2563eb; font-size: 11pt; }
                    .skills { line-height: 2; }
                </style>
            </head>
            <body>
                ${generateDOCXContent()}
            </body>
            </html>
        `;
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('DOCX downloaded successfully! You can open it in Microsoft Word.');
    } catch (error) {
        console.error('Error generating DOCX:', error);
        alert('Error generating DOCX. Please try again.');
    }
}

// Generate DOCX content in HTML format
function generateDOCXContent() {
    let html = '';
    
    // Header
    html += `
        <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12pt; margin-bottom: 12pt;">
            <h1 style="margin: 0;">${resumeData.personal.fullName}</h1>
            <p class="contact">
                ${resumeData.personal.email || ''}
                ${resumeData.personal.phone ? ' • ' + resumeData.personal.phone : ''}
                ${resumeData.personal.location ? ' • ' + resumeData.personal.location : ''}
            </p>
            ${resumeData.personal.linkedin || resumeData.personal.website ? `
                <p class="contact">
                    ${resumeData.personal.linkedin ? resumeData.personal.linkedin : ''}
                    ${resumeData.personal.linkedin && resumeData.personal.website ? ' • ' : ''}
                    ${resumeData.personal.website ? resumeData.personal.website : ''}
                </p>
            ` : ''}
        </div>
    `;
    
    // Professional Summary
    if (resumeData.summary) {
        html += `
            <h2>Professional Summary</h2>
            <p>${resumeData.summary}</p>
        `;
    }
    
    // Work Experience
    if (resumeData.experiences.length > 0) {
        const experiences = resumeData.experiences.filter(exp => exp.title && exp.company);
        if (experiences.length > 0) {
            html += '<h2>Work Experience</h2>';
            experiences.forEach(exp => {
                const dateRange = exp.startDate ? 
                    `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}` : '';
                
                html += `
                    <div style="margin-bottom: 16pt;">
                        <h3 style="margin: 0;">
                            ${exp.title}
                            ${dateRange ? `<span class="date">${dateRange}</span>` : ''}
                        </h3>
                        <p class="company" style="margin: 4pt 0;">
                            ${exp.company}${exp.location ? ' • ' + exp.location : ''}
                        </p>
                        ${exp.description ? `<p style="white-space: pre-line;">${exp.description}</p>` : ''}
                    </div>
                `;
            });
        }
    }
    
    // Education
    if (resumeData.education.length > 0) {
        const education = resumeData.education.filter(edu => edu.degree && edu.school);
        if (education.length > 0) {
            html += '<h2>Education</h2>';
            education.forEach(edu => {
                html += `
                    <div style="margin-bottom: 16pt;">
                        <h3 style="margin: 0;">
                            ${edu.degree}
                            ${edu.date ? `<span class="date">${formatDate(edu.date)}</span>` : ''}
                        </h3>
                        <p class="company" style="margin: 4pt 0;">
                            ${edu.school}${edu.location ? ' • ' + edu.location : ''}
                        </p>
                        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                        ${edu.details ? `<p>${edu.details}</p>` : ''}
                    </div>
                `;
            });
        }
    }
    
    // Skills
    if (resumeData.skills.length > 0) {
        html += `
            <h2>Skills</h2>
            <p class="skills">${resumeData.skills.join(' • ')}</p>
        `;
    }
    
    return html;
}

// Generate plain text content (fallback)
function generateTextContent() {
    let text = '';
    
    // Header
    text += `${resumeData.personal.fullName}\n`;
    text += `${resumeData.personal.email || ''} | ${resumeData.personal.phone || ''} | ${resumeData.personal.location || ''}\n`;
    if (resumeData.personal.linkedin) text += `${resumeData.personal.linkedin}\n`;
    if (resumeData.personal.website) text += `${resumeData.personal.website}\n`;
    text += '\n';
    
    // Summary
    if (resumeData.summary) {
        text += 'PROFESSIONAL SUMMARY\n';
        text += '-'.repeat(50) + '\n';
        text += resumeData.summary + '\n\n';
    }
    
    // Experience
    if (resumeData.experiences.length > 0) {
        const experiences = resumeData.experiences.filter(exp => exp.title && exp.company);
        if (experiences.length > 0) {
            text += 'WORK EXPERIENCE\n';
            text += '-'.repeat(50) + '\n';
            experiences.forEach(exp => {
                text += `${exp.title}\n`;
                text += `${exp.company}`;
                if (exp.location) text += ` - ${exp.location}`;
                text += '\n';
                if (exp.startDate) {
                    text += `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}\n`;
                }
                if (exp.description) text += `${exp.description}\n`;
                text += '\n';
            });
        }
    }
    
    // Education
    if (resumeData.education.length > 0) {
        const education = resumeData.education.filter(edu => edu.degree && edu.school);
        if (education.length > 0) {
            text += 'EDUCATION\n';
            text += '-'.repeat(50) + '\n';
            education.forEach(edu => {
                text += `${edu.degree}\n`;
                text += `${edu.school}`;
                if (edu.location) text += ` - ${edu.location}`;
                text += '\n';
                if (edu.date) text += `${formatDate(edu.date)}\n`;
                if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
                if (edu.details) text += `${edu.details}\n`;
                text += '\n';
            });
        }
    }
    
    // Skills
    if (resumeData.skills.length > 0) {
        text += 'SKILLS\n';
        text += '-'.repeat(50) + '\n';
        text += resumeData.skills.join(', ') + '\n';
    }
    
    return text;
}

// Share resume (generate shareable link)
function shareResume() {
    // Encode resume data
    const encodedData = btoa(JSON.stringify(resumeData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?resume=${encodedData}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard! Anyone with this link can view your resume.');
    }).catch(err => {
        console.error('Failed to copy:', err);
        prompt('Copy this link to share your resume:', shareUrl);
    });
}

// Load resume from URL parameter
function loadResumeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedResume = urlParams.get('resume');
    
    if (encodedResume) {
        try {
            const decodedData = JSON.parse(atob(encodedResume));
            resumeData = decodedData;
            populateForm();
            alert('Resume loaded from shared link!');
        } catch (error) {
            console.error('Error loading resume from URL:', error);
        }
    }
}

// Load on page load
document.addEventListener('DOMContentLoaded', function() {
    loadResumeFromURL();
});

// Print resume
function printResume() {
    window.print();
}

// Add print styles
const printStyles = `
    @media print {
        body * {
            visibility: hidden;
        }
        #resumePreview, #resumePreview * {
            visibility: visible;
        }
        #resumePreview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        .builder-sidebar,
        .preview-header,
        .preview-footer,
        .navbar,
        .footer {
            display: none !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);
