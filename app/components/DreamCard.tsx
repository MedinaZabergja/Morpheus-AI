/*'use client';

import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';

interface Dream {
  id: string;
  content: string;
  response: string;
  date: Date;
  mood?: string;
  title?: string;
}

interface DreamCardProps {
  dream: Dream;
  index: number;
}

// Extract mood from AI response or default to mysterious
function extractMood(response: string): { mood: string; color: string } {
  const moods = [
    { mood: 'anxious', color: '#64588C', keywords: ['anxiety', 'anxious', 'fear', 'scared', 'worried', 'stress'] },
    { mood: 'adventurous', color: '#BF84A0', keywords: ['adventure', 'journey', 'explore', 'travel', 'exciting'] },
    { mood: 'peaceful', color: '#7C9885', keywords: ['peace', 'calm', 'serene', 'tranquil', 'relaxed'] },
    { mood: 'mysterious', color: '#4A4E69', keywords: ['mystery', 'unknown', 'strange', 'bizarre', 'weird'] },
    { mood: 'joyful', color: '#E9C46A', keywords: ['joy', 'happy', 'laughter', 'celebration', 'delight'] },
    { mood: 'nostalgic', color: '#9A8C98', keywords: ['nostalgia', 'memory', 'childhood', 'past', 'remember'] },
  ];

  const responseLower = response.toLowerCase();
  
  for (const moodData of moods) {
    if (moodData.keywords.some(keyword => responseLower.includes(keyword))) {
      return { mood: moodData.mood, color: moodData.color };
    }
  }

  return { mood: 'mysterious', color: '#4A4E69' };
}

// Extract title from AI response or generate one
function extractTitle(response: string): string {
  const titleMatch = response.match(/\*\*Title:\*\*\s*["']?([^"'\n]+)["']?/i);
  if (titleMatch) return titleMatch[1].trim();
  
  const prefixes = ['The Dream of', 'A Vision of', 'Journey Through', 'Whispers of', 'Echoes of'];
  const suffixes = ['Twilight', 'Moonbeams', 'Stardust', 'Shadows', 'Memories', 'Destiny'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

export function DreamCard({ dream, index }: DreamCardProps) {
  const { content, response, date } = dream;
  const { mood, color } = extractMood(response);
  const title = extractTitle(response);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-2xl p-6 border-l-4 shadow-lg backdrop-blur-sm mb-6"
      style={{ borderLeftColor: color }}
    >
      {/* Header */
     /* <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color }} />
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
          style={{ backgroundColor: color }}
        >
          {mood}
        </div>
      </div>

      {/* Date *}
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
        <Calendar className="w-4 h-4" />
        {date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Dream Content *}
      <div className="mb-4">
        <p className="text-slate-300 text-sm mb-2 font-medium">Your Dream:</p>
        <p className="text-slate-200 leading-relaxed italic">{content}</p>
      </div>

      {/* AI Analysis *}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-indigo-300 text-sm mb-2 font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Analysis:
        </p>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
            {response}
          </p>
        </div>
      </div>
    </motion.div>
  );
}*/