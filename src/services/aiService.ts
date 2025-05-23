import { toast } from 'sonner';

// Type definitions for AI service
export interface GenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxResults?: number;
  insertCode?: string; // Code insertion field
  continueCode?: string; // Field to continue/enhance existing code
  editInstructions?: string; // Instructions for editing existing code
}

export interface GenerationResponse {
  content: string;
  title: string;
  timestamp?: number;
}

// Define database schema for saving generated scripts
export interface SavedScript {
  id?: string;
  title: string;
  content: string;
  prompt: string;
  model: string;
  temperature: number;
  timestamp: number;
  userId?: string;
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
      
      // Use the correct model name based on what's available in the Gemini API
      const model = request.model || 'gemini-1.5-flash';
      const temperature = request.temperature || 0.7;
      const maxResults = request.maxResults || 1;
      
      // Create advanced prompt for high-quality Verse code generation
      let enhancedPrompt = `
        You are VerseGPT, a world-class expert in Verse language and a lead developer on the Unreal Engine team at Epic Games, specializing in designing and implementing robust gameplay systems for Fortnite Creative using UEFN. You have deep understanding of all UEFN devices, the Verse API, and performance/safety best practices in the game environment.

        YOUR TOP PRIORITY is to generate COMPLETE, FUNCTIONAL, and PRODUCTION-READY Verse code. Users expect code they can directly copy and paste into UEFN that will work without modifications or additions.

        Before writing any code, analyze the user's request thoroughly. Consider:
        1. What is the ultimate goal of the code? (Functionality)
        2. Which devices or entities in UEFN will the code interact with?
        3. What events or conditions will trigger the code execution?
        4. What data does the code need to manage or access?
        5. What potential challenges or edge cases in the UEFN context might affect code operation?

        The generated code must strictly adhere to the following requirements:
        - **Completeness:** Generate 100% COMPLETE implementations with ALL required functions, methods, and event handlers fully implemented. NEVER leave TODOs or placeholders.
        - **Syntax:** 100% accurate adherence to Verse language syntax for the latest version of UEFN.
        - **Compilability:** Code must be directly compilable in UEFN without any errors or warnings.
        - **Functionality:** Code must be fully functional and achieve the goal specified in the user's request.
        - **Structure:** Use a Verse device class structure (\`class(creative_device):\`) by default, unless the user explicitly requests something else.
        - **Editable Properties:** Properly use \`@editable\` for properties that should be configurable in the UEFN editor.
        - **Comments:** Add detailed explanatory comments for each major part of the code.
        - **Error Handling:** Include robust handling for edge cases using \`if\`, \`[]\`, and \`?\` appropriately.
        - **Performance & Best Practices:** Write efficient code following Verse best practices.
        - **Readability and Organization:** Code must be clean, organized, and easy to read.
        - **Real-World Usable:** The code should be ready to use in a real UEFN project with all necessary imports.
      `;
      
      // Handle code continuation or editing if provided
      if (request.continueCode) {
        enhancedPrompt += `
        
        IMPORTANT: The user has provided existing code that they want you to CONTINUE BUILDING UPON. You must analyze this code and extend it with additional functionality based on the prompt. Maintain the existing structure, naming conventions, and style. DO NOT rewrite what already works:
        
        \`\`\`verse
        ${request.continueCode}
        \`\`\`
        
        Your task is to BUILD UPON this code, adding the functionality described in the prompt: "${request.prompt}". Return the COMPLETE enhanced code with both the original functionality and your additions.
        `;
      }
      // Handle edit instructions if provided
      else if (request.editInstructions && request.insertCode) {
        enhancedPrompt += `
        
        IMPORTANT: The user has provided existing code that needs to be EDITED according to specific instructions. You must modify this code according to these edit instructions while preserving its overall structure and functionality:
        
        \`\`\`verse
        ${request.insertCode}
        \`\`\`
        
        EDIT INSTRUCTIONS: "${request.editInstructions}"
        
        Your task is to MODIFY this code according to the instructions. Return the COMPLETE edited code.
        `;
      }
      // Handle simple code insertion if provided
      else if (request.insertCode) {
        enhancedPrompt += `
          
        IMPORTANT: The user has provided some code that needs to be included in your response. Please integrate this code into your solution, making any necessary adjustments to ensure it works properly with the rest of your implementation:
          
        \`\`\`verse
        ${request.insertCode}
        \`\`\`
          
        Ensure this code is properly integrated into your complete solution. If there are any issues or improvements needed in this code, make them and explain your changes.
        `;
      }
      
