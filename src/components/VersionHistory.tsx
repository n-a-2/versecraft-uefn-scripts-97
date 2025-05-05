
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GitBranch, Clock, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { toast } from 'sonner';

interface ScriptVersion {
  id: string;
  timestamp: string;
  description: string;
  authorName: string;
  code: string;
}

interface VersionHistoryProps {
  scriptId: string;
  currentVersion: ScriptVersion;
  versions: ScriptVersion[];
  onRestore?: (version: ScriptVersion) => void;
}

// Function to compute line-by-line diff
const computeDiff = (oldText: string, newText: string) => {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  const result: Array<{
    type: 'unchanged' | 'added' | 'removed';
    lineNumber: number;
    content: string;
  }> = [];
  
  // Very basic diff algorithm - in a real app you'd use a proper diff library
  let i = 0, j = 0;
  
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      // Lines are the same
      result.push({
        type: 'unchanged',
        lineNumber: j + 1,
        content: newLines[j]
      });
      i++;
      j++;
    } else if (j < newLines.length && (i >= oldLines.length || oldLines[i] !== newLines[j])) {
      // Line was added
      result.push({
        type: 'added',
        lineNumber: j + 1,
        content: newLines[j]
      });
      j++;
    } else if (i < oldLines.length) {
      // Line was removed
      result.push({
        type: 'removed',
        lineNumber: i + 1,
        content: oldLines[i]
      });
      i++;
    }
  }
  
  return result;
};

const VersionHistory: React.FC<VersionHistoryProps> = ({
  scriptId,
  currentVersion,
  versions,
  onRestore
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ScriptVersion | null>(null);
  const [diffMode, setDiffMode] = useState(false);
  
  const handleRestore = () => {
    if (selectedVersion && onRestore) {
      onRestore(selectedVersion);
      toast.success(`Restored to version from ${selectedVersion.timestamp}`);
    }
  };
  
  const handleToggleDiffMode = () => {
    setDiffMode(!diffMode);
  };
  
  // If a version is selected, compute diff
  const diff = selectedVersion 
    ? computeDiff(selectedVersion.code, currentVersion.code)
    : [];
    
  // Format date for display
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold font-mono headline mb-2">Version History</h2>
        <p className="text-zinc-400 text-sm">Compare and restore previous versions of your script</p>
      </div>
      
      <div className="flex h-[600px]">
        {/* Versions List */}
        <div className="w-1/3 border-r border-zinc-800">
          <div className="p-3 border-b border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-zinc-400" />
              <span>Version History</span>
            </div>
          </div>
          <ScrollArea className="h-[550px]">
            <div className="divide-y divide-zinc-800">
              <div className="p-3 bg-verse-blue/20 border-l-2 border-verse-blue">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-sm font-medium">Current Version</div>
                    <div className="text-xs text-zinc-400 mt-1">{formatDate(currentVersion.timestamp)}</div>
                  </div>
                  <div className="px-2 py-1 rounded text-xs bg-verse-blue/20 text-verse-blue">
                    Current
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-300">{currentVersion.description}</div>
                <div className="mt-1 text-xs text-zinc-400">By {currentVersion.authorName}</div>
              </div>
              
              {versions.map(version => (
                <div 
                  key={version.id}
                  className={`p-3 cursor-pointer hover:bg-zinc-800 ${selectedVersion?.id === version.id ? 'bg-zinc-800 border-l-2 border-verse-green' : ''}`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-sm font-medium">Version {version.id}</div>
                      <div className="text-xs text-zinc-400 mt-1">{formatDate(version.timestamp)}</div>
                    </div>
                    <GitBranch size={14} className="text-zinc-400" />
                  </div>
                  <div className="mt-2 text-xs text-zinc-300">{version.description}</div>
                  <div className="mt-1 text-xs text-zinc-400">By {version.authorName}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Code View */}
        <div className="flex-1">
          {selectedVersion ? (
            <>
              <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setSelectedVersion(null)}
                  >
                    <ArrowLeft size={14} className="mr-1" /> Back
                  </Button>
                  <div className="text-sm">
                    {diffMode ? 'Showing differences' : 'Comparing versions'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${diffMode ? 'bg-zinc-800' : ''}`}
                    onClick={handleToggleDiffMode}
                  >
                    Show Diff
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-xs bg-verse-green hover:bg-verse-green/80"
                    onClick={handleRestore}
                  >
                    Restore This Version
                  </Button>
                </div>
              </div>
              
              {diffMode ? (
                <ScrollArea className="h-[550px] p-4">
                  <div className="bg-black rounded-md font-mono text-sm p-4">
                    {diff.map((line, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-start ${
                          line.type === 'added' ? 'bg-green-900/20 text-green-300' : 
                          line.type === 'removed' ? 'bg-red-900/20 text-red-300' : ''
                        }`}
                      >
                        <div className="w-8 text-right pr-2 text-zinc-500 select-none text-xs">
                          {line.lineNumber}
                        </div>
                        <div className="w-6 flex justify-center text-xs">
                          {line.type === 'added' && <Plus size={12} className="text-green-400" />}
                          {line.type === 'removed' && <Minus size={12} className="text-red-400" />}
                        </div>
                        <div className="flex-1">{line.content}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Tabs defaultValue="current">
                  <div className="border-b border-zinc-800">
                    <TabsList className="w-full h-10 bg-transparent rounded-none">
                      <TabsTrigger 
                        value="selected" 
                        className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-verse-green data-[state=active]:shadow-none rounded-none"
                      >
                        Selected Version
                      </TabsTrigger>
                      <TabsTrigger 
                        value="current" 
                        className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-verse-blue data-[state=active]:shadow-none rounded-none"
                      >
                        Current Version
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="selected" className="m-0 h-[510px]">
                    <CodeEditor code={selectedVersion.code} />
                  </TabsContent>
                  
                  <TabsContent value="current" className="m-0 h-[510px]">
                    <CodeEditor code={currentVersion.code} />
                  </TabsContent>
                </Tabs>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <GitBranch size={48} className="mb-4 opacity-30" />
              <p className="text-lg mb-2">Select a version to compare</p>
              <p className="text-sm">Choose a previous version from the left panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
