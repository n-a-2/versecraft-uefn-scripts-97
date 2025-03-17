
import React, { useState } from 'react';
import ScriptCard from '@/components/ScriptCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
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

// Type for our script data
interface ScriptData {
  id: string;
  title: string;
  code: React.ReactNode;
  category: 'mechanics' | 'ui-inventory' | 'visual';
}

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

  const [scripts, setScripts] = useState<ScriptData[]>(initialScripts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptCategory, setNewScriptCategory] = useState<ScriptData['category']>('mechanics');
  const [newScriptCode, setNewScriptCode] = useState('');

  // Filter scripts by category
  const mechanicsScripts = scripts.filter(script => script.category === 'mechanics');
  const uiInventoryScripts = scripts.filter(script => script.category === 'ui-inventory');
  const visualScripts = scripts.filter(script => script.category === 'visual');

  const handleAddScript = () => {
    setIsAddDialogOpen(true);
  };

  const handleDeleteScript = (id: string) => {
    setScripts(scripts.filter(script => script.id !== id));
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
      code: (
        <div className="text-left">
          {newScriptCode.split('\n').map((line, index) => (
            <div key={index} className="flex space-x-2 text-xs mb-1">
              <span className="text-zinc-500">{index + 1}</span>
              <span className="">{line}</span>
            </div>
          ))}
        </div>
      ),
      category: newScriptCategory
    };

    // Add new script to the list
    setScripts([...scripts, newScript]);
    
    // Reset form and close dialog
    setNewScriptTitle('');
    setNewScriptCode('');
    setIsAddDialogOpen(false);
    toast.success("New script added successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="py-16 text-center">
          <h1 className="text-5xl font-mono mb-2">Verse Library</h1>
          <h2 className="text-xl text-zinc-400 mb-8">Search Engine for AI Generated Verse Scripts</h2>
          
          <div className="container max-w-xl mx-auto mb-12">
            <SearchBar onAddScript={handleAddScript} />
          </div>
          
          <section className="container mx-auto mt-16">
            <h3 className="text-left text-verse-blue mb-6 font-mono border-l-4 border-verse-blue pl-3">Game Mechanics</h3>
            
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
            
            <h3 className="text-left text-verse-green mb-6 font-mono border-l-4 border-verse-green pl-3">UI & Inventory Systems</h3>
            
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
            
            <h3 className="text-left text-verse-red mb-6 font-mono border-l-4 border-verse-red pl-3 mt-12">Visual Effects</h3>
            
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
          <div className="text-zinc-500">© 2023 VerseCraft</div>
          <div>
            <a href="#" className="text-zinc-500 hover:text-white">Terms</a>
            <span className="mx-2 text-zinc-700">•</span>
            <a href="#" className="text-zinc-500 hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Dialog for adding new scripts */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Verse Script</DialogTitle>
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
    </div>
  );
};

export default Index;
