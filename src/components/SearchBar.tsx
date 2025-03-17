
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onAddScript?: () => void;
}

const SearchBar = ({ onAddScript }: SearchBarProps) => {
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
          className="bg-transparent border-verse-blue text-verse-blue hover:bg-verse-blue hover:bg-opacity-10 text-sm font-mono"
        >
          Generate Script /↵
        </Button>
        
        {onAddScript && (
          <Button 
            variant="outline"
            onClick={onAddScript}
            className="bg-transparent border-verse-green text-verse-green hover:bg-verse-green hover:bg-opacity-10 text-sm font-mono"
          >
            <Plus size={16} className="mr-1" /> Add Script
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
