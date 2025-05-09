
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Settings = ({ open, onOpenChange }: SettingsProps) => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [maxResults, setMaxResults] = useState('4');
  const [temperature, setTemperature] = useState('0.7');
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  
  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('settings', JSON.stringify({
      darkTheme,
      aiModel,
      maxResults,
      temperature,
      syntaxHighlighting,
      autoSave
    }));
    
    toast.success("Settings saved successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white headline text-xl">Settings</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your VerseCraft AI agent and application preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 bg-zinc-800">
            <TabsTrigger value="general" className="text-zinc-300 data-[state=active]:text-white data-[state=active]:bg-zinc-700">
              General
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-zinc-300 data-[state=active]:text-white data-[state=active]:bg-zinc-700">
              AI Model
            </TabsTrigger>
            <TabsTrigger value="editor" className="text-zinc-300 data-[state=active]:text-white data-[state=active]:bg-zinc-700">
              Editor
            </TabsTrigger>
            <TabsTrigger value="about" className="text-zinc-300 data-[state=active]:text-white data-[state=active]:bg-zinc-700">
              About
            </TabsTrigger>
          </TabsList>
          
          {/* General tab */}
          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-zinc-300">
                    Dark Mode
                  </Label>
                  <Switch 
                    id="dark-mode" 
                    checked={darkTheme} 
                    onCheckedChange={setDarkTheme} 
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Toggle between dark and light theme
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save" className="text-zinc-300">
                    Auto Save
                  </Label>
                  <Switch 
                    id="auto-save" 
                    checked={autoSave} 
                    onCheckedChange={setAutoSave} 
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Automatically save scripts when modified
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* AI Model tab */}
          <TabsContent value="ai" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model" className="text-zinc-300">
                  AI Model
                </Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger id="ai-model" className="bg-black border-zinc-700 text-white">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Faster)</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Better Quality)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  The AI model used for code generation
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-results" className="text-zinc-300">
                  Maximum Results
                </Label>
                <Select value={maxResults} onValueChange={setMaxResults}>
                  <SelectTrigger id="max-results" className="bg-black border-zinc-700 text-white">
                    <SelectValue placeholder="Select max results" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="1">1 result</SelectItem>
                    <SelectItem value="2">2 results</SelectItem>
                    <SelectItem value="4">4 results</SelectItem>
                    <SelectItem value="8">8 results</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  Number of variations to generate
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-zinc-300">
                  Temperature
                </Label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="range" 
                    id="temperature" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm font-mono">{temperature}</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Controls creativity (lower = more deterministic)
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Editor tab */}
          <TabsContent value="editor" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="syntax-highlighting" className="text-zinc-300">
                    Syntax Highlighting
                  </Label>
                  <Switch 
                    id="syntax-highlighting" 
                    checked={syntaxHighlighting} 
                    onCheckedChange={setSyntaxHighlighting} 
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Highlight syntax in code editor
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size" className="text-zinc-300">
                  Font Size
                </Label>
                <Select defaultValue="14">
                  <SelectTrigger id="font-size" className="bg-black border-zinc-700 text-white">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  Code editor font size
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* About tab */}
          <TabsContent value="about" className="mt-4 space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold headline">VerseCraft AI</h3>
              <p className="text-zinc-400 mt-2">Version 1.0.0</p>
              <p className="text-zinc-400 mt-4">
                A powerful AI agent for generating, managing, and understanding Verse UEFN scripts.
              </p>
              <p className="text-zinc-400 mt-2">
                Created with ❤️ by <a href="https://github.com/i27n" target="_blank" rel="noopener noreferrer" className="text-verse-blue hover:underline">github@nn6n</a>
              </p>
              
              <div className="mt-6 p-4 bg-zinc-800 rounded-md text-left">
                <h4 className="font-bold mb-2">API Information</h4>
                <p className="text-sm text-zinc-400">
                  This application uses Google's Gemini API for AI-powered code generation.
                </p>
                <p className="text-sm text-zinc-400 mt-2">
                  To use the AI features, you need to set your API key in the settings.
                </p>
                <a 
                  href="https://ai.google.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-verse-blue hover:underline text-sm mt-2 inline-block"
                >
                  Get a Gemini API key
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-zinc-700 text-zinc-300">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="bg-verse-blue hover:bg-verse-blue/80 text-white border-none">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
