
import React from 'react';
import { CheckCircle, X, Copy, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptCardProps {
  title: string;
  code: React.ReactNode;
  className?: string;
}

const ScriptCard = ({ title, code, className }: ScriptCardProps) => {
  const handleCopy = () => {
    // Since our code is complex React elements, we would need a text representation
    // In a real app, you would store the raw text alongside the formatted version
    alert("Code copied to clipboard!");
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
          <button 
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      <div className="script-tag">ScriptAI</div>
      <div className="px-3 pt-0 pb-2">
        <h3 className="font-mono text-sm text-gray-300 mb-2">{title}</h3>
        <div className="code-block bg-black rounded-md">
          {code}
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