      enhancedPrompt += `
        
        Now, generate complete, functional Verse code for Fortnite UEFN based on this request: "${request.prompt}"
        
        Return ONLY the Verse code without any explanations before or after it. The code should be fully functional, well-commented, and ready to paste into a .verse file in UEFN. Make sure to implement ALL functions, methods, and handlers mentioned or called in your code, not just declare them.

        THE ENTIRE SCRIPT must be complete and ready to use without any additional coding. NEVER use placeholders like "// TODO" or "// Implement this". ALWAYS fully implement ALL functionality.
      `;
      
      console.log("Using model:", model);
      
      // Update to use the correct API endpoint for the Gemini API
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
        
        // Provide more specific error messages based on the response code
        if (response.status === 429) {
          toast.error("Quota exceeded for your Gemini API key. Please check your Google AI Studio quota limits.");
        } else if (response.status === 403) {
          toast.error("API key invalid or unauthorized. Please check your Gemini API key.");
        } else if (response.status === 404) {
          toast.error("Model not found. Try using a supported model name like 'gemini-1.5-flash' or 'gemini-1.5-pro'.");
        } else {
          toast.error("Error generating Verse code: " + (errorData.error?.message || "Unknown error"));
        }
        
        return null;
      }
      
      const data = await response.json();
      
      // Extract generated code from response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        toast.error("No Verse code was generated. Please try again with a clearer prompt.");
        return null;
      }
      
      // Clean up the generated code
      const cleanedCode = this.cleanGeneratedCode(generatedText);
      
      const result: GenerationResponse = {
        content: cleanedCode,
        title: request.prompt,
        timestamp: Date.now()
      };
      
      // Save to local storage for history
      this.saveToLocalStorage(result, request);
      
      return result;
    } catch (error) {
      console.error("Error generating Verse code:", error);
      toast.error("Failed to generate code: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    }
  }
  
  // Clean up the generated code to ensure it's valid Verse code
  private cleanGeneratedCode(code: string): string {
    // Remove any markdown code blocks if present
    let cleanedCode = code.replace(/```verse|```\n/g, '').replace(/```/g, '');
    
    // Remove any leading or trailing explanation text
    // Look for the first comment or using statement, which typically starts Verse files
    const verseFileStart = cleanedCode.search(/(\/\/|\/\*|using\s+\{|\#)/);
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
  
  // Save generated script to local storage for history
  private saveToLocalStorage(result: GenerationResponse, request: GenerationRequest): void {
    try {
      // Get existing scripts or initialize empty array
      const savedScripts = JSON.parse(localStorage.getItem('verse_scripts') || '[]');
      
      // Create new script entry
      const newScript: SavedScript = {
        id: crypto.randomUUID(),
        title: request.prompt,
        content: result.content,
        prompt: request.prompt,
        model: request.model || 'gemini-1.5-flash',
        temperature: request.temperature || 0.7,
        timestamp: Date.now()
      };
      
      // Add to beginning of array (most recent first)
      savedScripts.unshift(newScript);
      
      // Keep only the last 50 scripts
      const trimmedScripts = savedScripts.slice(0, 50);
      
      // Save back to local storage
      localStorage.setItem('verse_scripts', JSON.stringify(trimmedScripts));
    } catch (error) {
      console.error("Error saving script to local storage:", error);
    }
  }
  
  // Retrieve saved scripts from local storage
  getSavedScripts(): SavedScript[] {
    try {
      return JSON.parse(localStorage.getItem('verse_scripts') || '[]');
    } catch (error) {
      console.error("Error retrieving saved scripts:", error);
      return [];
    }
  }
}

export default AIService;
