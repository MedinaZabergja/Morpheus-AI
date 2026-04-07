'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
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

  const getMoodData = () => {
    const analysis = dream.ai_analysis.toLowerCase();
    const moods: { name: string; percentage: number; color: string }[] = [];
    
    if (analysis.includes('anxious') || analysis.includes('fear')) {
      moods.push({ name: 'Anxious', percentage: 60, color: 'from-red-400 to-orange-400' });
    }
    if (analysis.includes('confused') || analysis.includes('disoriented')) {
      moods.push({ name: 'Confused', percentage: 55, color: 'from-indigo-400 to-purple-400' });
    }
    if (analysis.includes('peaceful') || analysis.includes('calm')) {
      moods.push({ name: 'Peaceful', percentage: 75, color: 'from-blue-400 to-purple-400' });
    }
    if (analysis.includes('curious') || analysis.includes('wonder')) {
      moods.push({ name: 'Curious', percentage: 50, color: 'from-purple-400 to-pink-400' });
    }
    
    if (moods.length === 0) {
      moods.push({ name: 'Mysterious', percentage: 70, color: 'from-purple-400 to-indigo-400' });
    }
    
    return moods.slice(0, 2);
  };

  const moodData = getMoodData();

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#1a0b2e] z-50 overflow-y-auto font-serif"
    >
      <div className="sticky top-0 bg-[#1a0b2e]/95 backdrop-blur-md border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Journal</span>
          </button>

          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-sans text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <p className="text-purple-300 text-sm mb-2 font-sans">
            {dayName}, {monthDay}, {year}
          </p>
          <h1 className="text-4xl font-bold text-white leading-tight">
            {displayTitle}
          </h1>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4 font-sans">
            The Narrative
          </h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            {dream.content}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-6 font-sans">
            Mood Data
          </h2>
          
          <div className="space-y-6">
            {moodData.map((mood) => (
              <div key={mood.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium font-sans">{mood.name}</span>
                  <span className="text-purple-300 font-sans">{mood.percentage}%</span>
                </div>
                <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mood.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${mood.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-6 font-sans">
            AI Interpretation
          </h2>
          
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-purple-500/20 last:border-0 pb-4 last:pb-0">
                <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                  {section.heading}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#2d1b4e] rounded-2xl p-6 max-w-sm w-full border border-red-500/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Dream?</h3>
              </div>
              
              <p className="text-purple-200/80 mb-6 leading-relaxed">
                This will permanently remove <span className="text-white font-semibold">"{displayTitle}"</span> from your journal. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl font-medium text-purple-300 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}