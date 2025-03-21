
import { toast } from 'sonner';

// Type definitions for AI service
export interface GenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxResults?: number;
}

export interface GenerationResponse {
  content: string;
  title: string;
}

export class AIService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Generate code with Google Gemini API
  async generateCode(request: GenerationRequest): Promise<GenerationResponse | null> {
    try {
      if (!this.apiKey) {
        toast.error("API key is not set. Please set a valid Gemini API key.");
        return null;
      }
      
      // Default values
      const model = request.model || 'gemini-2.0-flash';
      const temperature = request.temperature || 0.7;
      const maxResults = request.maxResults || 1;
      
      // Create prompt for Verse code generation
      const enhancedPrompt = `
        Generate a Verse UEFN script for Fortnite creative based on this prompt: "${request.prompt}"
        
        The code should:
        - Use proper Verse syntax and follow best practices
        - Include detailed comments explaining how it works
        - Be complete and functional (no placeholders)
        - Follow the module and function structure of Verse language
        - Only return the code, no explanations outside the code comments
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: enhancedPrompt }]
          }],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: 8192,
            topP: 0.95,
            topK: 40
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error("Error generating code: " + (errorData.error?.message || "Unknown error"));
        return null;
      }
      
      const data = await response.json();
      
      // Extract generated code from response
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        toast.error("No code was generated. Please try again.");
        return null;
      }
      
      // Clean up the generated code
      const cleanedCode = this.cleanGeneratedCode(generatedText);
      
      return {
        content: cleanedCode,
        title: request.prompt
      };
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    }
  }
  
  // Clean up the generated code to ensure it's valid Verse code
  private cleanGeneratedCode(code: string): string {
    // Remove any markdown code blocks if present
    let cleanedCode = code.replace(/```verse|```\n/g, '').replace(/```/g, '');
    
    // Trim whitespace
    cleanedCode = cleanedCode.trim();
    
    return cleanedCode;
  }
}

export default AIService;
