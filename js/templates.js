// Resume Template Generator

function getTemplateHTML(templateName) {
    switch(templateName) {
        case 'professional':
            return getProfessionalTemplate();
        case 'modern':
            return getModernTemplate();
        case 'creative':
            return getCreativeTemplate();
        case 'minimal':
            return getMinimalTemplate();
        default:
            return getProfessionalTemplate();
    }
}

// Professional Template
function getProfessionalTemplate() {
    return `
        <div style="padding: 40px; font-family: 'Georgia', serif; color: #333; line-height: 1.6;">
            ${generateHeader('professional')}
            ${generateSummary('professional')}
            ${generateExperience('professional')}
            ${generateEducation('professional')}
            ${generateSkills('professional')}
        </div>
    `;
}

// Modern Template
function getModernTemplate() {
    return `
        <div style="font-family: 'Arial', sans-serif; color: #2c3e50;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px;">
                ${generateHeader('modern')}
            </div>
            <div style="padding: 40px;">
                ${generateSummary('modern')}
                ${generateExperience('modern')}
                ${generateEducation('modern')}
                ${generateSkills('modern')}
            </div>
        </div>
    `;
}

// Creative Template
function getCreativeTemplate() {
    return `
        <div style="font-family: 'Verdana', sans-serif; color: #444;">
            <div style="display: grid; grid-template-columns: 250px 1fr;">
                <div style="background: #2c3e50; color: white; padding: 40px 30px;">
                    ${generateSidebar()}
                </div>
                <div style="padding: 40px;">
                    ${generateHeader('creative')}
                    ${generateSummary('creative')}
                    ${generateExperience('creative')}
                    ${generateEducation('creative')}
                </div>
            </div>
        </div>
    `;
}

// Minimal Template
function getMinimalTemplate() {
    return `
        <div style="padding: 60px; font-family: 'Helvetica', sans-serif; color: #000; max-width: 750px; margin: 0 auto;">
            ${generateHeader('minimal')}
            ${generateSummary('minimal')}
            ${generateExperience('minimal')}
            ${generateEducation('minimal')}
            ${generateSkills('minimal')}
        </div>
    `;
}

