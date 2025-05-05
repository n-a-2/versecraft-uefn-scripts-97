
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import CodeEditor from './CodeEditor';

const DocumentationViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample documentation data
  const documentationSections = [
    {
      id: 'basics',
      title: 'Verse Basics',
      content: `Verse is a programming language created for Fortnite's UEFN (Unreal Editor For Fortnite).
      
It uses a syntax similar to C# and Swift, with some unique features specific to Fortnite's Creative mode.`,
      examples: [
        {
          title: 'Hello World',
          code: `using { /Script/VerseEngine }

hello_world := class(creative_device):
    # This function prints "Hello, World!" to the console
    OnBegin<override>()<suspends>:void=
        Print("Hello, World!")
`
        }
      ]
    },
    {
      id: 'variables',
      title: 'Variables & Data Types',
      content: `Verse supports various data types including:
- Basic types: int, float, string, bool
- Vector types: vector2, vector3 
- Game types: player, agent, team, device`,
      examples: [
        {
          title: 'Variable Declaration',
          code: `# Variable examples
PlayerName : string = "Ninja"
PlayerScore : int = 100
IsAlive : bool = true
Position : vector3 = vector3{X:=0.0, Y:=0.0, Z:=0.0}
`
        }
      ]
    },
    {
      id: 'functions',
      title: 'Functions',
      content: `Functions in Verse allow you to create reusable code blocks. 
Functions can be synchronous or asynchronous (suspends).`,
      examples: [
        {
          title: 'Function Declaration',
          code: `# Basic function
CalculateDamage(BaseDamage : float, ArmorValue : float) : float =
    return BaseDamage * (100.0 / (100.0 + ArmorValue))

# Asynchronous function with suspends
WaitAndPrint(Message : string, Seconds : float)<suspends> : void =
    Sleep(Seconds)
    Print(Message)
`
        }
      ]
    },
    {
      id: 'classes',
      title: 'Classes & Objects',
      content: `Verse uses classes to create reusable object templates. Classes can inherit from other classes and implement interfaces.`,
      examples: [
        {
          title: 'Class Declaration',
          code: `# Simple class example
weapon := class:
    Damage : float = 10.0
    Name : string = "Default Weapon"
    
    Fire(Target : agent) : void =
        Print("Firing {Name} at {Target}")

# Inheritance
shotgun := class(weapon):
    Pellets : int = 8
    
    # Override the Fire method
    Fire(Target : agent)<override> : void =
        Print("Firing {Pellets} pellets at {Target}")
`
        }
      ]
    },
    {
      id: 'arrays',
      title: 'Arrays & Collections',
      content: `Verse supports arrays and maps for storing collections of data.`,
      examples: [
        {
          title: 'Array Examples',
          code: `# Array declaration
PlayerNames : []string = array{"Player1", "Player2", "Player3"}

# Accessing elements
FirstPlayer : string = PlayerNames[0]

# Iterating through an array
for (Name : string in PlayerNames):
    Print(Name)
`
        }
      ]
    }
  ];

  const filteredSections = documentationSections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold font-mono headline mb-2">Verse Documentation</h2>
        <p className="text-zinc-400 text-sm mb-4">Official reference for Verse UEFN language</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full bg-black border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <div className="border-b border-zinc-800 overflow-x-auto">
          <TabsList className="bg-transparent p-0 h-auto rounded-none">
            {documentationSections.map(section => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="py-2 px-4 data-[state=active]:bg-black data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-verse-blue data-[state=active]:rounded-none font-mono rounded-none"
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="h-96">
          {documentationSections.map(section => (
            <TabsContent key={section.id} value={section.id} className="p-4 pt-6">
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <div className="text-zinc-300 mb-6 whitespace-pre-line">{section.content}</div>
              
              {section.examples.map((example, index) => (
                <div key={index} className="mt-4">
                  <h4 className="text-verse-green font-mono mb-2">{example.title}</h4>
                  <CodeEditor 
                    code={example.code} 
                    className="mb-4"
                  />
                </div>
              ))}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default DocumentationViewer;
