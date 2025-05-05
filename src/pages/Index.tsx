
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScriptCard from '@/components/ScriptCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Settings from '@/components/Settings';
import CodeEditor from '@/components/CodeEditor';
import DocumentationViewer from '@/components/DocumentationViewer';
import CommunityScripts from '@/components/CommunityScripts';
import VersionHistory from '@/components/VersionHistory';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Book, Code, Users, GitBranch, Zap, Plus } from 'lucide-react';
import AIService from '@/services/aiService';

// Type for our script data
interface ScriptData {
  id: string;
  title: string;
  code: string | React.ReactNode;
  category: 'mechanics' | 'ui-inventory' | 'visual';
  createdAt: string;
  updatedAt: string;
  author: string;
  versions?: Array<{
    id: string;
    timestamp: string;
    description: string;
    authorName: string;
    code: string;
  }>;
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

// Sample version history data for a script
const sampleVersions = [
  {
    id: 'v1',
    timestamp: '2023-12-15T14:30:00Z',
    description: 'Initial implementation of weather system',
    authorName: 'JohnDev',
    code: `using { /Script/FortniteGame }

weather_system := class(creative_device):
    # Basic implementation
    OnBegin<override>()<suspends>:void=
        Print("Weather system started")
        
    ChangeWeather(Type : string):void=
        Print("Changing weather to {Type}")
`
  },
  {
    id: 'v2',
    timestamp: '2024-01-05T10:15:00Z',
    description: 'Added rain and storm effects',
    authorName: 'JohnDev',
    code: `using { /Script/FortniteGame }

weather_system := class(creative_device):
    # Added basic weather types
    OnBegin<override>()<suspends>:void=
        Print("Weather system started")
        SetWeather("sunny")
        
    SetWeather(Type : string):void=
        Print("Changing weather to {Type}")
        
        if (Type = "rain"):
            ShowRainEffects()
        else if (Type = "storm"):
            ShowStormEffects()
            
    ShowRainEffects():void=
        Print("Showing rain effects")
        
    ShowStormEffects():void=
        Print("Showing storm effects with lightning")
`
  },
  {
    id: 'v3',
    timestamp: '2024-02-10T16:45:00Z',
    description: 'Refactored to use enums and improved performance',
    authorName: 'AliceCode',
    code: `using { /Script/FortniteGame }

# Weather types as enum for type safety
weather_type := enum:
    Sunny
    Cloudy
    Rain
    Storm
    Fog
    Snow

weather_system := class(creative_device):
    # Track current weather
    var CurrentWeather : weather_type = weather_type.Sunny
    
    OnBegin<override>()<suspends>:void=
        Print("Weather system started")
        SetWeather(weather_type.Sunny)
        
    SetWeather(Type : weather_type):void=
        if (CurrentWeather = Type):
            return # No change needed
            
        # Update current state
        CurrentWeather = Type
        
        # Apply effects based on type
        case Type:
            weather_type.Rain => ShowRainEffects()
            weather_type.Storm => ShowStormEffects()
            weather_type.Snow => ShowSnowEffects()
            weather_type.Fog => ShowFogEffects()
            _ => ClearWeatherEffects()
            
    ShowRainEffects():void=
        Print("Showing rain effects")
        
    ShowStormEffects():void=
        Print("Showing storm effects with lightning")
        
    ShowSnowEffects():void=
        Print("Showing snow effects")
        
    ShowFogEffects():void=
        Print("Showing fog effects")
        
    ClearWeatherEffects():void=
        Print("Clearing all weather effects")
`
  }
];

const Index = () => {
  // Initial scripts with more metadata
  const initialScripts: ScriptData[] = [
    {
      id: 'weather-system',
      title: '"make a weather system"',
      code: weatherSystemCode,
      category: 'mechanics',
      createdAt: '2024-03-15T12:30:00Z',
      updatedAt: '2024-05-01T08:15:00Z',
      author: 'JohnDev',
      versions: sampleVersions
    },
    {
      id: 'zombie-spawner',
      title: '"create a zombie spawner"',
      code: zombieSpawnerCode,
      category: 'mechanics',
      createdAt: '2024-03-20T14:45:00Z',
      updatedAt: '2024-03-20T14:45:00Z',
      author: 'AliceCode'
    },
    {
      id: 'player-movement',
      title: '"realistic physics-based player movement"',
      code: playerMovementCode,
      category: 'mechanics',
      createdAt: '2024-03-25T09:30:00Z',
      updatedAt: '2024-04-10T16:20:00Z',
      author: 'MovementGuru'
    },
    {
      id: 'inventory-trigger',
      title: '"create an inventory trigger"',
      code: inventoryTriggerCode,
      category: 'ui-inventory',
      createdAt: '2024-03-12T11:15:00Z',
      updatedAt: '2024-03-12T11:15:00Z',
      author: 'UEFNMaster'
    },
    {
      id: 'grid-inventory',
      title: '"create a grid inventory system"',
      code: gridInventoryCode,
      category: 'ui-inventory',
      createdAt: '2024-03-18T10:00:00Z',
      updatedAt: '2024-04-05T14:30:00Z',
      author: 'InventoryWizard'
    },
    {
      id: 'character-blueprint',
      title: '"blueprint class for a character that can jump, move and animate"',
      code: characterBlueprintCode,
      category: 'ui-inventory',
      createdAt: '2024-03-30T16:45:00Z',
      updatedAt: '2024-03-30T16:45:00Z',
      author: 'CharacterDesigner'
    },
    {
      id: 'particle-system',
      title: '"custom particle system"',
      code: particleSystemCode,
      category: 'visual',
      createdAt: '2024-04-02T13:20:00Z',
      updatedAt: '2024-04-15T09:10:00Z',
      author: 'VFXArtist'
    }
  ];

  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptCategory, setNewScriptCategory] = useState<ScriptData['category']>('mechanics');
  const [newScriptCode, setNewScriptCode] = useState('');
  const [aiService, setAiService] = useState<AIService | null>(null);
  const [activeTab, setActiveTab] = useState('scripts');
  const [selectedScript, setSelectedScript] = useState<ScriptData | null>(null);
  const [editingScript, setEditingScript] = useState<ScriptData | null>(null);
  
