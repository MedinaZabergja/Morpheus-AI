'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, BarChart3, Moon, Calendar, TrendingUp, Sparkles, Brain, Flame, Star, Clock, Compass } from 'lucide-react';
import { Dream } from '../page';

interface StatisticsViewProps {
  isOpen: boolean;
  onClose: () => void;
  dreams: Dream[];
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [display]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}
// Mood constellation data
const moodConstellations: Record<string, { stars: number; emoji: string; quote: string; color: string }> = {
  anxious: { stars: 3, emoji: '😰', quote: 'Storms pass, leaving clarity in their wake', color: '#fca5a5' },
  peaceful: { stars: 5, emoji: '😌', quote: 'Serenity flows through your dreaming mind', color: '#86efac' },
  mysterious: { stars: 7, emoji: '🔮', quote: 'The unknown beckons with infinite possibility', color: '#c084fc' },
};

// Fortune-style insights
function generateInsight(stats: any): string {
  if (!stats) return 'The stars await your first vision...';
  
  const { totalDreams, streak, moodData } = stats;
  const dominantMood = moodData[0]?.mood || 'mysterious';
  
  if (totalDreams === 0) return 'The tapestry of dreams remains unwritten...';
  if (streak >= 7) return 'The spirits are pleased. Your dedication has awakened ancient wisdom.';
  if (streak >= 3) return 'The threads of fate grow stronger with each passing night.';
  if (dominantMood === 'anxious') return 'Your mind processes shadows. Rest comes to those who confront them.';
  if (dominantMood === 'peaceful') return 'Tranquility flows through your spirit like moonlight on still waters.';
  if (totalDreams > 20) return 'You have become a true seer. The realm reveals its secrets to you.';
  return 'Each vision is a key. Keep unlocking the doors of perception.';
}

