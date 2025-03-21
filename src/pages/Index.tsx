import React, { useState, useEffect } from 'react';
import ScriptCard from '@/components/ScriptCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Settings from '@/components/Settings';
import { 
  weatherSystemCode, 
  zombieSpawnerCode, 
  inventoryTriggerCode, 
  gridInventoryCode,
  characterBlueprintCode,
  particleSystemCode,
  playerMovementCode
} from '@/data/verseScripts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AIService from '@/services/aiService';

// Type for our script data
interface ScriptData {
  id: string;
  title: string;
  code: string | React.ReactNode; // This can be either a string or ReactNode
  category: 'mechanics' | 'ui-inventory' | 'visual';
}

// Function to safely serialize script data for localStorage
const serializeScriptData = (scripts: ScriptData[]): string => {
  // Convert React nodes to strings for serialization
  const serializable = scripts.map(script => {
    // Create a serializable version of the script object
    return {
      ...script,
      // Store code as a string to avoid React elements serialization issues
      code: typeof script.code === 'string' ? script.code : ''
    };
  });
  
  return JSON.stringify(serializable);
};

// Function to deserialize script data from localStorage
const deserializeScriptData = (serialized: string): ScriptData[] => {
  try {
    const parsed = JSON.parse(serialized);
    return parsed.map((item: any) => ({
      ...item,
      // Keep code as string for now, will be converted when displayed
      code: item.code
    }));
  } catch (error) {
    console.error("Error parsing saved scripts:", error);
    return [];
  }
};