  // Get query params
  const location = useLocation();
  const navigate = useNavigate();
  
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
    
    // Check for tab in URL
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['scripts', 'docs', 'community', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);
  
  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`?${params.toString()}`, { replace: true });
  }, [activeTab]);

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

    // Create new script object with metadata
    const now = new Date().toISOString();
    const newScript: ScriptData = {
      id: `script-${Date.now()}`,
      title: `"${newScriptTitle}"`,
      code: newScriptCode,
      category: newScriptCategory,
      createdAt: now,
      updatedAt: now,
      author: 'You'
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
  
  const handleUpdateScript = () => {
    if (!editingScript) return;
    
    const updatedScripts = scripts.map(script => 
      script.id === editingScript.id ? 
        { ...editingScript, updatedAt: new Date().toISOString() } : 
        script
    );
    
    setScripts(updatedScripts);
    localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
    toast.success("Script updated successfully!");
    setEditingScript(null);
  };
  
  const handleCodeChange = (code: string) => {
    if (editingScript) {
      setEditingScript({ ...editingScript, code });
    }
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
        // Create new script from generated code with metadata
        const now = new Date().toISOString();
        const newScript: ScriptData = {
          id: `script-${Date.now()}`,
          title: `"${prompt}"`,
          code: result.content,
          category: 'mechanics', // Default category
          createdAt: now,
          updatedAt: now,
          author: 'AI Generated'
        };
        
        // Add new script to the list
        const updatedScripts = [...scripts, newScript];
        setScripts(updatedScripts);
        
        // Save to localStorage
        localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
        
        toast.success("Code generated successfully!", { id: "generating" });
        
        // Select the newly created script
        setSelectedScript(newScript);
      } else {
        toast.error("Failed to generate code. Please try again.", { id: "generating" });
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("An error occurred during code generation.", { id: "generating" });
    }
  };
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="py-8 text-center">
            <h1 className="text-5xl font-mono mb-2 headline">VerseCraft</h1>
            <h2 className="text-xl text-zinc-400 mb-8">AI-Powered Engine for UEFN Verse Scripts</h2>
            
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar 
                onAddScript={handleAddScript} 
                onGenerateScript={handleGenerateScript}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-zinc-800 mb-6">
              <TabsList className="bg-transparent h-14 mb-4">
                <TabsTrigger 
                  value="scripts" 
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white h-12 px-6"
                >
                  <Code size={18} className="mr-2" />
                  My Scripts
                </TabsTrigger>
                <TabsTrigger 
                  value="docs" 
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white h-12 px-6"
                >
                  <Book size={18} className="mr-2" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger 
                  value="community" 
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white h-12 px-6"
                >
                  <Users size={18} className="mr-2" />
                  Community
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white h-12 px-6"
                >
                  <GitBranch size={18} className="mr-2" />
                  Version History
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="scripts" className="m-0">
              {selectedScript ? (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <button 
                      onClick={() => setSelectedScript(null)}
                      className="text-verse-blue hover:underline font-mono text-sm flex items-center"
                    >
                      ← Back to scripts
                    </button>
                    <div className="flex gap-2">
                      {editingScript ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="border-zinc-700 text-zinc-300"
                            onClick={() => setEditingScript(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="default"
                            className="bg-verse-green hover:bg-verse-green/80"
                            onClick={handleUpdateScript}
                          >
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            className="border-verse-blue text-verse-blue hover:bg-verse-blue/10"
                            onClick={() => setEditingScript(selectedScript)}
                          >
                            Edit Script
                          </Button>
                          <Button 
                            variant="destructive"
                            className="bg-verse-red hover:bg-verse-red/80"
                            onClick={() => {
                              handleDeleteScript(selectedScript.id);
                              setSelectedScript(null);
                            }}
                          >
                            Delete Script
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
                    <h3 className="text-2xl font-bold mb-2">{selectedScript.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-4">
                      <div>Created: {formatDate(selectedScript.createdAt)}</div>
                      <div>Updated: {formatDate(selectedScript.updatedAt)}</div>
                      <div>Author: {selectedScript.author}</div>
                      <div className="capitalize">Category: {selectedScript.category.replace('-', ' & ')}</div>
                    </div>
                    
                    {editingScript ? (
                      <CodeEditor 
                        code={typeof editingScript.code === 'string' ? editingScript.code : ''}
                        readOnly={false}
                        onChange={handleCodeChange}
                      />
                    ) : (
                      <CodeEditor 
                        code={typeof selectedScript.code === 'string' ? selectedScript.code : ''}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-left text-verse-blue font-mono border-l-4 border-verse-blue pl-3 headline text-xl">
                      Game Mechanics
                    </h3>
                    <Button
                      variant="outline"
                      className="border-verse-blue text-verse-blue hover:bg-verse-blue/10 text-sm"
                      onClick={handleAddScript}
                    >
                      <Plus size={16} className="mr-1" /> Add Script
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mechanicsScripts.map(script => (
                      <ScriptCard 
                        key={script.id}
                        title={script.title}
                        code={script.code}
                        onDelete={() => handleDeleteScript(script.id)}
                        className="cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => setSelectedScript(script)}
                      />
                    ))}
                  </div>
                  
                  <h3 className="text-left text-verse-green mb-6 font-mono border-l-4 border-verse-green pl-3 headline text-xl">
                    UI & Inventory Systems
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uiInventoryScripts.map(script => (
                      <ScriptCard 
                        key={script.id}
                        title={script.title}
                        code={script.code}
                        onDelete={() => handleDeleteScript(script.id)}
                        className="cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => setSelectedScript(script)}
                      />
                    ))}
                  </div>
                  
                  <h3 className="text-left text-verse-red mb-6 font-mono border-l-4 border-verse-red pl-3 mt-12 headline text-xl">
                    Visual Effects
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visualScripts.map(script => (
                      <ScriptCard 
                        key={script.id}
                        title={script.title}
                        code={script.code}
                        onDelete={() => handleDeleteScript(script.id)}
                        className="cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => setSelectedScript(script)}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="docs" className="m-0">
              <DocumentationViewer />
            </TabsContent>
            
            <TabsContent value="community" className="m-0">
              <CommunityScripts />
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              {scripts.find(s => s.versions)?.versions ? (
                <VersionHistory 
                  scriptId="weather-system"
                  currentVersion={{
                    id: 'current',
                    timestamp: scripts.find(s => s.id === 'weather-system')?.updatedAt || new Date().toISOString(),
                    description: 'Current version with advanced weather effects and time-based transitions',
                    authorName: scripts.find(s => s.id === 'weather-system')?.author || 'Unknown',
                    code: typeof scripts.find(s => s.id === 'weather-system')?.code === 'string' ? 
                      scripts.find(s => s.id === 'weather-system')?.code as string : 
                      ''
                  }}
                  versions={sampleVersions}
                  onRestore={(version) => {
                    // Handle restore logic
                    const updatedScripts = scripts.map(script => 
                      script.id === 'weather-system' ? 
                        { 
                          ...script, 
                          code: version.code,
                          updatedAt: new Date().toISOString()
                        } : 
                        script
                    );
                    
                    setScripts(updatedScripts);
                    localStorage.setItem('verse_scripts', serializeScriptData(updatedScripts));
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                  <GitBranch size={64} className="mb-4 opacity-30" />
                  <h3 className="text-xl font-bold mb-2">No Version History Available</h3>
                  <p>Your scripts don't have any saved versions yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t border-zinc-800 py-4 mt-8">
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