export function StatisticsView({ isOpen, onClose, dreams }: StatisticsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'moods' | 'timeline'>('overview');
  const [showInsight, setShowInsight] = useState(false);

  const stats = useMemo(() => {
    if (!dreams.length) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDreams = dreams.length;
    const thisWeek = dreams.filter(d => new Date(d.created_at) > oneWeekAgo).length;
    const thisMonth = dreams.filter(d => new Date(d.created_at) > oneMonthAgo).length;

    const moodCounts = dreams.reduce((acc, dream) => {
      const mood = dream.mood || 'mysterious';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / totalDreams) * 100),
      color: mood === 'anxious' ? 'from-red-400 to-orange-400' :
             mood === 'peaceful' ? 'from-emerald-400 to-teal-400' :
             'from-purple-400 to-indigo-400',
      glowColor: mood === 'anxious' ? 'rgba(239, 68, 68, 0.3)' :
                 mood === 'peaceful' ? 'rgba(34, 197, 94, 0.3)' :
                 'rgba(168, 85, 247, 0.3)',
      textColor: mood === 'anxious' ? '#fca5a5' :
                 mood === 'peaceful' ? '#86efac' :
                 '#c084fc'
    })).sort((a, b) => b.count - a.count);

    const timelineData = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayDreams = dreams.filter(d => d.created_at.startsWith(dateStr));
      timelineData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayDreams.length,
        isToday: i === 0,
        moods: dayDreams.map(d => d.mood || 'mysterious')
      });
    }

    let streak = 0;
    const sortedDreams = [...dreams].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    if (sortedDreams.length > 0) {
      const lastDream = new Date(sortedDreams[0].created_at);
      const daysSinceLastDream = Math.floor((now.getTime() - lastDream.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastDream <= 1) {
        streak = 1;
        for (let i = 1; i < sortedDreams.length; i++) {
          const current = new Date(sortedDreams[i].created_at);
          const prev = new Date(sortedDreams[i - 1].created_at);
          const diffDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const firstDream = dreams[dreams.length - 1];
    const firstDreamDate = firstDream ? new Date(firstDream.created_at) : now;
    const weeksSinceFirst = Math.max(1, Math.ceil((now.getTime() - firstDreamDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const averagePerWeek = Math.round((totalDreams / weeksSinceFirst) * 10) / 10;

    return {
      totalDreams,
      thisWeek,
      thisMonth,
      moodData,
      timelineData,
      streak,
      averagePerWeek,
      dominantMood: moodData[0]?.mood || 'mysterious'
    };
  }, [dreams]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowInsight(true), 800);
      return () => clearTimeout(timer);
    }
    setShowInsight(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const insight = generateInsight(stats);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0a0518] z-40 flex flex-col overflow-hidden"
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${stats ? moodConstellations[stats.dominantMood]?.color || '#a855f7' : '#a855f7'} 0%, transparent 70%)`,
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Floating particles */}
      <StatsParticles />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
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

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </motion.div>
          <span className="text-purple-300 font-semibold font-sans">Dream Statistics</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex px-6 pt-4 gap-2 border-b border-purple-500/10"
      >
        {[
          { id: 'overview', label: 'Overview', icon: Compass },
          { id: 'moods', label: 'Moods', icon: Sparkles },
          { id: 'timeline', label: 'Timeline', icon: Calendar },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 flex items-center gap-2 text-sm font-medium transition-all rounded-t-xl ${
              activeTab === tab.id
                ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                : 'text-purple-400/50 border-b-2 border-transparent hover:text-purple-300 hover:bg-purple-500/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {!stats ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="text-6xl mb-4"
              style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))' }}
            >
              🌙
            </motion.div>
            <p className="text-purple-300/50 text-lg font-serif italic">"The stars have not yet aligned..."</p>
            <p className="text-purple-400/40 text-sm mt-2 font-sans">Begin your journey to reveal the patterns</p>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Oracle Insight */}
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.4) 0%, rgba(26, 11, 46, 0.6) 100%)',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    boxShadow: '0 0 40px rgba(157, 78, 221, 0.2)',
                  }}
                >
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${moodConstellations[stats.dominantMood]?.color || '#a855f7'} 0%, transparent 70%)` }}
                  />
                  <div className="relative z-10 flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                    </motion.div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-purple-400/60 mb-1 font-sans">The Oracle Speaks</p>
                      <p className="text-white/90 font-serif italic text-lg leading-relaxed" style={{ textShadow: '0 0 20px rgba(224, 170, 255, 0.2)' }}>
                        "{insight}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Streak Card with Flame */}
                  <motion.div
                    className="rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
                      border: '2px solid rgba(157, 78, 221, 0.4)',
                      boxShadow: '0 0 60px rgba(157, 78, 221, 0.25), inset 0 0 30px rgba(157, 78, 221, 0.05)',
                    }}
                  >
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
                      style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Flame className="w-6 h-6 text-orange-400" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-white font-sans">Current Streak</h3>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-white font-serif">
                          <AnimatedCounter value={stats.streak} />
                        </span>
                        <span className="text-purple-300 text-lg">night{stats.streak !== 1 ? 's' : ''}</span>
                      </div>

                      {/* Streak flame visualization */}
                      <div className="flex gap-1 mt-4">
                        {Array.from({ length: Math.min(stats.streak, 7) }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <motion.span
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                              className="text-xl"
                            >
                              🔥
                            </motion.span>
                          </motion.div>
                        ))}
                        {stats.streak === 0 && (
                          <span className="text-purple-400/50 text-sm italic font-serif">The flame awaits your first spark...</span>
                        )}
                      </div>

                      <p className="text-sm mt-3 font-serif italic" style={{ color: '#e0aaff' }}>
                        {stats.streak > 0 
                          ? `"The spirits smile upon your dedication..."` 
                          : `"Begin tonight, and the stars shall remember."`}
                      </p>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Moon, label: 'Total Visions', value: stats.totalDreams, delay: 0.1 },
                      { icon: Calendar, label: 'This Moon Cycle', value: stats.thisWeek, delay: 0.2 },
                      { icon: TrendingUp, label: 'This Season', value: stats.thisMonth, delay: 0.3 },
                      { icon: Star, label: 'Avg per Cycle', value: stats.averagePerWeek, delay: 0.4, suffix: '' },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="rounded-2xl p-5 relative overflow-hidden cursor-default"
                        style={{
                          background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.4) 0%, rgba(26, 11, 46, 0.6) 100%)',
                          border: '1px solid rgba(192, 132, 252, 0.2)',
                          boxShadow: '0 0 20px rgba(157, 78, 221, 0.1)',
                        }}
                      >
                        <div
                          className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-20 blur-2xl pointer-events-none"
                          style={{ background: 'radial-gradient(circle, #9d4edd 0%, transparent 70%)' }}
                        />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 text-purple-400/60 mb-2">
                            <stat.icon className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider font-sans">{stat.label}</span>
                          </div>
                          <p className="text-3xl font-bold text-white font-serif">
                            {stat.suffix !== undefined ? stats.averagePerWeek : <AnimatedCounter value={stat.value} />}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'moods' && (
                <motion.div
                  key="moods"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-white font-sans flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Mood Constellation
                  </h3>

                  {/* Constellation Visualization */}
                  <div className="rounded-2xl p-8 relative overflow-hidden flex items-center justify-center min-h-[200px]"
                    style={{
                      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
                      border: '2px solid rgba(157, 78, 221, 0.4)',
                      boxShadow: '0 0 60px rgba(157, 78, 221, 0.2)',
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      {stats.moodData.map((mood, idx) => {
                        const angle = (idx / stats.moodData.length) * 2 * Math.PI - Math.PI / 2;
                        const radius = 60;
                        const x = 50 + Math.cos(angle) * radius;
                        const y = 50 + Math.sin(angle) * radius;
                        
                        return (
                          <motion.div
                            key={mood.mood}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.3 }}
                            className="absolute"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <motion.div
                              animate={{ 
                                boxShadow: [
                                  `0 0 20px ${mood.glowColor}`,
                                  `0 0 40px ${mood.glowColor}`,
                                  `0 0 20px ${mood.glowColor}`
                                ]
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="w-4 h-4 rounded-full"
                              style={{ background: mood.textColor }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        className="text-4xl mb-2"
                      >
                        ✨
                      </motion.div>
                      <p className="text-xs text-purple-400/60 font-sans uppercase tracking-widest">Your Emotional Cosmos</p>
                    </div>
                  </div>

                  {/* Mood Cards */}
                  {stats.moodData.map((mood, idx) => {
                    const config = moodConstellations[mood.mood] || moodConstellations.mysterious;
                    return (
                      <motion.div
                        key={mood.mood}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-2xl p-5 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${mood.glowColor} 0%, rgba(26, 11, 46, 0.6) 100%)`,
                          border: `1px solid ${mood.glowColor}`,
                          boxShadow: `0 0 30px ${mood.glowColor}`,
                        }}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{config.emoji}</span>
                              <div>
                                <span className="text-white font-medium capitalize font-sans text-lg">{mood.mood}</span>
                                <p className="text-xs font-serif italic" style={{ color: mood.textColor }}>{config.quote}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-white font-serif">{mood.count}</span>
                              <span className="text-sm text-purple-300/60 block font-sans">visions</span>
                            </div>
                          </div>
                          
                          <div className="h-3 bg-black/30 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${mood.percentage}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                              className={`h-full rounded-full bg-gradient-to-r ${mood.color} relative`}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                              />
                            </motion.div>
                          </div>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-xs" style={{ color: mood.textColor }}>{mood.percentage}% of your dreams</span>
                            <div className="flex gap-1">
                              {Array.from({ length: Math.min(config.stars, 5) }).map((_, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1 + i * 0.1 }}
                                >
                                  ⭐
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-white font-sans flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Lunar Cycle — Last 14 Nights
                  </h3>

                  <div className="rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
                      border: '2px solid rgba(157, 78, 221, 0.4)',
                      boxShadow: '0 0 60px rgba(157, 78, 221, 0.2)',
                    }}
                  >
                    <div className="flex items-end justify-between h-56 gap-2 relative">
                      {/* Background grid lines */}
                      {[1, 2, 3].map((line) => (
                        <div
                          key={line}
                          className="absolute left-0 right-0 border-t border-purple-500/10"
                          style={{ bottom: `${line * 25}%` }}
                        />
                      ))}

                      {stats.timelineData.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative">
                          {/* Moon phase indicator */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative"
                          >
                            {day.count > 0 ? (
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, delay: idx * 0.1, repeat: Infinity }}
                                className="text-lg"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}
                              >
                                🌙
                              </motion.div>
                            ) : (
                              <span className="text-lg opacity-20">⚫</span>
                            )}
                          </motion.div>

                          {/* Bar */}
                          <div className="w-full flex-1 flex items-end relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max((day.count / Math.max(...stats.timelineData.map(d => d.count), 1)) * 100, 4)}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                              className="w-full rounded-t-lg relative overflow-hidden"
                              style={{
                                background: day.count > 0 
                                  ? 'linear-gradient(to top, #7c3aed, #a78bfa)' 
                                  : 'rgba(124, 58, 237, 0.1)',
                                minHeight: day.count > 0 ? '4px' : '4px',
                              }}
                            >
                              {day.count > 0 && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
                                  animate={{ y: ['100%', '-100%'] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />
                              )}
                            </motion.div>
                          </div>

                          {/* Day label */}
                          <span className={`text-xs font-sans ${day.isToday ? 'text-purple-300 font-bold' : 'text-purple-500/50'}`}>
                            {day.date}
                          </span>
                          
                          {/* Full date tooltip */}
                          <span className="text-[10px] text-purple-500/30 font-sans">
                            {day.fullDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline legend */}
                  <div className="flex items-center justify-center gap-6 text-sm text-purple-400/60 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌙</span>
                      <span>Dream recorded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg opacity-20">⚫</span>
                      <span>Silent night</span>
                    </div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-sm font-serif italic"
                    style={{ color: '#e0aaff', textShadow: '0 0 15px rgba(224, 170, 255, 0.2)' }}
                  >
                    "The moon remembers every vision you have shared..."
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center py-6"
            >
              <p className="text-xs text-purple-400/30 font-serif italic">
                ✦ The stars chart your journey through the realm of sleep ✦
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Floating particles for stats atmosphere
function StatsParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 2}px rgba(192, 132, 252, 0.2)`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.5, 0],
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