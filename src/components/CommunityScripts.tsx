
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ThumbsUp, ThumbsDown, MessageSquare, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import CodeEditor from './CodeEditor';

interface CommunityScript {
  id: string;
  title: string;
  author: string;
  code: string;
  description: string;
  tags: string[];
  votes: {
    upvotes: number;
    downvotes: number;
  };
  comments: number;
  stars: number;
  downloads: number;
  created: string;
}

const SAMPLE_SCRIPTS: CommunityScript[] = [
  {
    id: 'script-1',
    title: 'Advanced Movement System',
    author: 'FortniteDevPro',
    code: `using { /Script/FortniteGame }

movement_system := class(creative_device):
    # Configuration variables
    @editable
    JumpHeight : float = 2.0
    
    @editable
    MoveSpeed : float = 1.2
    
    @editable
    SprintMultiplier : float = 1.5
    
    # Reference to the player character
    var PlayerCharacter : ?player = none
    
    # Called when the device is started in-game
    OnBegin<override>()<suspends>:void=
        SetupPlayer()
        
    # Sets up the player character with custom movement
    SetupPlayer()<suspends>:void=
        # Wait for a player to join
        Player := GetPlayspace().AwaitPlayerAdded()
        if (Player = PlayerCharacter):
            return
            
        PlayerCharacter = Player
        Print("Setting up movement for {Player.GetName()}")
        
        # Apply movement settings
        Player.SetJumpHeight(JumpHeight)
        Player.SetMoveSpeed(MoveSpeed)
        
        # Monitor sprint state
        loop:
            if (Player.IsSprintButtonHeld()):
                Player.SetMoveSpeedMultiplier(SprintMultiplier)
            else:
                Player.SetMoveSpeedMultiplier(1.0)
            Sleep(0.1)`,
    description: 'A comprehensive movement system with configurable jump height, move speed and sprint capabilities. Perfect for custom game modes.',
    tags: ['movement', 'player', 'physics', 'controller'],
    votes: {
      upvotes: 342,
      downvotes: 21
    },
    comments: 14,
    stars: 56,
    downloads: 127,
    created: '2024-04-12'
  },
  {
    id: 'script-2',
    title: 'Day/Night Cycle System',
    author: 'VerseWizard',
    code: `using { /Script/VerseEngine }

day_night_cycle := class(creative_device):
    # Configuration
    @editable
    CycleDurationMinutes : float = 10.0
    
    @editable
    StartTimeOfDay : float = 8.0  # 24-hour format (8.0 = 8:00 AM)
    
    var CurrentTime : float = 0.0
    
    # Called when the device is started in-game
    OnBegin<override>()<suspends>:void=
        # Initialize time
        CurrentTime = StartTimeOfDay
        
        # Start the time cycle
        spawn { RunTimeCycle() }
        
    # Runs the continuous time cycle
    RunTimeCycle()<suspends>:void=
        # Calculate time units
        TimePerSecond := 24.0 / (CycleDurationMinutes * 60.0)
        
        loop:
            # Update time
            CurrentTime += TimePerSecond
            if (CurrentTime >= 24.0):
                CurrentTime -= 24.0
            
            # Update lighting
            UpdateLighting()
            
            # Wait for next update
            Sleep(1.0)
    
    # Updates the world lighting based on time of day
    UpdateLighting():void=
        # Calculate sun angle based on time (0-1 range)
        TimeNormalized := CurrentTime / 24.0
        SunAngle := TimeNormalized * 360.0
        
        # Update directional light
        GetLightingManager().SetSunAngle(SunAngle)
        
        # Determine if it's night time (7PM - 5AM)
        IsNight := CurrentTime > 19.0 or CurrentTime < 5.0
        
        # Enable stars and moon during night
        GetLightingManager().SetStarsVisible(IsNight)
        GetLightingManager().SetMoonVisible(IsNight)
        
        # Log current time
        Hour := Floor(CurrentTime)
        Minute := Floor((CurrentTime - Hour) * 60.0)
        Print("Current time: {Hour}:{Minute}")`,
    description: 'Implements a realistic day/night cycle with configurable duration. Includes automatic lighting updates and celestial body visibility.',
    tags: ['environment', 'lighting', 'time', 'effects'],
    votes: {
      upvotes: 205,
      downvotes: 8
    },
    comments: 23,
    stars: 41,
    downloads: 98,
    created: '2024-04-18'
  },
  {
    id: 'script-3',
    title: 'Inventory Grid System',
    author: 'UEFNMaster',
    code: `using { /Script/FortniteGame }

# Define the inventory item structure
inventory_item := class:
    Name : string = "Item"
    Description : string = ""
    StackSize : int = 1
    MaxStack : int = 99
    Icon : string = "Default"
    Weight : float = 1.0
    Rarity : int = 0
    
# Define the inventory grid system
grid_inventory := class(creative_device):
    # Configuration
    @editable
    GridWidth : int = 6
    
    @editable
    GridHeight : int = 4
    
    # Storage for the grid cells
    var Grid : [][]?inventory_item = array{}
    
    # Initialize the inventory grid
    OnBegin<override>()<suspends>:void=
        InitializeGrid()
        Print("Inventory system initialized with {GridWidth}x{GridHeight} grid")
        
    # Set up empty grid
    InitializeGrid():void=
        Grid = array{}
        
        # Create empty rows
        for (Y := 0..GridHeight-1):
            Row := array{}
            
            # Create empty cells in row
            for (X := 0..GridWidth-1):
                Row += array{none}
                
            Grid += array{Row}
                
    # Add an item to the inventory at specific coordinates
    AddItemAt(Item : inventory_item, X : int, Y : int):bool=
        # Ensure coordinates are valid
        if (X < 0 or X >= GridWidth or Y < 0 or Y >= GridHeight):
            Print("Invalid coordinates: {X},{Y}")
            return false
            
        # Check if cell is empty
        if (Grid[Y][X] = none):
            Grid[Y][X] = Item
            Print("Added {Item.Name} at {X},{Y}")
            return true
            
        # Cell is occupied
        Print("Cell {X},{Y} is already occupied")
        return false
        
    # Try to add an item to the first available slot
    AddItem(Item : inventory_item):bool=
        for (Y := 0..GridHeight-1):
            for (X := 0..GridWidth-1):
                if (Grid[Y][X] = none):
                    Grid[Y][X] = Item
                    Print("Added {Item.Name} at {X},{Y}")
                    return true
                    
        Print("Inventory is full")
        return false
        
    # Remove an item from the grid
    RemoveItemAt(X : int, Y : int):?inventory_item=
        # Ensure coordinates are valid
        if (X < 0 or X >= GridWidth or Y < 0 or Y >= GridHeight):
            Print("Invalid coordinates: {X},{Y}")
            return none
            
        # Store item before removal
        RemovedItem := Grid[Y][X]
        
        # Clear the cell
        Grid[Y][X] = none
        
        if (RemovedItem?):
            Print("Removed {RemovedItem.Name} from {X},{Y}")
            
        return RemovedItem`,
    description: 'A flexible grid-based inventory system with support for item stacking, grid resizing, and item properties.',
    tags: ['inventory', 'ui', 'items', 'system'],
    votes: {
      upvotes: 178,
      downvotes: 15
    },
    comments: 19,
    stars: 32,
    downloads: 76,
    created: '2024-04-22'
  }
];

