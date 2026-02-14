// AI Optimization Module - Claude API Integration
// Phase 2: AI Enhancement

class AIOptimizer {
    constructor() {
        // For demo/development, we'll use client-side calls
        // In production, you should proxy through your backend for security
        this.apiKey = this.getAPIKey();
        this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-sonnet-4-20250514';
    }

    // Get API key (from environment or user input)
    getAPIKey() {
        // Check localStorage first
        let key = localStorage.getItem('claude_api_key');
        
        if (!key) {
            // Prompt user for API key on first use
            const userKey = prompt(
                'To use AI features, please enter your Anthropic API key.\n\n' +
                'Get one free at: https://console.anthropic.com/\n\n' +
                'Your key will be stored locally and never sent to our servers.'
            );
            
            if (userKey) {
                localStorage.setItem('claude_api_key', userKey);
                key = userKey;
            }
        }
        
        return key;
    }

    // Set API key manually
    setAPIKey(key) {
        localStorage.setItem('claude_api_key', key);
        this.apiKey = key;
    }

    // Clear API key
    clearAPIKey() {
        localStorage.removeItem('claude_api_key');
        this.apiKey = null;
    }

    // Make API call to Claude
    async callClaude(prompt, maxTokens = 1024) {
        if (!this.apiKey) {
            throw new Error('API key not set. Please configure your Anthropic API key.');
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: maxTokens,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API Error:', error);
            throw error;
        }
    }

    // Optimize professional summary
    async optimizeSummary(currentSummary, resumeData = {}) {
        const prompt = `You are an expert resume writer and career coach. Please optimize this professional summary to make it more compelling, achievement-focused, and ATS-friendly.

Current Summary:
${currentSummary}

Context:
${resumeData.experiences?.length > 0 ? `Recent Experience: ${resumeData.experiences[0]?.title} at ${resumeData.experiences[0]?.company}` : ''}
${resumeData.skills?.length > 0 ? `Key Skills: ${resumeData.skills.slice(0, 5).join(', ')}` : ''}

Requirements:
- Keep it 3-4 sentences
- Lead with years of experience or key achievement
- Include 2-3 specific accomplishments with metrics if possible
- Use strong action words
- Make it ATS-friendly with relevant keywords
- Avoid clichés like "team player" or "hard worker"

Return ONLY the optimized summary, no explanations or additional text.`;

        return await this.callClaude(prompt);
    }

    // Optimize job description
    async optimizeJobDescription(description, jobTitle, company) {
        const prompt = `You are an expert resume writer. Please optimize this job description to be more impactful and achievement-focused.

Job Title: ${jobTitle}
Company: ${company}

Current Description:
${description}

Requirements:
- Use bullet points (start each line with •)
- Begin each bullet with a strong action verb
- Include specific metrics and results where possible (if not present, suggest adding "[metric]" as a placeholder)
- Focus on achievements, not just responsibilities
- Make it ATS-friendly
- Keep it concise (4-6 bullets maximum)
- Use past tense for completed work, present tense for current roles

Return ONLY the optimized bullet points, no explanations.`;

        return await this.callClaude(prompt);
    }

    // Tailor resume for specific job
    async tailorForJob(resumeData, jobDescription) {
        const prompt = `You are an expert resume optimization specialist. Analyze this job description and provide specific recommendations to tailor the resume.

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME DATA:
Summary: ${resumeData.summary || 'Not provided'}
Skills: ${resumeData.skills?.join(', ') || 'Not provided'}
Recent Experience: ${resumeData.experiences?.[0]?.title || 'Not provided'} at ${resumeData.experiences?.[0]?.company || 'Not provided'}

Please provide:
1. Keywords to add (list 5-10 important keywords from the job description)
2. Skills to emphasize (from existing skills list)
3. Skills to add (3-5 new skills to consider adding)
4. Experience points to emphasize (which bullets are most relevant)
5. Summary optimization suggestions

Format your response as JSON:
{
  "keywords": ["keyword1", "keyword2", ...],
  "emphasizeSkills": ["skill1", "skill2", ...],
  "addSkills": ["skill1", "skill2", ...],
  "experienceFocus": ["point1", "point2", ...],
  "summaryTips": ["tip1", "tip2", ...]
}`;

        const response = await this.callClaude(prompt, 2048);
        
        try {
            // Try to parse as JSON
            return JSON.parse(response);
        } catch (e) {
            // If not valid JSON, return as structured object
            return {
                rawResponse: response,
                error: 'Could not parse as JSON'
            };
        }
    }

