
import React from 'react';
import { CheckCircle, X, Copy, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptCardProps {
  title: string;
  code: React.ReactNode;
  className?: string;
}

const ScriptCard = ({ title, code, className }: ScriptCardProps) => {
  return (
    <div className={cn("script-card", className)}>
      <div className="p-4 pb-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-mono text-sm text-center bg-black bg-opacity-50 px-2 py-1 rounded">{title}</h3>
          <div className="flex space-x-1">
            <button className="action-button left-3 text-verse-green">
              <CheckCircle size={16} />
            </button>
            <button className="action-button left-10 text-verse-red">
              <X size={16} />
            </button>
            <button className="action-button left-16">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="script-tag">ScriptAI</div>
      <div className="p-4 pt-0">
        <div className="code-block">
          {code}
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
