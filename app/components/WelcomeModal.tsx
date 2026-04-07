'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, TrendingUp, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Analysis',
      description: 'Get instant insights into your dream\'s themes, moods, and emotional patterns',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find dreams by themes or moods. Click any theme tag to explore related dreams',
    },
    {
      icon: TrendingUp,
      title: 'Pattern Recognition',
      description: 'Track recurring themes and mood trends over time in the Insights dashboard',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-white">
              Welcome to Dream Decipherer
            </h2>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed">
              Your personal AI-powered dream journal. Capture the fleeting details of your dreams before they fade, and discover the patterns hidden in your subconscious.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-4 rounded-xl font-semibold text-white gradient-button shadow-lg shadow-purple-500/25"
            >
              Start Journaling
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}