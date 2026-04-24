'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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

const moodColors: Record<string, { bg: string; text: string; glow: string }> = {
  Peaceful: {
    bg: 'rgba(99, 102, 241, 0.15)',
    text: '#a5b4fc',
    glow: 'rgba(99, 102, 241, 0.3)',
  },
  Anxious: {
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#fca5a5',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  Joyful: {
    bg: 'rgba(250, 204, 21, 0.15)',
    text: '#fde047',
    glow: 'rgba(250, 204, 21, 0.3)',
  },
  Nostalgic: {
    bg: 'rgba(244, 114, 182, 0.15)',
    text: '#fbcfe8',
    glow: 'rgba(244, 114, 182, 0.3)',
  },
  Curious: {
    bg: 'rgba(34, 197, 94, 0.15)',
    text: '#86efac',
    glow: 'rgba(34, 197, 94, 0.3)',
  },
  Confused: {
    bg: 'rgba(156, 163, 175, 0.15)',
    text: '#d1d5db',
    glow: 'rgba(156, 163, 175, 0.3)',
  },
  Mysterious: {
    bg: 'rgba(168, 85, 247, 0.15)',
    text: '#d8b4fe',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
};

export function DreamCard({ dream, onClick }: DreamCardProps) {
  const date = new Date(dream.created_at);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

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
  const primaryMood = moods[0] || 'Mysterious';
  const primaryColors = moodColors[primaryMood] || moodColors.Mysterious;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer group overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.8) 0%, rgba(26, 11, 46, 0.9) 100%)',
        border: '1px solid rgba(192, 132, 252, 0.15)',
        boxShadow: `0 4px 24px rgba(0, 0, 0, 0.4), 0 0 20px ${primaryColors.glow}`,
      }}
    >
      {/* Mystical shimmer overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(192, 132, 252, 0.08) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'mysticalShimmer 2s ease-in-out infinite',
        }}
      />

      {/* Corner glow accents */}
      <div
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: primaryColors.glow }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: 'rgba(192, 132, 252, 0.3)' }}
      />

      {/* Top edge light line */}
      <div
        className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColors.glow}, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative p-6 z-10">
        {/* Date with sparkle */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3 h-3 text-purple-400/50 group-hover:text-purple-300/80 transition-colors duration-300" />
          <p className="text-xs text-purple-300/60 font-medium tracking-wide uppercase">
            {dayName}, {monthDay}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 font-serif group-hover:text-purple-200 transition-colors duration-300">
          {displayTitle}
        </h3>
        
        {/* Mood badges */}
        <div className="flex gap-2 mb-4">
          {moods.map((mood) => {
            const colors = moodColors[mood] || moodColors.Mysterious;
            return (
              <span
                key={mood}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  borderColor: colors.glow,
                  boxShadow: `0 0 12px ${colors.glow}`,
                }}
              >
                {mood}
              </span>
            );
          })}
        </div>

        {/* Content preview */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed group-hover:text-purple-200/80 transition-colors duration-300">
          {dream.content.length > 120 
            ? dream.content.substring(0, 120) + '...' 
            : dream.content}
        </p>

        {/* Bottom mystical line */}
        <div
          className="mt-4 h-px w-12 opacity-30 group-hover:w-full group-hover:opacity-50 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, ${primaryColors.glow}, transparent)`,
          }}
        />
      </div>

      {/* Subtle border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${primaryColors.glow}, 0 0 40px ${primaryColors.glow}`,
        }}
      />
    </motion.div>
  );
}