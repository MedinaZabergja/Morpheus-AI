'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface AddDreamViewProps {
  isOpen: boolean;
  onClose: () => void;
  input: string;
  setInput: (value: string) => void;
  onAnalyze: () => Promise<void> | void;
  loading: boolean;
  serverError?: string;
  clearServerError?: () => void;
}

export function AddDreamView({
  isOpen,
  onClose,
  input,
  setInput,
  onAnalyze,
  loading,
  serverError = '',
  clearServerError,
}: AddDreamViewProps) {
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isValidDream = (text: string): boolean => {
    const trimmed = text.trim();

    if (!trimmed) return false;
    if (trimmed.length < 10) return false;

    const words = trimmed.split(/\s+/);
    if (words.length < 3) return false;

    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, ''));
    if (uniqueChars.size < 3) return false;

    return true;
  };

  // ✅ UPDATED FUNCTION (BUG FIX + UX IMPROVEMENT)
  const handleAnalyzeClick = async () => {
    if (loading) return;

    // Clear previous errors
    setError('');
    if (serverError && clearServerError) clearServerError();

    // Validation
    if (!input.trim()) {
      setError('Please describe your dream before submitting.');
      return;
    }

    if (!isValidDream(input)) {
      setError('Please write a clearer dream description with at least 3 words.');
      return;
    }

    // ✅ NETWORK CHECK (MAIN BUG FIX)
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    try {
      // Call parent analyze function
      await onAnalyze();
    } catch (err) {
      console.error('Analyze failed:', err);

      // ✅ FALLBACK ERROR (API / SERVER FAILURE)
      setError('Something went wrong while analyzing your dream. Please try again.');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    if (error) setError('');
    if (serverError && clearServerError) clearServerError();
  };

  const displayedError = error || serverError;

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#1a0b2e] z-40 flex flex-col"
    >
      <div className="flex items-center gap-4 p-6 border-b border-purple-500/20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

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

      <div className="flex-1 px-6 pb-40">
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="The details are fading... write them down."
          className="w-full h-full bg-transparent text-white text-lg placeholder-purple-400/50 resize-none focus:outline-none leading-relaxed"
          disabled={loading}
        />

        {displayedError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm">{displayedError}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a0b2e] to-transparent">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyzeClick}
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