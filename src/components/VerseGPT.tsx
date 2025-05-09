
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, Copy, Save, RefreshCw, FileCode, Edit, ArrowRightCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CodeEditor from './CodeEditor';
import ScriptHistory from './ScriptHistory';
import AIService, { GenerationRequest, SavedScript } from '@/services/aiService';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Tabs for different code generation modes
enum GenerationMode {
  NEW = 'new',
  CONTINUE = 'continue',
  EDIT = 'edit'
}

const VerseGPT: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [prompt, setPrompt] = useState('');
  const [insertCode, setInsertCode] = useState('');
  const [useCodeInsertion, setUseCodeInsertion] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.NEW);
  const [editInstructions, setEditInstructions] = useState('');
  
  // Initialize AI service
  const aiService = new AIService(apiKey);
  
  // Load saved scripts on component mount
  useEffect(() => {
    const scripts = aiService.getSavedScripts();
    setSavedScripts(scripts);
  }, []);
  
  const promptExamples = [
    "Create a weather system that cycles through sunny, cloudy, and rainy conditions every few minutes",
    "Design a checkpoint race system where players compete for the fastest time",
    "Create a resource gathering system where players can collect wood, stone, and metal",
    "Build a capture the flag game mode with two teams and scoring",
    "Make a wave-based zombie defense game with increasing difficulty"
  ];

  const handleGenerateCode = async () => {
    if (!apiKey) {
      toast.error("Please set your Gemini API key first");
      return;
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt for code generation");
      return;
    }
    
    setIsGenerating(true);
    toast.info("Generating Verse code...");
    
    try {
      const request: GenerationRequest = {
        prompt: prompt,
        model: selectedModel,
        temperature: temperature,
      };
      
      // Set up request based on generation mode
      if (generationMode === GenerationMode.CONTINUE) {
        if (!generatedCode.trim()) {
          toast.error("There's no code to continue. Please generate code first.");
          setIsGenerating(false);
          return;
        }
        request.continueCode = generatedCode;
      } else if (generationMode === GenerationMode.EDIT) {
        if (!editInstructions.trim()) {
          toast.error("Please provide edit instructions");
          setIsGenerating(false);
          return;
        }
        request.editInstructions = editInstructions;
        request.insertCode = generatedCode || insertCode;
      } else if (useCodeInsertion && insertCode.trim()) {
        // For new code with insertion
        request.insertCode = insertCode;
      }
      
      console.log("Sending request with model:", selectedModel);
      const result = await aiService.generateCode(request);
      
      if (result) {
        setGeneratedCode(result.content);
        toast.success("Code generated successfully!");
        
        // Refresh saved scripts list
        const scripts = aiService.getSavedScripts();
        setSavedScripts(scripts);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectScript = (script: SavedScript) => {
    setPrompt(script.prompt);
    setGeneratedCode(script.content);
    setSelectedModel(script.model);
    setTemperature(script.temperature);
    setActiveTab('generate');
  };

  const handleDeleteScript = (id: string) => {
    // Get current scripts
    const currentScripts = aiService.getSavedScripts();
    
    // Filter out the script to delete
    const updatedScripts = currentScripts.filter(script => script.id !== id);
    
    // Save back to local storage
    localStorage.setItem('verse_scripts', JSON.stringify(updatedScripts));
    
    // Update state
    setSavedScripts(updatedScripts);
    
    toast.success("Script deleted from history");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  const handleSelectPromptExample = (example: string) => {
    setPrompt(example);
  };

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    toast.success("API key saved successfully!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="p-4 border border-zinc-800 rounded-lg bg-black bg-opacity-60 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <Brain className="mr-2 h-5 w-5 text-verse-blue" />
          VerseGPT - AI Verse Code Generator
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-zinc-900">
            <TabsTrigger value="generate">Generate Code</TabsTrigger>
            <TabsTrigger value="history">Code History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <div className="space-y-4">
              {/* Generation mode selection */}
              <div className="space-y-2">
                <Label>Generation Mode</Label>
                <RadioGroup 
                  value={generationMode} 
                  onValueChange={(value) => setGenerationMode(value as GenerationMode)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={GenerationMode.NEW} id="mode-new" />
                    <Label htmlFor="mode-new" className="cursor-pointer">New Code</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={GenerationMode.CONTINUE} id="mode-continue" />
                    <Label htmlFor="mode-continue" className="cursor-pointer">Continue/Enhance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={GenerationMode.EDIT} id="mode-edit" />
                    <Label htmlFor="mode-edit" className="cursor-pointer">Edit Code</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Prompt textarea section */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="prompt">
                  {generationMode === GenerationMode.CONTINUE 
                    ? "Describe what to add to the existing code:"
                    : generationMode === GenerationMode.EDIT
                    ? "Describe what you want to create:"
                    : "Describe what you want to create in Verse:"}
                </Label>
                <Textarea
                  id="prompt"
                  placeholder={generationMode === GenerationMode.CONTINUE 
                    ? "Add a day/night cycle to the existing weather system..." 
                    : generationMode === GenerationMode.EDIT
                    ? "Describe what you want to create..."
                    : "Create a weather system that changes over time with rain and lightning effects..."}
                  className="h-32 bg-zinc-900 border-zinc-700 text-white resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              {/* Edit instructions section (only for edit mode) */}
              {generationMode === GenerationMode.EDIT && (
                <div className="space-y-2">
                  <Label htmlFor="edit-instructions">Edit Instructions:</Label>
                  <Textarea
                    id="edit-instructions"
                    placeholder="Change the weather duration to 60 seconds, add snow weather type..."
                    className="h-24 bg-zinc-900 border-zinc-700 text-white resize-none"
                    value={editInstructions}
                    onChange={(e) => setEditInstructions(e.target.value)}
                  />
                  <p className="text-xs text-zinc-500">
                    <Edit size={14} className="inline mr-1" />
                    Specify exactly what changes you want to make to the code
                  </p>
                </div>
              )}
              
              {/* Code insertion section (only for new mode) */}
              {generationMode === GenerationMode.NEW && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code-insertion" className="flex items-center space-x-2 cursor-pointer">
                      <span>Include existing code in generation</span>
                    </Label>
                    <Switch 
                      id="code-insertion"
                      checked={useCodeInsertion}
                      onCheckedChange={setUseCodeInsertion}
                    />
                  </div>
                  
                  {useCodeInsertion && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="insert-code">Verse code to include:</Label>
                      <Textarea
                        id="insert-code"
                        placeholder="# Paste existing Verse code here to integrate it with the generated code..."
                        className="h-40 bg-zinc-900 border-zinc-700 text-white font-mono resize-none"
                        value={insertCode}
                        onChange={(e) => setInsertCode(e.target.value)}
                      />
                      <p className="text-xs text-zinc-500">
                        <FileCode size={14} className="inline mr-1" />
                        The AI will integrate this code into the generated solution
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Example prompts section (only for new mode) */}
              {generationMode === GenerationMode.NEW && (
                <div className="space-y-2">
                  <Label>Example Prompts</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {promptExamples.map((example, index) => (
                      <button
                        key={index}
                        className="text-left p-2 border border-zinc-800 rounded-md hover:bg-zinc-800 text-zinc-300 text-sm transition-colors"
                        onClick={() => handleSelectPromptExample(example)}
                      >
                        <Brain size={14} className="inline mr-2 text-verse-blue" />
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Model and temperature settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Faster)</SelectItem>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Better Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="creativity">
                    Creativity: {temperature.toFixed(1)}
                  </Label>
                  <Slider
                    id="creativity"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(values) => setTemperature(values[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
              
              {/* API Key input */}
              <div>
                <Label htmlFor="apikey">Gemini API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="AIzaSyB..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                  <Button 
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={handleSaveKey}
                  >
                    Save Key
                  </Button>
                  <Button 
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={() => window.open('https://ai.google.dev/', '_blank')}
                  >
                    Get Key
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Your API key is stored locally in your browser. Get a key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-verse-blue hover:underline">Google AI Studio</a>.
                </p>
              </div>
              
              {/* Generate button */}
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating || !prompt.trim() || !apiKey}
                className="w-full bg-verse-blue hover:bg-verse-blue/80"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Code...
                  </>
                ) : generationMode === GenerationMode.CONTINUE ? (
                  <>
                    <ArrowRightCircle className="mr-2 h-4 w-4" />
                    Continue Code
                  </>
                ) : generationMode === GenerationMode.EDIT ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Code
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Verse Code
                  </>
                )}
              </Button>
              
              {/* Generated code display */}
              {generatedCode && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Generated Verse Code</Label>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <CodeEditor code={generatedCode} readOnly={true} />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <ScriptHistory 
              scripts={savedScripts} 
              onSelect={handleSelectScript} 
              onDelete={handleDeleteScript}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VerseGPT;