    // Skills gap analysis
    async analyzeSkillsGap(currentSkills, jobDescription) {
        const prompt = `You are a career development expert. Compare the candidate's current skills against this job description and identify gaps.

JOB DESCRIPTION:
${jobDescription}

CURRENT SKILLS:
${currentSkills.join(', ')}

Provide a skills gap analysis with:
1. Skills they have that match (list with relevance score 1-10)
2. Skills they're missing (list with priority: High/Medium/Low)
3. Related skills they could highlight instead
4. Learning recommendations

Format as JSON:
{
  "matchingSkills": [{"skill": "name", "relevance": 9}],
  "missingSkills": [{"skill": "name", "priority": "High"}],
  "relatedSkills": [{"have": "skill1", "highlight": "skill2"}],
  "recommendations": ["recommendation1", ...]
}`;

        const response = await this.callClaude(prompt, 1536);
        
        try {
            return JSON.parse(response);
        } catch (e) {
            return { rawResponse: response, error: 'Could not parse as JSON' };
        }
    }

    // Suggest action verbs
    async suggestActionVerbs(currentText) {
        const prompt = `You are a resume writing expert. Replace weak or passive verbs in this text with stronger, more impactful action verbs.

Current Text:
${currentText}

Requirements:
- Replace weak verbs like "was responsible for", "helped", "worked on", "did"
- Use powerful action verbs like "spearheaded", "optimized", "architected", "drove"
- Maintain the same meaning
- Keep the same structure

Return ONLY the improved text with stronger verbs, no explanations.`;

        return await this.callClaude(prompt);
    }

    // Quantify achievements
    async quantifyAchievements(description) {
        const prompt = `You are a resume optimization expert. This job description lacks specific metrics and quantifiable achievements. Suggest where and how to add metrics.

Current Description:
${description}

For each bullet point or statement:
1. Identify what could be quantified
2. Suggest the type of metric (e.g., percentage increase, number of users, time saved, money saved)
3. Provide a rewritten version with [METRIC] placeholders where the person should add their actual numbers

Example:
"Led marketing campaigns" → "Led [X] marketing campaigns, increasing engagement by [Y%] and generating [Z] leads"

Return the enhanced description with [METRIC] placeholders where numbers should be added.`;

        return await this.callClaude(prompt);
    }

    // ATS compatibility check
    async checkATSCompatibility(resumeData) {
        const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume data for ATS compatibility and provide a score with recommendations.

RESUME DATA:
Name: ${resumeData.personal?.fullName || 'Not provided'}
Contact: ${resumeData.personal?.email || 'Not provided'}
Summary: ${resumeData.summary || 'Not provided'}
Experience Count: ${resumeData.experiences?.length || 0}
Education Count: ${resumeData.education?.length || 0}
Skills Count: ${resumeData.skills?.length || 0}

Skills: ${resumeData.skills?.join(', ') || 'None'}

Analyze for:
1. Keyword optimization (are important keywords present?)
2. Formatting issues (are there any ATS-unfriendly elements?)
3. Contact information completeness
4. Skills section strength
5. Experience description quality

Provide:
- Overall ATS Score (0-100)
- Breakdown by category
- Specific issues found
- Actionable recommendations

Format as JSON:
{
  "overallScore": 85,
  "categoryScores": {
    "keywords": 80,
    "formatting": 90,
    "contact": 100,
    "skills": 70,
    "experience": 85
  },
  "issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"]
}`;

        const response = await this.callClaude(prompt, 2048);
        
        try {
            return JSON.parse(response);
        } catch (e) {
            return { rawResponse: response, error: 'Could not parse as JSON' };
        }
    }

    // Generate cover letter
    async generateCoverLetter(resumeData, jobDescription, companyName) {
        const prompt = `You are an expert cover letter writer. Generate a compelling cover letter based on this resume and job description.

JOB DESCRIPTION:
${jobDescription}

COMPANY:
${companyName}

CANDIDATE INFO:
Name: ${resumeData.personal?.fullName}
Summary: ${resumeData.summary}
Recent Experience: ${resumeData.experiences?.[0]?.title} at ${resumeData.experiences?.[0]?.company}
Key Skills: ${resumeData.skills?.slice(0, 5).join(', ')}

Create a professional cover letter that:
1. Opens with a strong hook related to the company/role
2. Highlights 2-3 relevant achievements
3. Shows enthusiasm for the role
4. Closes with a call to action
5. Is 3-4 paragraphs, around 250-300 words

Return ONLY the cover letter content, formatted with paragraphs.`;

        return await this.callClaude(prompt, 2048);
    }
}

// Initialize global AI optimizer
window.aiOptimizer = new AIOptimizer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIOptimizer;
}
