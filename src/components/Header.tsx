
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("border-b border-zinc-800 py-4", className)}>
      <div className="container flex justify-between items-center">
        <div className="text-lg font-bold">VerseCraft</div>
        <div className="flex items-center space-x-4">
          <button className="text-sm text-zinc-400 hover:text-white">Sign Up</button>
          <button className="text-sm text-white">Sign In</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
