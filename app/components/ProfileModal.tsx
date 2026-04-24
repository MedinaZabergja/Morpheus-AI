'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Trash2, Sparkles, X } from 'lucide-react';

const mysticalQuotes = [
  "The veil between worlds is thin here...",
  "Stars remember what mortals forget...",
  "Dreams are but whispers from the void...",
  "The moon watches your journey...",
  "Ancient spirits stir in these shadows...",
  "What is remembered, lives forever...",
  "The tapestry of fate unravels slowly...",
  "Beneath conscious thought, truth dwells...",
  "Time flows differently in the realm of sleep...",
  "Your essence echoes across dimensions...",
  "The night holds secrets only you can unlock...",
  "Visions fade, but the soul remembers...",
];

const deleteWarnings = [
  "Are you certain? These visions, once scattered, cannot be gathered from the winds of oblivion...",
  "The threads of memory tremble. To cut them is to unweave part of your soul's tapestry...",
  "Once cast into the void, not even the stars can retrieve what is lost. Do you dare?",
  "These dreams are fragments of your shadow-self. To erase them is to erase pieces of you...",
  "The ancient ones warn: 'What is forgotten by choice leaves scars deeper than time.' Proceed?",
  "You stand at the edge of forgetting. Step forward, and these visions become stardust forever...",
  "The abyss beckons. Once your dreams descend, they shall not return to the waking world...",
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDeleteAllDreams: () => void;
  dreamCount: number;
}

export function ProfileModal({ isOpen, onClose, onLogout, onDeleteAllDreams, dreamCount }: ProfileModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [warningIndex, setWarningIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % mysticalQuotes.length);
  };

  const handleDeleteClick = () => {
    setWarningIndex(Math.floor(Math.random() * deleteWarnings.length));
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAllDreams();
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 5, 30, 0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {!showDeleteConfirm ? (
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
                  border: '2px solid rgba(157, 78, 221, 0.5)',
                  boxShadow: '0 0 60px rgba(157, 78, 221, 0.3), inset 0 0 30px rgba(157, 78, 221, 0.1)',
                }}
              >
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #9d4edd 0%, transparent 70%)' }}
                />
                <div
                  className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
                />

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-purple-400 hover:text-purple-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                      boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                    }}
                  >
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>

                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8 cursor-pointer group"
                  onClick={cycleQuote}
                >
                  <p
                    className="font-serif text-lg italic leading-relaxed"
                    style={{ color: '#e0aaff', textShadow: '0 0 15px rgba(224, 170, 255, 0.5)' }}
                  >
                    "{mysticalQuotes[quoteIndex]}"
                  </p>
                  <p className="text-xs mt-2 text-purple-400/60 group-hover:text-purple-300/80 transition-colors">
                    ✦ Click to reveal another whisper ✦
                  </p>
                </motion.div>

                <div className="text-center mb-6">
                  <p className="text-purple-300/70 text-sm">
                    You have recorded <span className="text-purple-300 font-semibold">{dreamCount}</span> visions
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                      background: 'rgba(157, 78, 221, 0.15)',
                      border: '1px solid rgba(157, 78, 221, 0.4)',
                      color: '#e0aaff',
                    }}
                  >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium">Return to the Mundane</span>
                  </button>

                  {dreamCount > 0 && (
                    <button
                      onClick={handleDeleteClick}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                      }}
                    >
                      <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span className="font-medium">Erase All Visions</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2d0a0a 0%, #1a0b2e 100%)',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                  boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), inset 0 0 30px rgba(239, 68, 68, 0.1)',
                }}
              >
                <div
                  className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full opacity-20 blur-3xl"
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

                <motion.div
                  key={warningIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-8"
                >
                  <p
                    className="font-serif text-lg italic leading-relaxed"
                    style={{ color: '#fca5a5', textShadow: '0 0 15px rgba(252, 165, 165, 0.4)' }}
                  >
                    {deleteWarnings[warningIndex]}
                  </p>
                </motion.div>

                <div className="text-center mb-6">
                  <p className="text-red-300/60 text-sm">
                    This will permanently destroy <span className="text-red-300 font-semibold">{dreamCount}</span> dreams
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
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
                      {isDeleting ? 'Dissolving into void...' : 'Let them fade'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                    style={{
                      background: 'rgba(157, 78, 221, 0.15)',
                      border: '1px solid rgba(157, 78, 221, 0.4)',
                      color: '#e0aaff',
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Preserve them</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}