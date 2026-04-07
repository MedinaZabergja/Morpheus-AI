'use client';

import { motion } from 'framer-motion';
import { Dream } from '../page';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
}

// Generate creative title based on dream content (ONLY for new dreams)
export function generateCreativeTitle(content: string): string {
  const contentLower = content.toLowerCase();
  
  const themes = [
    { keywords: ['water', 'ocean', 'sea', 'drown', 'swim', 'wave', 'drowning'], titles: ['The Abyssal Waltz', 'Tides of the Subconscious', 'Deep Waters', 'The Ocean\'s Whisper', 'Drowning in Dreams'] },
    { keywords: ['fly', 'flying', 'sky', 'air', 'cloud', 'float'], titles: ['Ascending Beyond', 'The Weightless Journey', 'Skies Unbound', 'Elevation of Spirit'] },
    { keywords: ['fall', 'falling', 'drop', 'descend', 'stairs'], titles: ['The Descent', 'Gravity\'s Embrace', 'Falling Into Mystery', 'The Long Drop', 'Stairway to the Abyss'] },
    { keywords: ['chase', 'running', 'escape', 'flee', 'hide'], titles: ['The Eternal Chase', 'Shadows in Pursuit', 'Running Through Time', 'The Hunter and the Hunted'] },
    { keywords: ['fire', 'burn', 'flame', 'heat', 'hot', 'volcano'], titles: ['The Inferno Within', 'Dancing Flames', 'Phoenix Rising', 'Embers of Truth', 'Volcanic Heart'] },
    { keywords: ['forest', 'tree', 'wood', 'nature', 'garden'], titles: ['The Verdant Labyrinth', 'Whispers of the Woods', 'Roots of Memory', 'The Enchanted Grove'] },
    { keywords: ['house', 'home', 'room', 'door', 'building'], titles: ['The House of Secrets', 'Rooms of the Mind', 'The Threshold', 'Architecture of Dreams'] },
    { keywords: ['death', 'dead', 'die', 'grave', 'funeral'], titles: ['The Final Transition', 'Beyond the Veil', 'The Great Unknown', 'Death\'s Gentle Touch'] },
    { keywords: ['love', 'kiss', 'romance', 'heart', 'passion'], titles: ['The Heart\'s Symphony', 'Echoes of Affection', 'Love in the Ether', 'The Romantic Vision'] },
    { keywords: ['animal', 'cat', 'dog', 'bird', 'snake', 'wolf'], titles: ['The Spirit Guide', 'Creature of the Psyche', 'The Animal Within', 'Wilderness of Soul'] },
    { keywords: ['orange', 'juice', 'fruit', 'sweet'], titles: ['Citrus Dreams', 'The Sweet Descent', 'Nectar of the Subconscious', 'Orange Twilight'] },
    { keywords: ['cold', 'ice', 'snow', 'freeze', 'winter'], titles: ['The Frozen Hour', 'Winter\'s Embrace', 'Icebound Visions', 'The Cold Beyond'] },
    { keywords: ['dark', 'black', 'night', 'shadow'], titles: ['Shadows of the Mind', 'The Darkened Path', 'Night\'s Embrace', 'The Obsidian Dream'] },
    { keywords: ['light', 'bright', 'sun', 'shine'], titles: ['The Illuminated Vision', 'Radiance of the Soul', 'Sunlit Memories', 'The Bright Beyond'] },
  ];

  for (const theme of themes) {
    if (theme.keywords.some(kw => contentLower.includes(kw))) {
      return theme.titles[Math.floor(Math.random() * theme.titles.length)];
    }
  }

  const defaults = [
    'The Midnight Vision', 'Shadows of the Mind', 'The Dreaming Hour',
    'Fragments of Sleep', 'The Nocturnal Journey', 'Visions in Violet',
    'The Subconscious Tapestry', 'Echoes of Night', 'The Slumbering Truth',
    'Mysteries of the Deep', 'The Celestial Dance', 'Whispers in Darkness',
    'The Ethereal Passage', 'Night\'s Silent Symphony', 'The Lucid Horizon',
    'Dreams of the Abyss', 'The Phantom Reverie', 'Slumber\'s Secret',
    'The Twilight Vision', 'Nocturnal Whispers'
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function DreamCard({ dream, onClick }: DreamCardProps) {
  const date = new Date(dream.created_at);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  // Use saved title only - never regenerate
  const displayTitle = dream.title || 'Untitled Dream';

  const getMoods = () => {
    const analysis = dream.ai_analysis.toLowerCase();
    const moods = [];
    if (analysis.includes('peaceful')) moods.push('Peaceful');
    if (analysis.includes('anxious')) moods.push('Anxious');
    if (analysis.includes('joyful') || analysis.includes('happy')) moods.push('Joyful');
    if (analysis.includes('nostalgic')) moods.push('Nostalgic');
    if (analysis.includes('curious')) moods.push('Curious');
    if (analysis.includes('confused')) moods.push('Confused');
    if (analysis.includes('mysterious')) moods.push('Mysterious');
    if (moods.length === 0) moods.push('Mysterious');
    return moods.slice(0, 2);
  };

  const moods = getMoods();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-6 cursor-pointer transition-all hover:border-purple-500/30"
    >
      <p className="text-sm text-purple-300 mb-2 font-sans">
        {dayName}, {monthDay}
      </p>
      <h3 className="text-2xl font-bold text-white mb-3 font-serif">
        {displayTitle}
      </h3>
      
      <div className="flex gap-2 mb-4">
        {moods.map((mood) => (
          <span
            key={mood}
            className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30 font-sans"
          >
            {mood}
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-sans">
        {dream.content.length > 120 
          ? dream.content.substring(0, 120) + '...' 
          : dream.content}
      </p>
    </motion.div>
  );
}