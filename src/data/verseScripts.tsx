
import React from 'react';

export const weatherSystemCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">27</span>
        <span className=""><span className="text-yellow-300">FadeOutWeatherEffects</span>(<span className="text-purple-400">DeltaTime</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">28</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">29</span>
        <span className="text-zinc-400">// When the fade out is complete, apply the new weather type</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">30</span>
        <span className=""><span className="text-purple-400">if</span> (<span className="text-blue-400">WeatherFadeTimer</span> &lt;= <span className="text-green-400">0.0</span>)</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">31</span>
        <span className="">{`{`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">32</span>
        <span className="pl-4"><span className="text-blue-400">CurrentWeatherType</span> = <span className="text-blue-400">TargetWeatherType</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">33</span>
        <span className="pl-4"><span className="text-yellow-300">ApplyWeatherEffects</span>(<span className="text-blue-400">CurrentWeatherType</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">34</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">35</span>
        <span className="pl-4">{`}`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">36</span>
        <span className="">{`}`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">37</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">38</span>
        <span className=""><span className="text-purple-400">void</span> <span className="text-yellow-300">WeatherSystem:SetWeatherType</span>(<span className="text-blue-400">WeatherType</span> <span className="text-orange-300">NewWeatherType</span>)</span>
      </div>
    </div>
  </>
);

export const zombieSpawnerCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className=""><span className="text-purple-400">void</span> <span className="text-yellow-300">ZombieSpawner::SpawnZombie</span>()</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className="">{`{`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className="pl-4 text-zinc-400">// Spawn a zombie at a random location</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className="pl-4"><span className="text-purple-400">vector3</span> <span className="text-orange-300">SpawnLocation</span> = <span className="text-yellow-300">Math::Random</span>() * <span className="text-blue-400">SpawnRadius</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className="pl-4"><span className="text-yellow-300">GetWorld</span>()-&gt;<span className="text-yellow-300">SpawnActor</span>&lt;<span className="text-blue-400">ZombieClass</span>&gt;(<span className="text-orange-300">SpawnLocation</span>, <span className="text-blue-400">FRotator</span>::<span className="text-yellow-300">ZeroRotator</span>)</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className="">{`}`}</span>
      </div>
    </div>
  </>
);

export const inventoryTriggerCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className=""><span className="text-blue-400">AInventoryTrigger</span>::<span className="text-yellow-300">AInventoryTrigger</span>()</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className="pl-4 text-zinc-400">// Set this actor to call Tick() every frame. You can turn this off to improve performance.</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className="pl-4"><span className="text-blue-400">PrimaryActorTick</span>.<span className="text-yellow-300">bCanEverTick</span> = <span className="text-purple-400">true</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className="pl-4"><span className="text-blue-400">InventorySphere</span> = <span className="text-yellow-300">CreateDefaultSubobject</span>&lt;<span className="text-blue-400">USphereComponent</span>&gt;(<span className="text-green-400">"Inventory Sphere"</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className="pl-4"><span className="text-blue-400">InventorySphere</span>-&gt;<span className="text-yellow-300">InitSphereRadius</span>(<span className="text-green-400">100.0f</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">7</span>
        <span className="pl-4"><span className="text-blue-400">InventorySphere</span>-&gt;<span className="text-yellow-300">SetCollisionProfileName</span>(<span className="text-green-400">"Trigger"</span>);</span>
      </div>
    </div>
  </>
);

export const gridInventoryCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className="text-zinc-400">// Grid Inventory System</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className=""><span className="text-purple-400">using</span>();</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className=""><span className="text-purple-400">inventory_item</span> := <span className="text-purple-400">class</span>:</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className="pl-4"><span className="text-blue-400">Name</span> : <span className="text-purple-400">string</span> = <span className="text-green-400">""</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">7</span>
        <span className="pl-4"><span className="text-blue-400">Width</span> : <span className="text-purple-400">int</span> = <span className="text-green-400">1</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">8</span>
        <span className="pl-4"><span className="text-blue-400">Height</span> : <span className="text-purple-400">int</span> = <span className="text-green-400">1</span></span>
      </div>
    </div>
  </>
);

export const characterBlueprintCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className="text-zinc-400">// Create a CharComponent for collision</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className=""><span className="text-blue-400">CapsuleComponent</span> = <span className="text-yellow-300">CreateCapsuleComponent</span>&lt;<span className="text-blue-400">UCapsuleComponent</span>&gt;(<span className="text-green-400">"CapsuleComponent"</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className="text-zinc-400">// Setup animation</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className=""><span className="text-blue-400">CharacterMesh</span> = <span className="text-yellow-300">CreateDefaultSubObject</span>&lt;<span className="text-blue-400">USkeletalMeshComponent</span>&gt;(<span className="text-green-400">"CharacterMesh"</span>);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className=""><span className="text-blue-400">CharacterMesh</span>-&gt;<span className="text-yellow-300">SetupAttachment</span>(<span className="text-blue-400">CapsuleComponent</span>);</span>
      </div>
    </div>
  </>
);

export const particleSystemCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className=""><span className="text-purple-400">#include</span> <span className="text-green-400">"ParticleSystem.h"</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className=""><span className="text-purple-400">#include</span> <span className="text-green-400">"Particles/ParticleSystem.h"</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className=""><span className="text-purple-400">#include</span> <span className="text-green-400">"Particles/ParticleSystemComponent.h"</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className=""><span className="text-purple-400">void</span> <span className="text-yellow-300">SpawnParticleEffect</span>(<span className="text-purple-400">vector3</span> <span className="text-orange-300">Location</span>)</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className="">{`{`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">7</span>
        <span className="pl-4"><span className="text-blue-400">UParticleSystemComponent</span>* <span className="text-orange-300">ParticleComponent</span> = <span className="text-yellow-300">UGameplayStatics::SpawnEmitterAtLocation</span>(</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">8</span>
        <span className="pl-4 pl-8"><span className="text-yellow-300">GetWorld</span>(), <span className="text-blue-400">ParticleTemplate</span>, <span className="text-orange-300">Location</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">9</span>
        <span className="pl-4">);</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">10</span>
        <span className="">{`}`}</span>
      </div>
    </div>
  </>
);

