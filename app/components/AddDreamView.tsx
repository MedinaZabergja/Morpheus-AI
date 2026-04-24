'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertCircle, Moon, Feather, Wand2 } from 'lucide-react';

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
// Get current moon phase
function getMoonPhase() {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  
  let c, e, jd, b;
  if (month < 3) { 
    year--; 
    month += 12; 
  }
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(String(jd));
  jd -= b;
  b = Math.round(jd * 8);
  
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return phases[b % 8];
}

// Dream whisper prompts that cycle
const dreamWhispers = [
  "The veil between worlds is thin here...",
  "Let the visions flow through you...",
  "The stars are listening...",
  "Speak, and the void shall remember...",
  "Your subconscious holds ancient keys...",
  "The moon awaits your tale...",
  "Dreams are but whispers from the void...",
  "Pour forth the shadows of your mind...",
];

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
  const [whisperIndex, setWhisperIndex] = useState(0);
  const [typingIntensity, setTypingIntensity] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTypeTime = useRef(Date.now());

  // Cycle whispers
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setWhisperIndex((prev) => (prev + 1) % dreamWhispers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Track typing intensity for glow effects
  useEffect(() => {
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    
    const now = Date.now();
    if (now - lastTypeTime.current < 500) {
      setTypingIntensity(Math.min(typingIntensity + 0.1, 1));
    } else {
      const decay = setInterval(() => {
        setTypingIntensity((prev) => Math.max(prev - 0.05, 0));
      }, 100);
      return () => clearInterval(decay);
    }
    lastTypeTime.current = now;
  }, [input]);

  // Auto-focus textarea
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

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

  const handleAnalyzeClick = async () => {
    if (loading) return;
    setError('');
    if (serverError && clearServerError) clearServerError();

    if (!input.trim()) {
      setError('The spirits cannot interpret silence... speak your vision.');
      return;
    }

    if (!isValidDream(input)) {
      setError('The threads are too faint. Unravel your dream with more words.');
      return;
    }

    if (!navigator.onLine) {
      setError('The ethereal connection has been severed. Restore your network.');
      return;
    }

    try {
      await onAnalyze();
    } catch (err) {
      console.error('Analyze failed:', err);
      setError('The spirits are restless. Your vision could not be deciphered.');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (error) setError('');
    if (serverError && clearServerError) clearServerError();
  };

  const displayedError = error || serverError;

  // Calculate glow intensity based on typing
  const glowOpacity = 0.05 + (typingIntensity * 0.15);
  const borderGlow = typingIntensity > 0.3 ? 'rgba(192, 132, 252, 0.5)' : 'rgba(192, 132, 252, 0.15)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0a0518] z-40 flex flex-col overflow-hidden"
    >
      {/* Ambient background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Pulsing center glow that responds to typing */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(124, 58, 237, ${glowOpacity}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Secondary mood glow */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(236, 72, 153, ${glowOpacity * 0.5}) 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating particles */}
      <DreamParticles input={input} />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex items-center justify-between p-6 border-b border-purple-500/10"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors font-sans"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Return</span>
        </motion.button>

        {/* Moon phase indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="text-lg"
          >
            {getMoonPhase()}
          </motion.span>
          <span className="text-xs text-purple-300/70 font-sans">Lunar Phase</span>
        </motion.div>
      </motion.div>

      {/* Date & Whisper */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 px-6 py-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Feather className="w-4 h-4 text-purple-400/60" />
          <p className="text-purple-300/60 text-sm font-sans">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={whisperIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.8 }}
            className="text-sm italic font-serif"
            style={{ color: '#e0aaff', textShadow: '0 0 15px rgba(224, 170, 255, 0.3)' }}
          >
            "{dreamWhispers[whisperIndex]}"
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 pb-48 overflow-y-auto">
        {/* Ethereal Textarea Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.3) 0%, rgba(26, 11, 46, 0.5) 100%)',
            border: `1px solid ${borderGlow}`,
            boxShadow: `0 0 ${30 + typingIntensity * 40}px rgba(124, 58, 237, ${0.1 + typingIntensity * 0.2}), inset 0 0 30px rgba(157, 78, 221, 0.05)`,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Inner ambient orb */}
          <motion.div
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(157, 78, 221, ${0.1 + typingIntensity * 0.2}) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10 p-6">
            {/* Floating label */}
            <motion.div
              className="flex items-center gap-2 mb-4"
              animate={{
                opacity: input.length > 0 ? 0.5 : 1,
              }}
            >
              <Wand2 className="w-4 h-4 text-purple-400/50" />
              <span className="text-xs uppercase tracking-widest text-purple-400/50 font-sans">
                The Vision Unfolds
              </span>
            </motion.div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="The details are fading... write them down before they dissolve into the void."
              className="w-full bg-transparent text-white text-lg placeholder-purple-400/30 resize-none focus:outline-none leading-relaxed font-serif min-h-[200px]"
              disabled={loading}
              style={{
                textShadow: input.length > 0 ? '0 0 20px rgba(224, 170, 255, 0.1)' : 'none',
              }}
            />

            {/* Word count & progress */}
            <motion.div
              className="flex items-center justify-between mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(192, 132, 252, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((threshold) => (
                    <motion.div
                      key={threshold}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: wordCount >= threshold 
                          ? 'rgba(192, 132, 252, 0.8)' 
                          : 'rgba(192, 132, 252, 0.2)',
                        boxShadow: wordCount >= threshold 
                          ? '0 0 8px rgba(192, 132, 252, 0.5)' 
                          : 'none',
                      }}
                      animate={{
                        scale: wordCount >= threshold ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-purple-400/40 font-sans">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
              </div>

              {input.length > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-purple-400/30 font-serif italic"
                >
                  {input.length} characters woven
                </motion.span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {displayedError && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mt-4 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                }}
              />
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0 relative z-10" />
              <p className="text-sm text-red-200/80 relative z-10 font-serif">{displayedError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Area */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-20"
      >
        {/* Gradient fade */}
        <div className="h-24 bg-gradient-to-t from-[#0a0518] to-transparent pointer-events-none" />
        
        <div className="px-6 pb-6 pt-2 bg-[#0a0518]">
          {/* Mystical button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyzeClick}
            disabled={loading || !input.trim()}
            className="w-full py-4 rounded-xl font-semibold text-white relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #4c1d95 0%, #2d1b4e 100%)'
                : 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
              boxShadow: input.length > 20 
                ? '0 8px 40px rgba(124, 58, 237, 0.4)' 
                : '0 4px 20px rgba(124, 58, 237, 0.2)',
              transition: 'box-shadow 0.5s ease',
            }}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />

            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="relative z-10">The spirits are deciphering...</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="relative z-10">
                  {input.length < 10 ? 'Continue weaving...' : 'Unveil the Meaning'}
                </span>
              </>
            )}
          </motion.button>

          {/* Subtle hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-3 text-xs text-purple-400/30 font-serif italic"
          >
            {input.length < 10 
              ? 'The spirits require at least 3 words to interpret your vision' 
              : 'Press the button when your tale is complete'}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating dream particles that respond to typing
function DreamParticles({ input }: { input: string }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    char: string;
  }>>([]);

  useEffect(() => {
    // Generate ambient particles
    const ambientParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      char: '',
    }));
    setParticles(ambientParticles);
  }, []);

  // Add character particles when typing
  useEffect(() => {
    if (input.length === 0 || input.length % 3 !== 0) return;
    
    const lastChar = input.slice(-1);
    if (lastChar === ' ') return;

    const newParticle = {
      id: Date.now(),
      x: 20 + Math.random() * 60,
      y: 60 + Math.random() * 20,
      size: 8,
      duration: 3,
      delay: 0,
      char: lastChar,
    };

    setParticles(prev => [...prev.slice(-20), newParticle]);
  }, [input]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -50, -100],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          {particle.char ? (
            <span 
              className="text-purple-300/20 font-serif text-lg"
              style={{ textShadow: '0 0 10px rgba(192, 132, 252, 0.3)' }}
            >
              {particle.char}
            </span>
          ) : (
            <div
              className="rounded-full bg-purple-400/20"
              style={{
                width: particle.size,
                height: particle.size,
                boxShadow: `0 0 ${particle.size * 2}px rgba(192, 132, 252, 0.2)`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}