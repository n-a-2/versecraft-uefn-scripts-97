
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Github, Settings, User } from 'lucide-react';
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
import { toast } from 'sonner';

interface HeaderProps {
  className?: string;
  onOpenSettings?: () => void;
}

const Header = ({ className, onOpenSettings }: HeaderProps) => {
  const [isGithubDialogOpen, setIsGithubDialogOpen] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');

  const handleGithubConnect = () => {
    if (!githubUsername || !githubToken) {
      toast.error("Please enter both username and token");
      return;
    }
    
    // Store GitHub credentials in localStorage
    localStorage.setItem('github_username', githubUsername);
    localStorage.setItem('github_token', githubToken);
    
    toast.success("GitHub connected successfully!");
    setIsGithubDialogOpen(false);
  };

  return (
    <header className={cn("border-b border-zinc-800 py-4", className)}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-lg font-bold headline font-mono">VerseCraft</div>
          <div className="ml-4 space-x-4 hidden md:flex">
            <button className="text-sm text-zinc-400 hover:text-white">Scripts</button>
            <button className="text-sm text-zinc-400 hover:text-white">Documentation</button>
            <a 
              href="https://github.com/i27n/AiAgent-UEFN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <Github size={14} />
              <span>Github</span>
            </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsGithubDialogOpen(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-zinc-800 rounded-md text-sm text-zinc-300 hover:bg-zinc-700"
          >
            <Github size={14} />
            <span className="hidden sm:inline">Connect GitHub</span>
          </button>
          
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings} 
              className="flex items-center space-x-1 px-3 py-1 bg-zinc-800 rounded-md text-sm text-zinc-300 hover:bg-zinc-700"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}
          
          <button className="flex items-center space-x-1 px-3 py-1 bg-verse-red rounded-md text-sm text-white hover:bg-verse-red/80">
            <User size={14} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
      
      {/* GitHub Connection Dialog */}
      <Dialog open={isGithubDialogOpen} onOpenChange={setIsGithubDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Connect to GitHub</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Connect your GitHub account to save scripts, create repositories, and manage your Verse UEFN code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">GitHub Username</Label>
              <Input 
                id="username" 
                placeholder="github@nn6n" 
                className="bg-black border-zinc-700 text-white"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="token" className="text-zinc-300">
                Personal Access Token 
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-verse-blue text-xs hover:underline"
                >
                  (Get one here)
                </a>
              </Label>
              <Input 
                id="token" 
                type="password"
                placeholder="ghp_xxxxxxxxxxxx" 
                className="bg-black border-zinc-700 text-white"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGithubDialogOpen(false)} className="bg-transparent border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleGithubConnect} className="bg-verse-blue hover:bg-verse-blue/80 text-white border-none">
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
