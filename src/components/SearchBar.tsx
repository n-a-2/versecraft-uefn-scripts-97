
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  return (
    <div className="w-full max-w-xl mx-auto relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <input
          className="w-full bg-black bg-opacity-60 border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          type="text"
          placeholder="Create a realistic physics-based player movement system which allows for smooth transitioning..."
        />
      </div>
      <div className="mt-4 text-center">
        <Button variant="outline" className="bg-transparent border-zinc-700 text-gray-300 hover:bg-zinc-800 text-sm">
          Generate Script /↵
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