const Index = () => {
  // Initial scripts organized by category
  const initialScripts: ScriptData[] = [
    {
      id: 'weather-system',
      title: '"make a weather system"',
      code: weatherSystemCode,
      category: 'mechanics'
    },
    {
      id: 'zombie-spawner',
      title: '"create a zombie spawner"',
      code: zombieSpawnerCode,
      category: 'mechanics'
    },
    {
      id: 'player-movement',
      title: '"realistic physics-based player movement"',
      code: playerMovementCode,
      category: 'mechanics'
    },
    {
      id: 'inventory-trigger',
      title: '"create an inventory trigger"',
      code: inventoryTriggerCode,
      category: 'ui-inventory'
    },
    {
      id: 'grid-inventory',
      title: '"create a grid inventory system"',
      code: gridInventoryCode,
      category: 'ui-inventory'
    },
    {
      id: 'character-blueprint',
      title: '"blueprint class for a character that can jump, move and animate"',
      code: characterBlueprintCode,
      category: 'ui-inventory'
    },
    {
      id: 'particle-system',
      title: '"custom particle system"',
      code: particleSystemCode,
      category: 'visual'
    }
  ];

  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptCategory, setNewScriptCategory] = useState<ScriptData['category']>('mechanics');
  const [newScriptCode, setNewScriptCode] = useState('');
  const [aiService, setAiService] = useState<AIService | null>(null);

  // Load scripts from localStorage or use initial scripts
  useEffect(() => {
    const savedScripts = localStorage.getItem('verse_scripts');
    if (savedScripts) {
      try {
        const parsedScripts = deserializeScriptData(savedScripts);
        if (parsedScripts.length > 0) {
          setScripts(parsedScripts);
        } else {
          // Fallback to initial scripts if parsing results in empty array
          setScripts(initialScripts);
          localStorage.setItem('verse_scripts', serializeScriptData(initialScripts));
        }
      } catch (error) {
        console.error("Error handling saved scripts:", error);
        setScripts(initialScripts);
        // Fallback to initial scripts if parsing fails
        localStorage.setItem('verse_scripts', serializeScriptData(initialScripts));
      }
    } else {
      setScripts(initialScripts);
      // Initialize localStorage with initial scripts
      localStorage.setItem('verse_scripts', serializeScriptData(initialScripts));
    }
    
    // Initialize AI service with API key if available
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
      setAiService(new AIService(apiKey));
    }
  }, []);

  // Filter scripts by category
  const mechanicsScripts = scripts.filter(script => script.category === 'mechanics');
  const uiInventoryScripts = scripts.filter(script => script.category === 'ui-inventory');
  const visualScripts = scripts.filter(script => script.category === 'visual');

  const handleAddScript = () => {
    setIsAddDialogOpen(true);
  };

  const handleDeleteScript = (id: string) => {
    const updatedScripts = scripts.filter(script => script.id !== id);
    setScripts(updatedScripts);
    localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
    toast.success("Script removed successfully!");
  };

  const handleSubmitNewScript = () => {
    if (!newScriptTitle.trim()) {
      toast.error("Please enter a script title");
      return;
    }

    if (!newScriptCode.trim()) {
      toast.error("Please enter script code");
      return;
    }

    // Create new script object
    const newScript: ScriptData = {
      id: `script-${Date.now()}`,
      title: `"${newScriptTitle}"`,
      code: newScriptCode,
      category: newScriptCategory
    };

    // Add new script to the list
    const updatedScripts = [...scripts, newScript];
    setScripts(updatedScripts);
    
    // Save to localStorage
    localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
    
    // Reset form and close dialog
    setNewScriptTitle('');
    setNewScriptCode('');
    setIsAddDialogOpen(false);
    toast.success("New script added successfully!");
  };

  const handleGenerateScript = async (prompt: string) => {
    // Update AI service with latest API key
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error("API key is not set. Please set a valid Gemini API key.");
      return;
    }
    
    // Create or update AI service
    const service = aiService || new AIService(apiKey);
    setAiService(service);
    
    toast.loading("Generating Verse code...", { id: "generating" });
    
    try {
      const result = await service.generateCode({ prompt });
      
      if (result) {
        // Create new script from generated code
        const newScript: ScriptData = {
          id: `script-${Date.now()}`,
          title: `"${prompt}"`,
          code: result.content,
          category: 'mechanics' // Default category
        };
        
        // Add new script to the list
        const updatedScripts = [...scripts, newScript];
        setScripts(updatedScripts);
        
        // Save to localStorage
        localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
        
        toast.success("Code generated successfully!", { id: "generating" });
      } else {
        toast.error("Failed to generate code. Please try again.", { id: "generating" });
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("An error occurred during code generation.", { id: "generating" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1">
        <div className="py-16 text-center">
          <h1 className="text-5xl font-mono mb-2 headline">Verse Library</h1>
          <h2 className="text-xl text-zinc-400 mb-8">AI-Powered Engine for UEFN Verse Scripts</h2>
          
          <div className="container max-w-xl mx-auto mb-12">
            <SearchBar 
              onAddScript={handleAddScript} 
              onGenerateScript={handleGenerateScript}
            />
          </div>
          
          <section className="container mx-auto mt-16">
            <h3 className="text-left text-verse-blue mb-6 font-mono border-l-4 border-verse-blue pl-3 headline">Game Mechanics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {mechanicsScripts.map(script => (
                <ScriptCard 
                  key={script.id}
                  title={script.title}
                  code={script.code}
                  onDelete={() => handleDeleteScript(script.id)}
                />
              ))}
            </div>
            
            <h3 className="text-left text-verse-green mb-6 font-mono border-l-4 border-verse-green pl-3 headline">UI & Inventory Systems</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uiInventoryScripts.map(script => (
                <ScriptCard 
                  key={script.id}
                  title={script.title}
                  code={script.code}
                  onDelete={() => handleDeleteScript(script.id)}
                />
              ))}
            </div>
            
            <h3 className="text-left text-verse-red mb-6 font-mono border-l-4 border-verse-red pl-3 mt-12 headline">Visual Effects</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visualScripts.map(script => (
                <ScriptCard 
                  key={script.id}
                  title={script.title}
                  code={script.code}
                  onDelete={() => handleDeleteScript(script.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <footer className="border-t border-zinc-800 py-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="text-zinc-500">© 2023 VerseCraft | github@nn6n</div>
          <div>
            <a href="https://github.com/i27n/AiAgent-UEFN" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">GitHub</a>
            <span className="mx-2 text-zinc-700">•</span>
            <a href="https://verse.fncwiki.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">Verse Docs</a>
            <span className="mx-2 text-zinc-700">•</span>
            <a href="#" className="text-zinc-500 hover:text-white">Terms</a>
          </div>
        </div>
      </footer>

      {/* Dialog for adding new scripts */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white headline">Add New Verse Script</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter the details of your UEFN Verse script below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">Script Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Create a weather system" 
                className="bg-black border-zinc-700 text-white"
                value={newScriptTitle}
                onChange={(e) => setNewScriptTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-300">Category</Label>
              <Select value={newScriptCategory} onValueChange={(value: any) => setNewScriptCategory(value)}>
                <SelectTrigger className="bg-black border-zinc-700 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="mechanics" className="text-verse-blue">Game Mechanics</SelectItem>
                  <SelectItem value="ui-inventory" className="text-verse-green">UI & Inventory Systems</SelectItem>
                  <SelectItem value="visual" className="text-verse-red">Visual Effects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-zinc-300">Verse Code</Label>
              <Textarea 
                id="code" 
                placeholder="// Enter your Verse code here"
                className="bg-black border-zinc-700 text-white font-mono h-40"
                value={newScriptCode}
                onChange={(e) => setNewScriptCode(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleSubmitNewScript} className="bg-verse-blue hover:bg-verse-blue/80 text-white border-none">
              Add Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings component */}
      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};

export default Index;
