
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
  
  // Generate Verse code with Google Gemini API
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
      
      // Create specialized prompt for Verse code generation
      const enhancedPrompt = `
        You are VerseGPT, an AI assistant specialized in generating UEFN Verse scripts for Fortnite Creative. 
        
        Generate a complete, functional Verse script for Fortnite UEFN based on this request: "${request.prompt}"
        
        Your code must:
        - Use proper Verse syntax following the latest Epic Games documentation
        - Include detailed explanatory comments throughout the code
        - Be fully functional and ready to use in UEFN (not pseudocode)
        - Use appropriate classes, devices, and UEFN concepts
        - Include error handling where appropriate
        - Follow Verse best practices for performance and maintainability
        
        Do not include any explanation text outside the code itself. 
        Just return the complete, commented Verse code formatted as if it were in a .verse file.
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
        toast.error("Error generating Verse code: " + (errorData.error?.message || "Unknown error"));
        return null;
      }
      
      const data = await response.json();
      
      // Extract generated code from response
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        toast.error("No Verse code was generated. Please try again with a clearer prompt.");
        return null;
      }
      
      // Clean up the generated code
      const cleanedCode = this.cleanGeneratedCode(generatedText);
      
      return {
        content: cleanedCode,
        title: request.prompt
      };
    } catch (error) {
      console.error("Error generating Verse code:", error);
      toast.error("Failed to generate Verse code: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    }
  }
  
  // Clean up the generated code to ensure it's valid Verse code
  private cleanGeneratedCode(code: string): string {
    // Remove any markdown code blocks if present
    let cleanedCode = code.replace(/```verse|```\n/g, '').replace(/```/g, '');
    
    // Remove any leading or trailing explanation text
    // Look for the first comment or using statement, which typically starts Verse files
    const verseFileStart = cleanedCode.search(/(\/\/|\/\*|using\s+\{)/);
    if (verseFileStart > 0) {
      cleanedCode = cleanedCode.substring(verseFileStart);
    }
    
    // Trim whitespace
    cleanedCode = cleanedCode.trim();
    
    // Add standard Verse file header if missing
    if (!cleanedCode.includes('using {')) {
      cleanedCode = `using { /Script/FortniteGame }\n\n${cleanedCode}`;
    }
    
    return cleanedCode;
  }
}

export default AIService;