// Header Generator
function generateHeader(style) {
    const { fullName, email, phone, location, linkedin, website } = resumeData.personal;
    
    if (!fullName) return '';
    
    if (style === 'modern') {
        return `
            <div style="text-align: center;">
                <h1 style="font-size: 42px; margin: 0 0 10px 0; font-weight: 700; letter-spacing: 1px;">
                    ${fullName}
                </h1>
                <div style="font-size: 14px; opacity: 0.95;">
                    ${email ? `<span>${email}</span>` : ''}
                    ${phone ? `<span style="margin: 0 15px;">•</span><span>${phone}</span>` : ''}
                    ${location ? `<span style="margin: 0 15px;">•</span><span>${location}</span>` : ''}
                </div>
                ${linkedin || website ? `
                    <div style="margin-top: 8px; font-size: 13px;">
                        ${linkedin ? `<a href="${linkedin}" style="color: white; margin-right: 15px; text-decoration: underline;">LinkedIn</a>` : ''}
                        ${website ? `<a href="${website}" style="color: white; text-decoration: underline;">Website</a>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (style === 'creative') {
        return `
            <div style="margin-bottom: 30px;">
                <h1 style="font-size: 36px; margin: 0 0 5px 0; color: #2c3e50; font-weight: 700;">
                    ${fullName}
                </h1>
                <div style="height: 3px; width: 60px; background: #667eea; margin: 10px 0;"></div>
            </div>
        `;
    }
    
    if (style === 'minimal') {
        return `
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
                <h1 style="font-size: 32px; margin: 0 0 10px 0; font-weight: 400; text-transform: uppercase; letter-spacing: 3px;">
                    ${fullName}
                </h1>
                <div style="font-size: 12px; color: #666;">
                    ${[email, phone, location].filter(Boolean).join(' | ')}
                </div>
            </div>
        `;
    }
    
    // Professional (default)
    return `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
            <h1 style="font-size: 36px; margin: 0 0 10px 0; color: #1e293b; font-weight: 700;">
                ${fullName}
            </h1>
            <div style="font-size: 13px; color: #64748b;">
                ${email ? `${email}` : ''}
                ${phone ? ` • ${phone}` : ''}
                ${location ? ` • ${location}` : ''}
            </div>
            ${linkedin || website ? `
                <div style="margin-top: 8px; font-size: 12px;">
                    ${linkedin ? `<a href="${linkedin}" style="color: #2563eb; margin-right: 15px;">LinkedIn</a>` : ''}
                    ${website ? `<a href="${website}" style="color: #2563eb;">Portfolio</a>` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

// Sidebar Generator (for creative template)
function generateSidebar() {
    const { email, phone, location, linkedin, website } = resumeData.personal;
    
    let contactHTML = '';
    if (email || phone || location) {
        contactHTML = `
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 14px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid white; padding-bottom: 5px;">
                    Contact
                </h3>
                ${email ? `<div style="font-size: 11px; margin-bottom: 8px; word-break: break-word;">${email}</div>` : ''}
                ${phone ? `<div style="font-size: 11px; margin-bottom: 8px;">${phone}</div>` : ''}
                ${location ? `<div style="font-size: 11px; margin-bottom: 8px;">${location}</div>` : ''}
            </div>
        `;
    }
    
    let skillsHTML = '';
    if (resumeData.skills.length > 0) {
        skillsHTML = `
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 14px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid white; padding-bottom: 5px;">
                    Skills
                </h3>
                ${resumeData.skills.map(skill => `
                    <div style="font-size: 11px; margin-bottom: 8px;">• ${skill}</div>
                `).join('')}
            </div>
        `;
    }
    
    return contactHTML + skillsHTML;
}

// Summary Generator
function generateSummary(style) {
    if (!resumeData.summary) return '';
    
    if (style === 'modern' || style === 'creative') {
        return `
            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #667eea; margin-bottom: 12px; font-weight: 600;">
                    Professional Summary
                </h2>
                <p style="font-size: 13px; line-height: 1.7; color: #555; text-align: justify;">
                    ${resumeData.summary}
                </p>
            </div>
        `;
    }
    
    if (style === 'minimal') {
        return `
            <div style="margin-bottom: 35px;">
                <p style="font-size: 12px; line-height: 1.8; color: #333; font-style: italic;">
                    ${resumeData.summary}
                </p>
            </div>
        `;
    }
    
    // Professional
    return `
        <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 12px; font-weight: 600; border-left: 4px solid #2563eb; padding-left: 12px;">
                Professional Summary
            </h2>
            <p style="font-size: 13px; line-height: 1.7; color: #475569;">
                ${resumeData.summary}
            </p>
        </div>
    `;
}

// Experience Generator
function generateExperience(style) {
    if (resumeData.experiences.length === 0) return '';
    
    const experiences = resumeData.experiences.filter(exp => exp.title && exp.company);
    if (experiences.length === 0) return '';
    
    const sectionTitle = style === 'modern' || style === 'creative' ? 
        `<h2 style="font-size: 20px; color: #667eea; margin-bottom: 20px; font-weight: 600;">Work Experience</h2>` :
        style === 'minimal' ?
        `<h2 style="font-size: 14px; margin-bottom: 20px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 8px;">Experience</h2>` :
        `<h2 style="font-size: 18px; color: #1e293b; margin-bottom: 20px; font-weight: 600; border-left: 4px solid #2563eb; padding-left: 12px;">Work Experience</h2>`;
    
    const experiencesHTML = experiences.map(exp => {
        const dateRange = exp.startDate ? 
            `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}` : '';
        
        if (style === 'minimal') {
            return `
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <div>
                            <strong style="font-size: 13px;">${exp.title}</strong>
                            <span style="font-size: 12px;"> • ${exp.company}</span>
                        </div>
                        ${dateRange ? `<div style="font-size: 11px; color: #666;">${dateRange}</div>` : ''}
                    </div>
                    ${exp.location ? `<div style="font-size: 11px; color: #666; margin-bottom: 8px;">${exp.location}</div>` : ''}
                    ${exp.description ? `<div style="font-size: 11px; line-height: 1.6; color: #444; white-space: pre-line;">${exp.description}</div>` : ''}
                </div>
            `;
        }
        
        return `
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                    <h3 style="font-size: 15px; margin: 0; font-weight: 600; color: #1e293b;">
                        ${exp.title}
                    </h3>
                    ${dateRange ? `<span style="font-size: 12px; color: #64748b;">${dateRange}</span>` : ''}
                </div>
                <div style="font-size: 13px; color: #2563eb; margin-bottom: 3px;">
                    ${exp.company}${exp.location ? ` • ${exp.location}` : ''}
                </div>
                ${exp.description ? `
                    <div style="font-size: 12px; line-height: 1.7; color: #475569; margin-top: 8px; white-space: pre-line;">
                        ${exp.description}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    return `
        <div style="margin-bottom: 30px;">
            ${sectionTitle}
            ${experiencesHTML}
        </div>
    `;
}

// Education Generator
function generateEducation(style) {
    if (resumeData.education.length === 0) return '';
    
    const education = resumeData.education.filter(edu => edu.degree && edu.school);
    if (education.length === 0) return '';
    
    const sectionTitle = style === 'modern' || style === 'creative' ? 
        `<h2 style="font-size: 20px; color: #667eea; margin-bottom: 20px; font-weight: 600;">Education</h2>` :
        style === 'minimal' ?
        `<h2 style="font-size: 14px; margin-bottom: 20px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 8px;">Education</h2>` :
        `<h2 style="font-size: 18px; color: #1e293b; margin-bottom: 20px; font-weight: 600; border-left: 4px solid #2563eb; padding-left: 12px;">Education</h2>`;
    
    const educationHTML = education.map(edu => {
        if (style === 'minimal') {
            return `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <div>
                            <strong style="font-size: 13px;">${edu.degree}</strong>
                        </div>
                        ${edu.date ? `<div style="font-size: 11px; color: #666;">${formatDate(edu.date)}</div>` : ''}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        ${edu.school}${edu.location ? ` • ${edu.location}` : ''}
                    </div>
                    ${edu.gpa ? `<div style="font-size: 11px; margin-top: 4px;">GPA: ${edu.gpa}</div>` : ''}
                    ${edu.details ? `<div style="font-size: 11px; margin-top: 6px; line-height: 1.6; color: #444;">${edu.details}</div>` : ''}
                </div>
            `;
        }
        
        return `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                    <h3 style="font-size: 15px; margin: 0; font-weight: 600; color: #1e293b;">
                        ${edu.degree}
                    </h3>
                    ${edu.date ? `<span style="font-size: 12px; color: #64748b;">${formatDate(edu.date)}</span>` : ''}
                </div>
                <div style="font-size: 13px; color: #2563eb; margin-bottom: 3px;">
                    ${edu.school}${edu.location ? ` • ${edu.location}` : ''}
                </div>
                ${edu.gpa ? `<div style="font-size: 12px; color: #475569; margin-top: 4px;">GPA: ${edu.gpa}</div>` : ''}
                ${edu.details ? `<div style="font-size: 12px; line-height: 1.7; color: #475569; margin-top: 8px;">${edu.details}</div>` : ''}
            </div>
        `;
    }).join('');
    
    return `
        <div style="margin-bottom: 30px;">
            ${sectionTitle}
            ${educationHTML}
        </div>
    `;
}

// Skills Generator
function generateSkills(style) {
    if (resumeData.skills.length === 0 || style === 'creative') return '';
    
    if (style === 'minimal') {
        return `
            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 14px; margin-bottom: 15px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 8px;">
                    Skills
                </h2>
                <div style="font-size: 11px; line-height: 2;">
                    ${resumeData.skills.join(' • ')}
                </div>
            </div>
        `;
    }
    
    if (style === 'modern') {
        return `
            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #667eea; margin-bottom: 15px; font-weight: 600;">
                    Skills
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${resumeData.skills.map(skill => `
                        <span style="background: #667eea; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 500;">
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Professional
    return `
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; font-weight: 600; border-left: 4px solid #2563eb; padding-left: 12px;">
                Skills
            </h2>
            <div style="font-size: 12px; line-height: 2; color: #475569;">
                ${resumeData.skills.join(' • ')}
            </div>
        </div>
    `;
}
