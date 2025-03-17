
import React, { useState } from 'react';
import { CheckCircle, X, Copy, Maximize, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface ScriptCardProps {
  title: string;
  code: React.ReactNode;
  className?: string;
  onDelete?: () => void;
}

const ScriptCard = ({ title, code, className, onDelete }: ScriptCardProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    // In a real app, you would extract and copy the actual code text
    setCopied(true);
    toast.success("Code copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("script-card bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden", className)}>
      <div className="p-2 pb-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <button className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle size={14} className="text-black" />
            </button>
            <button className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <X size={14} className="text-black" />
            </button>
            <button className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
              <Maximize size={14} className="text-white" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {onDelete && (
              <button 
                onClick={onDelete}
                className="text-zinc-400 hover:text-red-400 transition-colors"
                aria-label="Delete script"
              >
                <Trash size={16} />
              </button>
            )}
            <button 
              onClick={handleCopy}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Copy code"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="script-tag">ScriptAI</div>
      <div className="px-3 pt-0 pb-2">
        <h3 className="font-mono text-sm text-gray-300 mb-2">{title}</h3>
        <ScrollArea className="code-scroll-area h-[180px]">
          <div className="code-block bg-black rounded-md">
            {code}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScriptCard;
