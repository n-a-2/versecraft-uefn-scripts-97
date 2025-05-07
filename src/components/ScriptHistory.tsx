
import React, { useState } from 'react';
import { SavedScript } from '@/services/aiService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Code, Copy, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import CodeEditor from '@/components/CodeEditor';
import { toast } from 'sonner';

interface ScriptHistoryProps {
  scripts: SavedScript[];
  onSelect: (script: SavedScript) => void;
  onDelete: (id: string) => void;
}

const ScriptHistory: React.FC<ScriptHistoryProps> = ({ scripts, onSelect, onDelete }) => {
  const [viewScript, setViewScript] = useState<SavedScript | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const formatTimeAgo = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  if (scripts.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500">
        <Code className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No generated scripts yet.</p>
        <p className="text-sm">Your generated code will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[500px]">
        <div className="space-y-2 p-2">
          {scripts.map((script) => (
            <div 
              key={script.id} 
              className="p-3 border border-zinc-800 rounded-md bg-black bg-opacity-60 hover:bg-zinc-900 transition-colors cursor-pointer"
              onClick={() => onSelect(script)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm text-white truncate max-w-[80%]" title={script.title}>
                  {script.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewScript(script);
                    }}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(script.id || '');
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-xs text-zinc-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(script.timestamp)}</span>
                <span className="mx-1">•</span>
                <span className="bg-verse-blue bg-opacity-20 text-verse-blue px-1.5 py-0.5 rounded text-[10px]">
                  {script.model.replace('gemini-', '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!viewScript} onOpenChange={(open) => !open && setViewScript(null)}>
        <DialogContent className="bg-zinc-900 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewScript?.title}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Generated {viewScript ? formatTimeAgo(viewScript.timestamp) : ''} with temperature {viewScript?.temperature}
            </DialogDescription>
          </DialogHeader>
          
          {viewScript && (
            <div className="mt-2">
              <CodeEditor code={viewScript.content} readOnly={true} />
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300"
              onClick={() => setViewScript(null)}
            >
              Close
            </Button>
            <Button 
              onClick={() => viewScript && handleCopyCode(viewScript.content)}
              className="bg-verse-blue hover:bg-verse-blue/80"
            >
              <Copy className="h-4 w-4 mr-2" /> Copy Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScriptHistory;
