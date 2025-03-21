
import React, { useState } from 'react';
import { Search, Plus, Zap, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SearchBarProps {
  onAddScript?: () => void;
  onGenerateScript?: (prompt: string) => void;
}

const SearchBar = ({ onAddScript, onGenerateScript }: SearchBarProps) => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  const handleApiKeySave = () => {
    if (!geminiApiKey) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    localStorage.setItem('gemini_api_key', geminiApiKey);
    toast.success("API key saved successfully!");
    setApiKeyDialogOpen(false);
  };

  const handleGenerate = () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error("Please set your Gemini API key first");
      setApiKeyDialogOpen(true);
      return;
    }
    
    if (!generatePrompt) {
      toast.error("Please enter a prompt to generate code");
      return;
    }
    
    if (onGenerateScript) {
      onGenerateScript(generatePrompt);
      setGenerateDialogOpen(false);
      setGeneratePrompt('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <input
          className="w-full bg-black bg-opacity-60 border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-verse-blue"
          type="text"
          placeholder="Search for Verse UEFN scripts (e.g., physics movement, inventory systems)..."
        />
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <Button 
          variant="outline" 
          className="bg-transparent border-verse-blue text-verse-blue hover:bg-verse-blue hover:bg-opacity-10 text-sm font-mono flex items-center"
          onClick={() => setGenerateDialogOpen(true)}
        >
          <Wand2 size={16} className="mr-1" />
          Generate Script /↵
        </Button>
        
        {onAddScript && (
          <Button 
            variant="outline"
            onClick={onAddScript}
            className="bg-transparent border-verse-green text-verse-green hover:bg-verse-green hover:bg-opacity-10 text-sm font-mono flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Script
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => setApiKeyDialogOpen(true)}
          className="bg-transparent border-verse-red text-verse-red hover:bg-verse-red hover:bg-opacity-10 text-sm font-mono flex items-center"
        >
          <Zap size={16} className="mr-1" /> Set API Key
        </Button>
      </div>
      
      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Set Gemini API Key</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your Gemini API key to enable AI-powered code generation.
              <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-verse-blue hover:underline"
              >
                Get a key here.
              </a>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-zinc-300">Gemini API Key</Label>
              <Input 
                id="apiKey" 
                placeholder="AIzaSyBOxxxxxxxYYYY" 
                className="bg-black border-zinc-700 text-white font-mono"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)} className="bg-transparent border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleApiKeySave} className="bg-verse-red hover:bg-verse-red/80 text-white border-none">
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generate Script Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Generate Verse Script</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Describe what you want to create in Verse UEFN and the AI will generate a script for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-zinc-300">Your Prompt</Label>
              <textarea 
                id="prompt" 
                placeholder="Create a weather system that changes over time with rain and lightning effects..." 
                className="w-full h-32 bg-black border border-zinc-700 rounded-md p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-verse-blue resize-none font-mono"
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)} className="bg-transparent border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="bg-verse-blue hover:bg-verse-blue/80 text-white border-none">
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBar;
