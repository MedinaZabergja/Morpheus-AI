'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BedDouble, 
  Brain, 
  Smartphone, 
  Utensils, 
  Shield, 
  Clock,
  ChevronRight,
  Sparkles,
  Star,
  Moon,
  Activity,
  Heart,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface SleepTip {
  id: string;
  category_slug: string;
  category_title: string;
  icon: string;
  color: string;
  sort_order: number;
  tip_title: string;
  content: string;
  quick_action: string;
}

interface SleepHelpViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  smartphone: Smartphone,
  bed: BedDouble,
  utensils: Utensils,
  shield: Shield,
  clock: Clock,
};

// Magical color palette with glow effects
const colorMap: Record<string, { 
  gradient: string; 
  glow: string; 
  text: string; 
  border: string;
  accent: string;
  particle: string;
}> = {
  rose: {
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    text: 'text-rose-200',
    border: 'border-rose-400/20 hover:border-rose-400/40',
    accent: 'bg-rose-500/20 text-rose-200',
    particle: '#f43f5e'
  },
  blue: {
    gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    text: 'text-blue-200',
    border: 'border-blue-400/20 hover:border-blue-400/40',
    accent: 'bg-blue-500/20 text-blue-200',
    particle: '#3b82f6'
  },
  emerald: {
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    text: 'text-emerald-200',
    border: 'border-emerald-400/20 hover:border-emerald-400/40',
    accent: 'bg-emerald-500/20 text-emerald-200',
    particle: '#10b981'
  },
  amber: {
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    text: 'text-amber-200',
    border: 'border-amber-400/20 hover:border-amber-400/40',
    accent: 'bg-amber-500/20 text-amber-200',
    particle: '#f59e0b'
  },
  violet: {
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    text: 'text-violet-200',
    border: 'border-violet-400/20 hover:border-violet-400/40',
    accent: 'bg-violet-500/20 text-violet-200',
    particle: '#8b5cf6'
  },
  cyan: {
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    text: 'text-cyan-200',
    border: 'border-cyan-400/20 hover:border-cyan-400/40',
    accent: 'bg-cyan-500/20 text-cyan-200',
    particle: '#06b6d4'
  },
};

