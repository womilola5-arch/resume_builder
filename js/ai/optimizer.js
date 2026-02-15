// AI Optimization Module - Hugging Face Integration (FREE!)
// Phase 2: AI Enhancement

class AIOptimizer {
    constructor() {
        // Hugging Face Inference API - FREE!
        this.apiEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
        this.apiKey = 'hf_XYourFreeAPIKeyHere'; // Users can get free key at huggingface.co
    }

    // Get/Set API key (Hugging Face)
    getAPIKey() {
        let key = localStorage.getItem('hf_api_key');
        
        if (!key) {
            const userKey = prompt(
                'To use AI features, enter your FREE Hugging Face API key.\n\n' +
                'Get one FREE at: https://huggingface.co/settings/tokens\n\n' +
                '1. Sign up (FREE, no credit card)\n' +
                '2. Go to Settings → Access Tokens\n' +
                '3. Create new token\n' +
                '4. Paste it here\n\n' +
                'Your key is stored locally and never sent to our servers.'
            );
            
            if (userKey) {
                localStorage.setItem('hf_api_key', userKey);
                key = userKey;
            }
        }
        
        return key;
    }

    setAPIKey(key) {
        localStorage.setItem('hf_api_key', key);
        this.apiKey = key;
    }

    clearAPIKey() {
        localStorage.removeItem('hf_api_key');
        this.apiKey = null;
    }

    // Make API call to Hugging Face
    async callHuggingFace(prompt, maxTokens = 500) {
        const apiKey = this.getAPIKey();
        
        if (!apiKey) {
            throw new Error('API key not set. Please get a FREE key from huggingface.co');
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: maxTokens,
                        temperature: 0.7,
                        top_p: 0.9,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'API request failed');
            }

            const data = await response.json();
            
            // Handle different response formats
            if (Array.isArray(data) && data[0]?.generated_text) {
                return data[0].generated_text.trim();
            } else if (data.generated_text) {
                return data.generated_text.trim();
            } else {
                return data[0] || 'No response generated';
            }
        } catch (error) {
            console.error('Hugging Face API Error:', error);
            throw error;
        }
    }

    // Optimize professional summary
    async optimizeSummary(currentSummary, resumeData = {}) {
        const prompt = `You are a professional resume writer. Rewrite this professional summary to be more compelling and achievement-focused. Keep it 3-4 sentences. Use strong action words.

Current Summary:
${currentSummary}

Rewritten Summary:`;

        return await this.callHuggingFace(prompt, 300);
    }

    // Optimize job description
    async optimizeJobDescription(description, jobTitle, company) {
        const prompt = `You are a resume expert. Rewrite this job description with strong action verbs and specific achievements. Use bullet points starting with •. Focus on results and impact.

Job: ${jobTitle} at ${company}

Current Description:
${description}

Improved Description (use bullet points):`;

        return await this.callHuggingFace(prompt, 400);
    }

    // Tailor resume for specific job
    async tailorForJob(resumeData, jobDescription) {
        const prompt = `Analyze this job description and provide 5 important keywords to include in the resume.

Job Description:
${jobDescription}

Current Skills: ${resumeData.skills?.join(', ') || 'Not provided'}

List 5 keywords from the job description that should be emphasized:`;

        const response = await this.callHuggingFace(prompt, 200);
        
        // Parse response into structured format
        const keywords = response.split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
            .filter(Boolean)
            .slice(0, 10);
        
        return {
            keywords: keywords,
            emphasizeSkills: resumeData.skills?.slice(0, 5) || [],
            addSkills: keywords.slice(0, 5),
            summaryTips: ['Emphasize these keywords in your summary', 'Focus on relevant achievements'],
            rawResponse: response
        };
    }

    // Skills gap analysis
    async analyzeSkillsGap(currentSkills, jobDescription) {
        const prompt = `Compare these skills against the job requirements and identify gaps.

Current Skills: ${currentSkills.join(', ')}

Job Description:
${jobDescription}

List:
1. Which current skills match (relevant to job)
2. Which skills are missing (needed for job)
3. Learning recommendations`;

        const response = await this.callHuggingFace(prompt, 400);
        
        return {
            matchingSkills: currentSkills.slice(0, 5).map(skill => ({skill, relevance: 8})),
            missingSkills: [],
            recommendations: ['Review the job requirements', 'Consider adding relevant skills'],
            rawResponse: response
        };
    }

    // Suggest action verbs
    async suggestActionVerbs(currentText) {
        const prompt = `Rewrite this text with stronger action verbs. Replace weak words like "was responsible for", "helped", "worked on" with powerful verbs like "spearheaded", "optimized", "led".

Current:
${currentText}

Improved:`;

        return await this.callHuggingFace(prompt, 300);
    }

    // Quantify achievements
    async quantifyAchievements(description) {
        const prompt = `Add [METRIC] placeholders where numbers should be added to make achievements more impactful.

Current:
${description}

With metric placeholders:`;

        return await this.callHuggingFace(prompt, 300);
    }

    // ATS compatibility check
    async checkATSCompatibility(resumeData) {
        // Simplified ATS check without API
        const score = Math.min(100, 
            (resumeData.skills?.length || 0) * 5 + 
            (resumeData.experiences?.length || 0) * 10 +
            (resumeData.education?.length || 0) * 10 +
            (resumeData.summary ? 20 : 0)
        );
        
        return {
            overallScore: score,
            categoryScores: {
                keywords: Math.min(100, (resumeData.skills?.length || 0) * 10),
                formatting: 90,
                contact: resumeData.personal?.email ? 100 : 50,
                skills: Math.min(100, (resumeData.skills?.length || 0) * 10),
                experience: Math.min(100, (resumeData.experiences?.length || 0) * 20)
            },
            issues: score < 70 ? ['Add more skills', 'Include more details'] : [],
            recommendations: [
                'Use keywords from job descriptions',
                'Keep formatting simple',
                'Include contact information'
            ]
        };
    }

    // Generate cover letter
    async generateCoverLetter(resumeData, jobDescription, companyName) {
        const prompt = `Write a professional cover letter.

Company: ${companyName}
Candidate: ${resumeData.personal?.fullName}
Experience: ${resumeData.experiences?.[0]?.title || 'Professional'}
Skills: ${resumeData.skills?.slice(0, 5).join(', ') || 'Various skills'}

Job Description:
${jobDescription.substring(0, 500)}

Write a 3-paragraph cover letter:`;

        return await this.callHuggingFace(prompt, 600);
    }
}

// Initialize global AI optimizer
window.aiOptimizer = new AIOptimizer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIOptimizer;
}
