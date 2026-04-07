'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface AddDreamViewProps {
  isOpen: boolean;
  onClose: () => void;
  input: string;
  setInput: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function AddDreamView({ isOpen, onClose, input, setInput, onAnalyze, loading }: AddDreamViewProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#1a0b2e] z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-purple-500/20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Date */}
      <div className="px-6 py-4">
        <p className="text-purple-300 text-sm">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Textarea */}
      <div className="flex-1 px-6 pb-32">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="The details are fading... write them down."
          className="w-full h-full bg-transparent text-white text-lg placeholder-purple-400/50 resize-none focus:outline-none leading-relaxed"
          disabled={loading}
        />
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a0b2e] to-transparent">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          disabled={loading || !input.trim()}
          className="w-full py-4 rounded-xl font-semibold text-white gradient-button shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Dream
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}