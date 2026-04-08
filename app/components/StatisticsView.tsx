'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Moon, Calendar, TrendingUp, Sparkles, Brain } from 'lucide-react';
import { Dream } from '../page';

interface StatisticsViewProps {
  isOpen: boolean;
  onClose: () => void;
  dreams: Dream[];
}

export function StatisticsView({ isOpen, onClose, dreams }: StatisticsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'moods' | 'timeline'>('overview');

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
             mood === 'peaceful' ? 'from-blue-400 to-cyan-400' :
             mood === 'mysterious' ? 'from-purple-400 to-indigo-400' :
             'from-gray-400 to-gray-500'
    }));

    const timelineData = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = dreams.filter(d => d.created_at.startsWith(dateStr)).length;
      timelineData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count,
        isToday: i === 0
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
    };
  }, [dreams]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#1a0b2e] z-40 flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-300" />
          <span className="text-purple-300 font-semibold">Dream Statistics</span>
        </div>
      </div>

      <div className="flex px-6 pt-4 gap-4 border-b border-purple-500/10">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'moods', label: 'Moods', icon: Brain },
          { id: 'timeline', label: 'Timeline', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-purple-300 border-purple-500'
                : 'text-purple-400/50 border-transparent hover:text-purple-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!stats ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Moon className="w-16 h-16 text-purple-500/30 mb-4" />
            <p className="text-purple-300/50 text-lg">No dreams yet to analyze</p>
            <p className="text-purple-400/40 text-sm mt-2">Start journaling to see your statistics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Current Streak</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{stats.streak}</span>
                    <span className="text-purple-300">day{stats.streak !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-sm text-purple-400/70 mt-2">
                    {stats.streak > 0 ? 'Keep the momentum going!' : 'Start your streak today'}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Moon className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Total Dreams</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalDreams}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">This Week</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.thisWeek}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">This Month</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.thisMonth}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Avg/Week</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.averagePerWeek}</p>
                  </motion.div>
                </div>
              </>
            )}

            {activeTab === 'moods' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Mood Distribution</h3>
                {stats.moodData.map((mood, idx) => (
                  <motion.div
                    key={mood.mood}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${mood.color}`} />
                        <span className="text-white font-medium capitalize">{mood.mood}</span>
                      </div>
                      <span className="text-purple-300">{mood.count} dreams</span>
                    </div>
                    <div className="h-4 bg-purple-900/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mood.percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full bg-gradient-to-r ${mood.color}`}
                      />
                    </div>
                    <p className="text-sm text-purple-400/70 mt-2">{mood.percentage}% of your dreams</p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Last 14 Days</h3>
                <div className="glass-card rounded-2xl p-5 border border-purple-500/20">
                  <div className="flex items-end justify-between h-48 gap-2">
                    {stats.timelineData.map((day, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.count / Math.max(...stats.timelineData.map(d => d.count), 1)) * 100}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          className={`w-full rounded-t-lg min-h-[4px] ${
                            day.count > 0 
                              ? 'bg-gradient-to-t from-purple-500 to-purple-400' 
                              : 'bg-purple-500/20'
                          }`} />
                        <span className={`text-xs ${day.isToday ? 'text-purple-300 font-semibold' : 'text-purple-500/50'}`}>
                          {day.date.split(',')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-purple-400/70 text-center">
                  Your dream journaling activity over the past two weeks
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}