const CommunityScripts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'downloads'>('popular');
  const [openScript, setOpenScript] = useState<CommunityScript | null>(null);

  // Combine all tags from scripts
  const allTags = Array.from(
    new Set(SAMPLE_SCRIPTS.flatMap(script => script.tags))
  ).sort();

  // Filter and sort scripts
  const filteredScripts = SAMPLE_SCRIPTS
    .filter(script => {
      // Search filter
      const matchesSearch = 
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tags filter (if tags are selected)
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.every(tag => script.tags.includes(tag));
        
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      // Sort based on selected criteria
      if (sortBy === 'popular') {
        return (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes);
      } else if (sortBy === 'recent') {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      } else { // downloads
        return b.downloads - a.downloads;
      }
    });

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleVote = (scriptId: string, isUpvote: boolean) => {
    toast.success(`${isUpvote ? 'Upvoted' : 'Downvoted'} script`);
  };

  const handleStarScript = (scriptId: string) => {
    toast.success('Script starred');
  };

  const handleDownloadScript = (script: CommunityScript) => {
    // Create a blob and download
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, '_')}.verse`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Script downloaded');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold font-mono headline mb-2">Community Scripts</h2>
        <p className="text-zinc-400 text-sm mb-4">Discover and share Verse scripts from the community</p>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search scripts by title, description, or author..."
            className="w-full bg-black border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"} 
              className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-verse-blue' : 'hover:bg-zinc-800'}`}
              onClick={() => handleToggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-zinc-400">
            {filteredScripts.length} scripts found
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Sort by:</span>
            <Tabs value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <TabsList className="h-8 bg-zinc-800">
                <TabsTrigger value="popular" className="text-xs h-6">Popular</TabsTrigger>
                <TabsTrigger value="recent" className="text-xs h-6">Recent</TabsTrigger>
                <TabsTrigger value="downloads" className="text-xs h-6">Downloads</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {openScript ? (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setOpenScript(null)}
              className="text-sm text-verse-blue hover:underline"
            >
              ← Back to scripts
            </button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs flex items-center gap-1 border-verse-green text-verse-green hover:bg-verse-green/10"
                onClick={() => handleStarScript(openScript.id)}
              >
                <Star size={14} /> Star
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs flex items-center gap-1 border-verse-blue text-verse-blue hover:bg-verse-blue/10"
                onClick={() => handleDownloadScript(openScript)}
              >
                <Download size={14} /> Download
              </Button>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{openScript.title}</h3>
          <div className="text-sm text-zinc-400 mb-4">
            By {openScript.author} • Created {openScript.created}
          </div>
          
          <p className="text-zinc-300 mb-4">{openScript.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {openScript.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-zinc-800">{tag}</Badge>
            ))}
          </div>
          
          <CodeEditor code={openScript.code} className="mb-4" />
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button onClick={() => handleVote(openScript.id, true)}>
                  <ThumbsUp size={16} className="text-zinc-400 hover:text-verse-green" />
                </button>
                <span className="text-sm">{openScript.votes.upvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleVote(openScript.id, false)}>
                  <ThumbsDown size={16} className="text-zinc-400 hover:text-verse-red" />
                </button>
                <span className="text-sm">{openScript.votes.downvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={16} className="text-zinc-400" />
                <span className="text-sm">{openScript.comments}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Download size={16} className="text-zinc-400" />
              <span className="text-sm">{openScript.downloads} downloads</span>
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filteredScripts.map(script => (
              <div 
                key={script.id} 
                className="border border-zinc-800 rounded-md p-4 hover:border-zinc-700 transition-all cursor-pointer"
                onClick={() => setOpenScript(script)}
              >
                <h3 className="text-lg font-bold font-mono mb-1">{script.title}</h3>
                <div className="text-sm text-zinc-400 mb-2">By {script.author}</div>
                <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{script.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {script.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs bg-zinc-800">{tag}</Badge>
                  ))}
                  {script.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-zinc-800">+{script.tags.length - 3}</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={14} className="text-zinc-400" />
                      <span className="text-xs">{script.votes.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} className="text-zinc-400" />
                      <span className="text-xs">{script.comments}</span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400">{script.downloads} downloads</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CommunityScripts;
