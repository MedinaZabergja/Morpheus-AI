'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Sparkles, Moon, Calendar, Brain } from 'lucide-react';
import { Dream } from '../page';

interface DreamDetailViewProps {
  dream: Dream | null;
  onClose: () => void;
  onDelete?: (dreamId: string) => void;
}

export function DreamDetailView({ dream, onClose, onDelete }: DreamDetailViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!dream) return null;

  const date = new Date(dream.created_at);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = date.getFullYear();

  const displayTitle = dream.title || 'Untitled Dream';

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(dream.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete dream:', err);
      setIsDeleting(false);
    }
  };

  const parseAnalysis = (analysis: string) => {
    const sections: { heading: string; content: string }[] = [];
    const lines = analysis.split('\n').filter(line => line.trim());
    
    let currentSection: { heading: string; content: string } | null = null;

    for (const line of lines) {
      const cleanLine = line.trim().replace(/\*\*/g, '');
      
      if (cleanLine.includes(':') && !cleanLine.startsWith('*')) {
        const [heading, ...contentParts] = cleanLine.split(':');
        const content = contentParts.join(':').trim();
        
        if (currentSection) sections.push(currentSection);
        
        currentSection = {
          heading: heading.trim(),
          content: content || ''
        };
      } else if (currentSection && cleanLine) {
        currentSection.content += ' ' + cleanLine;
      }
    }
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseAnalysis(dream.ai_analysis);

  // Use saved mood from database as single source of truth
  const getMoodData = () => {
    const savedMood = dream.mood?.toLowerCase() || 'mysterious';
    
    const moodConfig: Record<string, { name: string; percentage: number; color: string; emoji: string; bgGlow: string; textColor: string }> = {
      anxious: { 
        name: 'Anxious', 
        percentage: 60, 
        color: 'from-red-400 to-orange-400', 
        emoji: '😰', 
        bgGlow: 'rgba(239, 68, 68, 0.08)',
        textColor: '#fca5a5'
      },
      peaceful: { 
        name: 'Peaceful', 
        percentage: 75, 
        color: 'from-emerald-400 to-teal-400', 
        emoji: '😌', 
        bgGlow: 'rgba(34, 197, 94, 0.08)',
        textColor: '#86efac'
      },
      mysterious: { 
        name: 'Mysterious', 
        percentage: 70, 
        color: 'from-purple-400 to-indigo-400', 
        emoji: '🔮', 
        bgGlow: 'rgba(168, 85, 247, 0.08)',
        textColor: '#c084fc'
      },
    };

    return [moodConfig[savedMood] || moodConfig.mysterious];
  };

  const moodData = getMoodData();
  const currentMood = moodData[0];

  const getAmbientColor = () => {
    const savedMood = dream.mood?.toLowerCase() || 'mysterious';
    switch (savedMood) {
      case 'anxious': return '#ef4444';
      case 'peaceful': return '#10b981';
      default: return '#a855f7';
    }
  };

  const ambientColor = getAmbientColor();

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#0f0518] z-50 overflow-y-auto font-serif"
    >
      {/* Ambient background glow that shifts with mood */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${ambientColor}08 0%, transparent 60%)`,
        }}
      />

      {/* Floating particles in background */}
      <FloatingParticles mood={dream.mood} />

      <div className="sticky top-0 bg-[#1a0b2e]/80 backdrop-blur-md border-b border-purple-500/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Journal</span>
          </motion.button>

          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-sans text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Animated header with floating moon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Calendar className="w-4 h-4 text-purple-400" />
            </motion.div>
            <p className="text-purple-300 text-sm font-sans">
              {dayName}, {monthDay}, {year}
            </p>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white leading-tight font-serif"
            style={{ textShadow: `0 0 30px ${ambientColor}30` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {displayTitle}
          </motion.h1>

          {/* Whisper subtitle based on saved mood */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-sm italic font-serif"
            style={{ color: '#e0aaff', textShadow: '0 0 15px rgba(224, 170, 255, 0.3)' }}
          >
            "{getWhisperQuote(dream.mood)}"
          </motion.p>
        </motion.div>

        {/* The Narrative with glow border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.6) 0%, rgba(26, 11, 46, 0.8) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
            boxShadow: '0 0 40px rgba(157, 78, 221, 0.1), inset 0 0 20px rgba(157, 78, 221, 0.05)',
          }}
        >
          {/* Ambient orb inside card */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${ambientColor} 0%, transparent 70%)` }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Moon className="w-5 h-5 text-purple-400" />
              </motion.div>
              <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider font-sans">
                The Narrative
              </h2>
            </div>
            <p className="text-white/90 leading-relaxed text-lg font-serif">
              {dream.content}
            </p>
          </div>
        </motion.div>

        {/* Mood Data with mood-colored glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentMood.bgGlow} 0%, rgba(26, 11, 46, 0.6) 100%)`,
            border: `1px solid ${dream.mood?.toLowerCase() === 'anxious' ? 'rgba(239, 68, 68, 0.3)' : dream.mood?.toLowerCase() === 'peaceful' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(192, 132, 252, 0.2)'}`,
            boxShadow: `0 0 40px ${dream.mood?.toLowerCase() === 'anxious' ? 'rgba(239, 68, 68, 0.15)' : dream.mood?.toLowerCase() === 'peaceful' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(157, 78, 221, 0.1)'}`,
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5" style={{ color: currentMood.textColor }} />
              </motion.div>
              <h2 className="text-sm font-semibold uppercase tracking-wider font-sans" style={{ color: currentMood.textColor }}>
                Mood Data
              </h2>
            </div>
            
            <div className="space-y-6">
              {moodData.map((mood, index) => (
                <motion.div 
                  key={mood.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mood.emoji}</span>
                      <span className="text-white font-medium font-sans">{mood.name}</span>
                    </div>
                    <motion.span 
                      className="font-sans font-bold"
                      style={{ color: currentMood.textColor }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {mood.percentage}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-black/30 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mood.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${mood.color} relative`}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Interpretation with ethereal styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.6) 0%, rgba(26, 11, 46, 0.8) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
            boxShadow: '0 0 40px rgba(157, 78, 221, 0.1), inset 0 0 20px rgba(157, 78, 221, 0.05)',
          }}
        >
          <div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-5 h-5 text-purple-400" />
              </motion.div>
              <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider font-sans">
                AI Interpretation
              </h2>
            </div>
            
            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div 
                  key={index} 
                  className="border-b border-purple-500/20 last:border-0 pb-4 last:pb-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2 font-serif">
                    {section.heading}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dream timestamp footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-4"
        >
          <p className="text-xs text-purple-400/40 font-serif italic">
            ✦ Recorded in the realm between sleep and waking ✦
          </p>
        </motion.div>
      </div>

      {/* Mystical delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(10, 5, 30, 0.85)', backdropFilter: 'blur(12px)' }}
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #2d0a0a 0%, #1a0b2e 100%)',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), inset 0 0 30px rgba(239, 68, 68, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
              />

              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid rgba(239, 68, 68, 0.5)',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <Sparkles className="w-8 h-8 text-red-400" />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif text-lg italic leading-relaxed text-center mb-6"
                style={{ color: '#fca5a5', textShadow: '0 0 15px rgba(252, 165, 165, 0.4)' }}
              >
                "This vision, once scattered, cannot be gathered from the winds of oblivion..."
              </motion.p>

              <div className="text-center mb-6">
                <p className="text-red-300/60 text-sm">
                  This will permanently destroy <span className="text-red-300 font-semibold">"{displayTitle}"</span>
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(90deg, #dc2626 0%, #991b1b 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
                  }}
                >
                  {isDeleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {isDeleting ? 'Dissolving into void...' : 'Let it fade'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'rgba(157, 78, 221, 0.15)',
                    border: '1px solid rgba(157, 78, 221, 0.4)',
                    color: '#e0aaff',
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Preserve this vision</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Floating particles component
function FloatingParticles({ mood }: { mood: string | null }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const getParticleColor = () => {
    switch (mood?.toLowerCase()) {
      case 'anxious': return 'rgba(239, 68, 68, 0.3)';
      case 'peaceful': return 'rgba(34, 197, 94, 0.3)';
      default: return 'rgba(192, 132, 252, 0.3)';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: getParticleColor(),
            boxShadow: `0 0 ${particle.size * 2}px ${getParticleColor()}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Whisper quotes based on saved mood from database
function getWhisperQuote(mood: string | null): string {
  const quotes: Record<string, string[]> = {
    anxious: [
      "The waters stir beneath a troubled surface...",
      "Shadows lengthen where fear treads...",
      "The heart's tremor echoes through the void...",
    ],
    peaceful: [
      "Still waters reflect the moon's truth...",
      "Serenity blooms in quiet corners of the mind...",
      "The soul finds rest in gentle meadows...",
    ],
    mysterious: [
      "The veil between worlds is thin here...",
      "Not all that is seen can be understood...",
      "Ancient symbols whisper their secrets...",
    ],
  };

  const moodKey = mood?.toLowerCase() || 'mysterious';
  const moodQuotes = quotes[moodKey] || quotes.mysterious;
  return moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
}