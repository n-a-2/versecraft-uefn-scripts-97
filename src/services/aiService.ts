
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
      
      // Fix model names to match the actual API endpoint format
      let model = request.model || 'gemini-1.5-pro';
      
      // Ensure model name is in the correct format
      if (model === 'gemini-flash') {
        model = 'gemini-1.5-flash';
      } else if (model === 'gemini-pro') {
        model = 'gemini-1.5-pro';
      }
      
      const temperature = request.temperature || 0.7;
      const maxResults = request.maxResults || 1;
      
      // Create advanced prompt for high-quality Verse code generation
      const enhancedPrompt = `
        You are VerseGPT, a world-class expert in Verse language and a lead developer on the Unreal Engine team at Epic Games, specializing in designing and implementing robust gameplay systems for Fortnite Creative using UEFN. You have deep understanding of all UEFN devices, the Verse API, and performance/safety best practices in the game environment.

        Your task is to generate complete, functional, high-quality, and perfectly documented Verse code based on the user's request.

        Before writing any code, analyze the user's request thoroughly. Consider:
        1. What is the ultimate goal of the code? (Functionality)
        2. Which devices or entities in UEFN will the code interact with?
        3. What events or conditions will trigger the code execution?
        4. What data does the code need to manage or access?
        5. What potential challenges or edge cases in the UEFN context might affect code operation?

        The generated code must strictly adhere to the following requirements:
        - **Syntax:** 100% accurate adherence to Verse language syntax for the latest version of UEFN. Do not include any outdated or unsupported syntax.
        - **Compilability:** Code must be directly compilable in UEFN without any errors or warnings.
        - **Functionality:** Code must be fully functional and achieve the goal specified in the user's request.
        - **Structure:** Use a Verse device class structure (\`class(creative_device):\`) by default, unless the user explicitly requests something else (like a standalone function).
        - **Editable Properties:** Properly use \`@editable\` for properties that should be configurable in the UEFN editor (such as references to other devices, numerical values that might change).
        - **Comments:** Add detailed explanatory comments for each major part of the code, explaining the purpose, how it works, and why a particular approach was chosen.
        - **Error Handling:** Include robust handling for cases where operations might fail (like trying to get an \`agent\` that might not be a \`fort_character\`, or dealing with devices that might not exist). Use \`if\`, \`[]\`, and \`?\` appropriately.
        - **Performance & Best Practices:** Write code as efficient as possible to avoid negatively impacting game performance. Follow Verse best practices (like avoiding uncontrolled infinite loops, managing \`suspends\`).
        - **Readability and Organization:** Code must be clean, organized, and easy to read and understand for another Verse developer.

        Here's an example to guide your response:

        Example Request: Create a device that grants a player gold when they stand on a pressure plate.
        
        Verse Code:
        \`\`\`verse
        using { /Fortnite.com/Devices }
        using { /Fortnite.com/Characters }
        using { /Verse.org/Simulation }
        
        # A device that awards gold to players when they step on a pressure plate
        gold_granter_device := class(creative_device):
            # Reference to the trigger device that players will step on
            @editable
            TriggerPlate : trigger_device = trigger_device{}
            
            # Reference to the item granter that will give the gold
            @editable
            GoldGranter : item_granter_device = item_granter_device{}
            
            # Amount of gold to grant (configure this in the item granter)
            @editable
            GoldAmount : int = 10
            
            # Setup subscription to the trigger event when the experience starts
            OnBegin<override>()<suspends>:void =
                # Subscribe to the trigger event with our handler function
                TriggerPlate.TriggeredEvent.Subscribe(OnPlayerTriggeredPlate)
                Print("Gold granter device initialized and ready")
            
            # Handler function that runs when a player steps on the plate
            OnPlayerTriggeredPlate(Agent : agent) : void =
                # Verify we have a valid Fortnite character
                if (FortCharacter := Agent.GetFortCharacter[]):
                    # Grant the item (gold) to the player
                    GoldGranter.GrantItem(Agent)
                    Print("Granted {GoldAmount} gold to player")
                else:
                    Print("Warning: Triggered by non-player agent")
        \`\`\`
        
        Now, generate complete, functional Verse code for Fortnite UEFN based on this request: "${request.prompt}"
        
        Return ONLY the Verse code without any explanations before or after it. The code should be fully functional, well-commented, and ready to paste into a .verse file in UEFN.
      `;
      
      // Update to use the correct API endpoint for the model
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
        model: request.model || 'gemini-1.5-pro',
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