// Floating particles component for magical background
const FloatingParticles = ({ color = '#ffffff' }: { color?: string }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Starfield background matching main page
const Starfield = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    twinkleDuration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.twinkleDuration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Breathing exercise visualizer
const BreathingGuide = ({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <div className="relative w-32 h-32">
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-rose-400/30"
          animate={isActive ? {
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-rose-400/20"
          animate={isActive ? {
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.05, 0.2],
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        
        {/* Main breathing circle */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-600/20 backdrop-blur-sm border border-rose-400/30 flex items-center justify-center"
          animate={isActive ? {
            scale: [1, 1.15, 1],
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-rose-200 text-xs font-medium text-center">
            {isActive ? 'Breathe' : 'Ready'}
          </span>
        </motion.div>
      </div>
      
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-sm hover:bg-rose-500/30 transition-colors"
      >
        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isActive ? 'Pause' : 'Start Breathing'}
      </button>
    </div>
  );
};

// Tasbih counter with magical animation
const TasbihCounter = ({ target = 33 }: { target?: number }) => {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const increment = () => {
    if (count < target) {
      setCount(c => c + 1);
      if (count + 1 >= target) setIsComplete(true);
    }
  };

  const reset = () => {
    setCount(0);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <div className="relative">
        {/* Progress ring */}
        <svg className="w-28 h-28 -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="50"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-purple-500/20"
          />
          <motion.circle
            cx="56"
            cy="56"
            r="50"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className={isComplete ? 'text-emerald-400' : 'text-violet-400'}
            strokeDasharray={`${2 * Math.PI * 50}`}
            animate={{
              strokeDashoffset: `${2 * Math.PI * 50 * (1 - count / target)}`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center count */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.span 
            key={count}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold ${isComplete ? 'text-emerald-300' : 'text-violet-200'}`}
          >
            {count}
          </motion.span>
          <span className="text-xs text-purple-300/60">/ {target}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={increment}
          disabled={isComplete}
          className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
            isComplete 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
              : 'bg-violet-500/20 text-violet-200 border border-violet-400/30 hover:bg-violet-500/30 active:scale-95'
          }`}
        >
          {isComplete ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Complete
            </span>
          ) : (
            'Count +1'
          )}
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-3 rounded-full bg-purple-500/10 text-purple-300 border border-purple-400/20 hover:bg-purple-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Category card with glassmorphism and floating animation
const CategoryCard = ({ 
  category, 
  index, 
  onClick 
}: { 
  category: any; 
  index: number; 
  onClick: () => void;
}) => {
  const Icon = iconMap[category.icon] || BedDouble;
  const colors = colorMap[category.color] || colorMap.violet;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        transition: { type: 'spring', stiffness: 300 }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 ${colors.border} ${colors.glow}`}
    >
      {/* Glassmorphism background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} backdrop-blur-xl`} />
      
      {/* Animated gradient mesh */}
      <motion.div
        className={`absolute -inset-20 bg-gradient-to-r ${colors.gradient} opacity-30 blur-3xl`}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      <FloatingParticles color={colors.particle} />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-10 h-10 mb-4 ${colors.text}`} />
        </motion.div>
        
        <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
          {category.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${colors.text} opacity-80`}>
            {category.tips.length} techniques
          </span>
          
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight className={`w-5 h-5 ${colors.text} opacity-60`} />
          </motion.div>
        </div>
      </div>

      {/* Corner sparkle */}
      <motion.div
        className="absolute top-3 right-3"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
      >
        <Sparkles className={`w-4 h-4 ${colors.text} opacity-60`} />
      </motion.div>
    </motion.button>
  );
};

// Technique card with enhanced styling — NO bookmark or audio buttons
const TechniqueCard = ({ 
  tip, 
  index, 
  colors 
}: { 
  tip: SleepTip; 
  index: number; 
  colors: any;
}) => {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showCounter, setShowCounter] = useState(false);

  const isBreathingExercise = tip.tip_title.toLowerCase().includes('breathing') || tip.tip_title.toLowerCase().includes('4-7-8');
  const isTasbih = tip.tip_title.toLowerCase().includes('tasbih') || tip.content.toLowerCase().includes('subhanallah');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
      className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.glow}`}
    >
      {/* Glassmorphism base */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl" />
      
      {/* Subtle inner glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50`} />

      <div className="relative z-10 p-6">
        {/* Header — clean, no buttons */}
        <h3 className="text-xl font-bold text-white mb-4">
          {tip.tip_title}
        </h3>
        
        {/* Content */}
        <p className="text-purple-200/70 text-sm leading-relaxed mb-5">
          {tip.content}
        </p>

        {/* Interactive elements */}
        {isBreathingExercise && (
          <div className="mb-4">
            <button
              onClick={() => setShowBreathing(!showBreathing)}
              className={`text-xs flex items-center gap-1 ${colors.text} hover:opacity-80 transition-opacity`}
            >
              <Activity className="w-3 h-3" />
              {showBreathing ? 'Hide' : 'Show'} Breathing Guide
            </button>
            <AnimatePresence>
              {showBreathing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BreathingGuide 
                    isActive={showBreathing} 
                    onToggle={() => setShowBreathing(!showBreathing)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {isTasbih && (
          <div className="mb-4">
            <button
              onClick={() => setShowCounter(!showCounter)}
              className={`text-xs flex items-center gap-1 ${colors.text} hover:opacity-80 transition-opacity`}
            >
              <Heart className="w-3 h-3" />
              {showCounter ? 'Hide' : 'Show'} Digital Counter
            </button>
            <AnimatePresence>
              {showCounter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TasbihCounter target={33} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Quick action */}
        <motion.div 
          className={`flex items-center gap-2 text-xs rounded-xl px-4 py-3 ${colors.accent} border border-white/10`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">{tip.quick_action}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Daily wisdom bubble
const DailyWisdom = () => {
  const wisdoms = [
    "Sleep is the best meditation. — Dalai Lama",
    "The night is a world lit by itself. — Antonio Porchia",
    "In dreams, we enter a world that's entirely our own.",
    "Let her sleep, for when she wakes, she will move mountains.",
    "The moon will guide you through the night with her brightness."
  ];

  const [wisdom] = useState(() => wisdoms[Math.floor(Math.random() * wisdoms.length)]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-400/20 backdrop-blur-sm"
    >
      <FloatingParticles color="#f59e0b" />
      <div className="relative z-10 flex items-start gap-3">
        <Moon className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
        <div>
          <p className="text-amber-200/80 text-sm italic leading-relaxed">"{wisdom}"</p>
        </div>
      </div>
    </motion.div>
  );
};

export function SleepHelpView({ isOpen, onClose }: SleepHelpViewProps) {
  const [tips, setTips] = useState<SleepTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTips();
    }
  }, [isOpen]);

  const fetchTips = async () => {
    try {
      const { createClient } = await import('../lib/supabaseClient');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('sleep_tips')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTips(data || []);
    } catch (err) {
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = tips.reduce((acc, tip) => {
    if (!acc[tip.category_slug]) {
      acc[tip.category_slug] = {
        slug: tip.category_slug,
        title: tip.category_title,
        icon: tip.icon,
        color: tip.color,
        tips: [],
      };
    }
    acc[tip.category_slug].tips.push(tip);
    return acc;
  }, {} as Record<string, { slug: string; title: string; icon: string; color: string; tips: SleepTip[] }>);

  const categoryList = Object.values(categories);
  const selectedColors = selectedCategory ? (colorMap[categories[selectedCategory]?.color] || colorMap.violet) : null;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0a0514] z-40 flex flex-col overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#0f0820] to-[#0a0514]" />
      
      {/* Starfield matching main page */}
      <Starfield />
      
      {/* Floating ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-md bg-[#0a0514]/50"
      >
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (selectedCategory) {
              setSelectedCategory(null);
            } else {
              onClose();
            }
          }}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{selectedCategory ? 'Back to Categories' : 'Back'}</span>
        </motion.button>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BedDouble className="w-5 h-5 text-purple-300" />
          </motion.div>
          <span className="text-purple-300 font-semibold tracking-wide">Sleep Sanctuary</span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="relative w-12 h-12"
            >
              <Moon className="w-12 h-12 text-purple-400/30 absolute" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-3 h-3 text-amber-300 absolute top-0 left-1/2 -translate-x-1/2" />
              </motion.div>
            </motion.div>
            <p className="text-purple-300/50 text-sm">Summoning sleep wisdom...</p>
          </div>
        ) : selectedCategory ? (
          // Category Detail View
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Category header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative overflow-hidden rounded-2xl p-6 border ${selectedColors?.border} ${selectedColors?.glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedColors?.gradient} backdrop-blur-xl`} />
              <FloatingParticles color={selectedColors?.particle || '#8b5cf6'} />
              
              <div className="relative z-10">
                {(() => {
                  const Icon = iconMap[categories[selectedCategory].icon] || BedDouble;
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <Icon className={`w-10 h-10 mb-3 ${selectedColors?.text}`} />
                    </motion.div>
                  );
                })()}
                <h2 className="text-2xl font-bold text-white mb-1">
                  {categories[selectedCategory].title}
                </h2>
                <p className={`text-sm ${selectedColors?.text} opacity-80`}>
                  {categories[selectedCategory].tips.length} techniques to guide you
                </p>
              </div>
            </motion.div>

            {/* Techniques */}
            <div className="space-y-4">
              {categories[selectedCategory].tips.map((tip, idx) => (
                <TechniqueCard 
                  key={tip.id} 
                  tip={tip} 
                  index={idx} 
                  colors={selectedColors || colorMap.violet} 
                />
              ))}
            </div>

            {/* Related suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
            >
              <p className="text-purple-300/40 text-xs">
                ✨ Each technique is a step closer to peaceful slumber
              </p>
            </motion.div>
          </div>
        ) : (
          // Category Grid View — NO progress bar
          <div className="max-w-4xl mx-auto">
            {/* Daily wisdom */}
            <DailyWisdom />

            {/* Category grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryList.map((category, idx) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  index={idx}
                  onClick={() => setSelectedCategory(category.slug)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="relative z-20 p-4 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/80 to-transparent border-t border-white/5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-3 h-3 text-purple-400/40" />
          </motion.div>
          <p className="text-xs text-purple-400/40 text-center">
            Wisdom drawn from Islamic tradition and modern sleep science
          </p>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-3 h-3 text-amber-400/40" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}