export const playerMovementCode = (
  <>
    <div className="text-left">
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">1</span>
        <span className="text-zinc-400">// Verse file</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">2</span>
        <span className=""><span className="text-blue-400">using</span> <span className="text-purple-400">{ }</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">3</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">4</span>
        <span className=""><span className="text-purple-400">class</span> <span className="text-blue-400">YOURNAME_API</span> <span className="text-orange-300">ARealisticCharacter</span> : <span className="text-purple-400">public</span> <span className="text-blue-400">ACharacter</span></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">5</span>
        <span className="">{`{`}</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">6</span>
        <span className="pl-4"><span className="text-blue-400">GENERATED_BODY</span>()</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">7</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">8</span>
        <span className=""><span className="text-purple-400">public</span>:</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">9</span>
        <span className="pl-4"><span className="text-orange-300">ARealisticCharacter</span>();</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">10</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">11</span>
        <span className=""><span className="text-purple-400">protected</span>:</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">12</span>
        <span className="pl-4"><span className="text-purple-400">virtual</span> <span className="text-purple-400">void</span> <span className="text-yellow-300">BeginPlay</span>() <span className="text-purple-400">override</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">13</span>
        <span className="pl-4"><span className="text-purple-400">virtual</span> <span className="text-purple-400">void</span> <span className="text-yellow-300">Tick</span>(<span className="text-purple-400">float</span> <span className="text-orange-300">DeltaTime</span>) <span className="text-purple-400">override</span>;</span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">14</span>
        <span className=""></span>
      </div>
      <div className="flex space-x-2 text-xs mb-1">
        <span className="text-zinc-500">15</span>
        <span className="pl-4"><span className="text-blue-400">UPROPERTY</span>(<span className="text-orange-300">BlueprintReadOnly</span>, <span className="text-blue-400">Category</span> = <span className="text-green-400">"Movement"</span>)</span>
      </div>
    </div>
  </>
);

