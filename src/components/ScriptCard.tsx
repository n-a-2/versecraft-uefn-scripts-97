
import React, { useState } from 'react';
import { Check, X, Maximize, Copy, Trash, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ScriptCardProps {
  title: string;
  code: React.ReactNode;
  className?: string;
  onDelete?: () => void;
}

const ScriptCard = ({ title, code, className, onDelete }: ScriptCardProps) => {
  const [copied, setCopied] = useState(false);
  
  // Helper function to safely convert ReactNode to string
  const getCodeAsString = (): string => {
    if (typeof code === 'string') {
      return code;
    }
    
    if (React.isValidElement(code)) {
      try {
        // Handle Fragment or other elements with children
        if (code.props && code.props.children) {
          const extractText = (node: React.ReactNode): string => {
            if (node === null || node === undefined) return '';
            
            if (typeof node === 'string') return node;
            if (typeof node === 'number') return String(node);
            
            if (Array.isArray(node)) {
              return node.map(extractText).join('');
            }
            
            if (React.isValidElement(node)) {
              if (node.props && node.props.children) {
                return extractText(node.props.children);
              }
              return '';
            }
            
            // Fallback
            return String(node);
          };
          
          return extractText(code.props.children);
        }
        return '';
      } catch (error) {
        console.error('Failed to extract text from React element:', error);
        return '';
      }
    }
    
    // Fallback - convert to string
    return String(code || '');
  };
  
  const handleCopy = () => {
    const codeText = getCodeAsString();
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleDownload = () => {
    const codeText = getCodeAsString();
    const blob = new Blob([codeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/["']/g, '')}.verse`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Script downloaded successfully!");
  };

  // Function to safely render the code content
  const renderCodeContent = () => {
    // If it's already wrapped in a component with proper rendering structure, use it
    if (React.isValidElement(code)) {
      return code;
    }
    
    // If it's a string, format it with line numbers
    if (typeof code === 'string') {
      return code.split('\n').map((line, index) => (
        <div key={index} className="flex space-x-2 text-xs mb-1">
          <span className="text-zinc-500">{index + 1}</span>
          <span className="">{line}</span>
        </div>
      ));
    }
    
    // Fallback - convert to string and format
    const stringCode = String(code || '');
    return stringCode.split('\n').map((line, index) => (
      <div key={index} className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">{index + 1}</span>
        <span className="">{line}</span>
      </div>
    ));
  };

  return (
    <div className={cn("script-card relative bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-700 transition-all", className)}>
      <div className="p-2 pb-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <button className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={14} className="text-black" />
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
              onClick={handleDownload}
              className="text-zinc-400 hover:text-verse-blue transition-colors"
              aria-label="Download code"
            >
              <Download size={16} />
            </button>
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
      <div className="absolute top-3 right-3 bg-verse-red text-white text-xs px-2 py-0.5 rounded-sm font-mono z-10">ScriptAI</div>
      <div className="px-3 pt-0 pb-2">
        <h3 className="font-mono text-sm text-gray-300 mb-2">{title}</h3>
        <ScrollArea className="code-scroll-area h-[180px]">
          <div className="code-block bg-black rounded-md">
            {renderCodeContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScriptCard;
