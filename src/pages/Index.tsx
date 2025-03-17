
import React from 'react';
import ScriptCard from '@/components/ScriptCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import { 
  weatherSystemCode, 
  zombieSpawnerCode, 
  inventoryTriggerCode, 
  gridInventoryCode,
  characterBlueprintCode,
  particleSystemCode 
} from '@/data/verseScripts';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="py-16 text-center">
          <h1 className="text-5xl font-mono mb-2">Verse Library</h1>
          <h2 className="text-xl text-zinc-400 mb-8">Search Engine for AI Generated Verse Scripts</h2>
          
          <div className="container max-w-xl mx-auto mb-12">
            <SearchBar />
          </div>
          
          <section className="container mx-auto mt-16">
            <h3 className="text-left text-zinc-400 mb-6 font-mono">Featured Generations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <ScriptCard 
                title='"make a weather system"'
                code={weatherSystemCode}
              />
              
              <ScriptCard 
                title='"create a zombie spawner"'
                code={zombieSpawnerCode}
              />
              
              <ScriptCard 
                title='"create an inventory trigger"'
                code={inventoryTriggerCode}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScriptCard 
                title='"Create a grid inventory system"'
                code={gridInventoryCode}
              />
              
              <ScriptCard 
                title='"blueprint class for a character that can jump, move and animate in a 3D platformer"'
                code={characterBlueprintCode}
              />
              
              <ScriptCard 
                title='"custom particle system"'
                code={particleSystemCode}
              />
            </div>
          </section>
        </div>
      </main>
      
      <footer className="border-t border-zinc-800 py-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="text-zinc-500">© 2023 VerseCraft</div>
          <div>
            <a href="#" className="text-zinc-500 hover:text-white">Terms</a>
            <span className="mx-2 text-zinc-700">•</span>
            <a href="#" className="text-zinc-500 hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
