
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
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
      <div className="mt-4 text-center">
        <Button 
          variant="outline" 
          className="bg-transparent border-verse-blue text-verse-blue hover:bg-verse-blue hover:bg-opacity-10 text-sm font-mono"
        >
          Generate Script /↵
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
