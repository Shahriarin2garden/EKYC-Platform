const logger = require('../config/logger');

/**
 * AI Service for generating KYC application summaries using OpenRouter
 * Uses open-source LLM models for better readability and insights
 */

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    
    // Using Llama 3.1 8B Instruct - Fast, open-source, and excellent for analysis
    // Alternative models you can use:
    // - 'meta-llama/llama-3.2-3b-instruct:free' (Free, good quality)
    // - 'google/gemma-2-9b-it:free' (Free, Google's open model)
    // - 'mistralai/mistral-7b-instruct:free' (Free tier available)
    // - 'meta-llama/llama-3.1-8b-instruct:free' (Free, latest Llama)
    this.model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
    
    // Lazy-load OpenRouter SDK (will be initialized on first use)
    this.client = null;
    this.clientPromise = null;
  }

  /**
   * Lazy-load OpenRouter SDK using dynamic import
   * This is necessary because @openrouter/sdk is an ES module
   */
  async getClient() {
    if (!this.apiKey) {
      return null;
    }

    if (this.client) {
      return this.client;
    }

    if (!this.clientPromise) {
      this.clientPromise = (async () => {
        try {
          const { OpenRouter } = await import('@openrouter/sdk');
          this.client = new OpenRouter({
            apiKey: this.apiKey,
            defaultHeaders: {
              'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
              'X-Title': 'EKYC System',
            },
          });
          return this.client;
        } catch (error) {
          logger.error('Failed to load OpenRouter SDK', { error: error.message });
          this.clientPromise = null;
          return null;
        }
      })();
    }

    return this.clientPromise;
  }

  /**
   * Check if AI service is enabled and configured
   */
  isEnabled() {
    return !!this.apiKey;
  }

  /**
   * Generate a comprehensive, readable summary for KYC application
   * @param {Object} kycData - KYC application data
   * @returns {Promise<string>} - AI-generated summary
   */
  async generateKycSummary(kycData) {
    // If API key is not configured, return basic summary
    if (!this.isEnabled()) {
      logger.warn('OpenRouter API key not configured. Using basic summary.');
      return this.generateBasicSummary(kycData);
    }

    try {
      // Get the OpenRouter client (lazy-loaded)
      const client = await this.getClient();
      
      if (!client) {
        logger.warn('OpenRouter client not available. Using basic summary.');
        return this.generateBasicSummary(kycData);
      }

      const prompt = this.buildPrompt(kycData);
      
      // Use OpenRouter SDK to send chat completion request
      const response = await client.chat.send({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional KYC (Know Your Customer) analyst assistant. Your task is to create clear, concise, and professional summaries of customer verification applications. Focus on key information, risk indicators, and provide actionable insights for compliance officers. IMPORTANT: Output PLAIN TEXT ONLY. DO NOT use markdown formatting, asterisks, or any special formatting characters. Use simple paragraphs with line breaks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, professional output
        max_tokens: 400, // Reduced to stay within credit limits
        top_p: 0.9,
        stream: false, // Disable streaming for simpler integration
      });

      const summary = response.choices[0].message.content.trim();
      
      logger.ai('AI summary generated successfully', { model: this.model });
      return summary;

    } catch (error) {
      logger.error('Error generating AI summary', { error: error.message, responseData: error.response?.data });
      
      // Fallback to basic summary on error
      logger.warn('Falling back to basic summary generation');
      return this.generateBasicSummary(kycData);
    }
  }

  /**
   * Build a structured prompt for the AI model
   */
  buildPrompt(kycData) {
    return `Analyze the following KYC application and provide a professional summary in PLAIN TEXT format (no markdown, no asterisks, no formatting):

Customer Information:
- Name: ${kycData.name || 'Not provided'}
- Email: ${kycData.email || 'Not provided'}
- National ID: ${kycData.nid || 'Not provided'}
- Occupation: ${kycData.occupation || 'Not provided'}
- Address: ${kycData.address || 'Not provided'}

Task:
Create a professional KYC application summary that includes:

1. Overview: Brief introduction of the applicant
2. Verification Status: What information is complete/incomplete
3. Risk Assessment: Initial risk indicators (if any)
4. Recommendations: Next steps for the compliance team

Keep the summary concise (3-4 paragraphs), professional, and actionable. Use clear, business-appropriate language. Write in plain text format with simple paragraphs separated by line breaks. Do NOT use markdown formatting or special characters.`;
  }

  /**
   * Generate basic summary without AI (fallback)
   */
  generateBasicSummary(kycData) {
    const completeness = this.calculateCompleteness(kycData);
    const riskLevel = this.assessBasicRisk(kycData);
    
    return ` KYC Application Summary

 Applicant: ${kycData.name} (${kycData.email})

 Profile Completeness: ${completeness.percentage}% (${completeness.complete}/${completeness.total} fields)

${kycData.nid ? ` National ID: ${kycData.nid}` : '  National ID: Not provided'}
${kycData.occupation ? ` Occupation: ${kycData.occupation}` : '  Occupation: Not provided'}
${kycData.address ? ` Address: ${kycData.address}` : '  Address: Not provided'}

 Initial Risk Level: ${riskLevel.level}
${riskLevel.reason}

 Next Steps:
- ${completeness.percentage === 100 ? 'Proceed with document verification' : 'Request missing information'}
- Verify identity documents
- Conduct background screening
- Review for compliance with AML/KYC policies

Submitted: ${new Date(kycData.submittedAt || Date.now()).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}`;
  }

  /**
   * Calculate application completeness
   */
  calculateCompleteness(kycData) {
    const fields = ['name', 'email', 'nid', 'occupation', 'address'];
    const complete = fields.filter(field => kycData[field] && kycData[field].trim()).length;
    
    return {
      complete,
      total: fields.length,
      percentage: Math.round((complete / fields.length) * 100)
    };
  }

  /**
   * Perform basic risk assessment
   */
  assessBasicRisk(kycData) {
    const completeness = this.calculateCompleteness(kycData);
    
    if (completeness.percentage === 100) {
      return {
        level: 'LOW ',
        reason: 'All required information provided. Standard verification process recommended.'
      };
    } else if (completeness.percentage >= 60) {
      return {
        level: 'MEDIUM ',
        reason: 'Some information missing. Request additional details before proceeding.'
      };
    } else {
      return {
        level: 'HIGH ',
        reason: 'Critical information missing. Cannot proceed without complete application.'
      };
    }
  }

  /**
   * Generate summary for multiple applications (batch processing)
   */
  async generateBatchSummaries(kycApplications, maxConcurrent = 3) {
    const results = [];
    
    for (let i = 0; i < kycApplications.length; i += maxConcurrent) {
      const batch = kycApplications.slice(i, i + maxConcurrent);
      const summaries = await Promise.all(
        batch.map(app => this.generateKycSummary(app))
      );
      results.push(...summaries);
      
      // Rate limiting: small delay between batches
      if (i + maxConcurrent < kycApplications.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Export singleton instance
module.exports = new AIService();
