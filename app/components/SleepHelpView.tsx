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
  Heart,
  ChevronRight,
  Bookmark,
  Sparkles
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

interface SavedTip {
  id: string;
  tip_id: string;
  is_favorite: boolean;
  notes: string | null;
  created_at: string;
  sleep_tips: SleepTip | null;
}

interface SleepHelpViewProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  smartphone: Smartphone,
  bed: BedDouble,
  utensils: Utensils,
  shield: Shield,
  clock: Clock,
};

const colorMap: Record<string, string> = {
  rose: 'from-rose-500/20 to-pink-600/20 border-rose-500/30 text-rose-300',
  blue: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30 text-blue-300',
  emerald: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-300',
  amber: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-300',
  violet: 'from-violet-500/20 to-purple-600/20 border-violet-500/30 text-violet-300',
  cyan: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-300',
};

export function SleepHelpView({ isOpen, onClose, userId }: SleepHelpViewProps) {
  const [tips, setTips] = useState<SleepTip[]>([]);
  const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'saved'>('browse');

  useEffect(() => {
    if (isOpen) {
      fetchTips();
      fetchSavedTips();
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

  const fetchSavedTips = async () => {
    try {
      const { createClient } = await import('../lib/supabaseClient');
      const supabase = createClient();
      
      const { data: savedData, error: savedError } = await supabase
        .from('sleep_help')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;
      
      if (!savedData || savedData.length === 0) {
        setSavedTips([]);
        return;
      }

      const tipIds = savedData.map(s => s.tip_id).filter(Boolean);
      
      let tipsData: SleepTip[] = [];
      if (tipIds.length > 0) {
        const { data: tips, error: tipsError } = await supabase
          .from('sleep_tips')
          .select('*')
          .in('id', tipIds);
        
        if (!tipsError && tips) {
          tipsData = tips;
        }
      }

      const joinedData = savedData.map(saved => ({
        ...saved,
        sleep_tips: tipsData.find(t => t.id === saved.tip_id) || null
      })).filter(s => s.sleep_tips) as SavedTip[];

      setSavedTips(joinedData);
    } catch (err) {
      console.error('Error fetching saved tips:', err);
      setSavedTips([]);
    }
  };

  const saveTip = async (tip: SleepTip) => {
    try {
      const { createClient } = await import('../lib/supabaseClient');
      const supabase = createClient();
      
      const { error } = await supabase.from('sleep_help').insert({
        user_id: userId,
        tip_id: tip.id,
        problem: tip.category_title,
        ai_response: tip.content,
        category: tip.category_slug,
        is_favorite: true,
      });

      if (error) throw error;
      await fetchSavedTips();
    } catch (err) {
      console.error('Error saving tip:', err);
    }
  };

  const toggleFavorite = async (savedTip: SavedTip) => {
    try {
      const { createClient } = await import('../lib/supabaseClient');
      const supabase = createClient();
      
      const { error } = await supabase
        .from('sleep_help')
        .update({ is_favorite: !savedTip.is_favorite })
        .eq('id', savedTip.id);

      if (error) throw error;
      await fetchSavedTips();
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const deleteSavedTip = async (id: string) => {
    try {
      const { createClient } = await import('../lib/supabaseClient');
      const supabase = createClient();
      
      const { error } = await supabase
        .from('sleep_help')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSavedTips();
    } catch (err) {
      console.error('Error deleting tip:', err);
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
          onClick={() => {
            if (selectedCategory) {
              setSelectedCategory(null);
            } else {
              onClose();
            }
          }}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{selectedCategory ? 'Back to Categories' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-purple-300" />
          <span className="text-purple-300 font-semibold">Sleep Sanctuary</span>
        </div>
      </div>

      {!selectedCategory && (
        <div className="flex px-6 pt-4 gap-4">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'browse'
                ? 'text-purple-300 border-purple-500'
                : 'text-purple-400/50 border-transparent hover:text-purple-300'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'saved'
                ? 'text-purple-300 border-purple-500'
                : 'text-purple-400/50 border-transparent hover:text-purple-300'
            }`}
          >
            Saved ({savedTips.filter(s => s.is_favorite).length})
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'saved' && !selectedCategory ? (
          <div className="space-y-4">
            {savedTips.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto mb-4 text-purple-500/30" />
                <p className="text-purple-300/50">No saved tips yet. Browse and bookmark what resonates.</p>
              </div>
            ) : (
              savedTips.map((saved) => {
                if (!saved.sleep_tips) return null;
                
                return (
                  <motion.div
                    key={saved.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                        {saved.sleep_tips.category_title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(saved)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              saved.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-purple-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => deleteSavedTip(saved.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-purple-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {saved.sleep_tips.tip_title}
                    </h3>
                    <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
                      {saved.sleep_tips.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 rounded-lg px-3 py-2">
                      <Sparkles className="w-3 h-3" />
                      {saved.sleep_tips.quick_action}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : selectedCategory ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${colorMap[categories[selectedCategory].color]} border mb-6`}>
              {(() => {
                const Icon = iconMap[categories[selectedCategory].icon] || BedDouble;
                return <Icon className="w-8 h-8 mb-2" />;
              })()}
              <h2 className="text-xl font-bold text-white">
                {categories[selectedCategory].title}
              </h2>
              <p className="text-sm opacity-80 mt-1">
                {categories[selectedCategory].tips.length} techniques
              </p>
            </div>

            {categories[selectedCategory].tips.map((tip, idx) => {
              const isSaved = savedTips.some(s => s.tip_id === tip.id);
              
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {tip.tip_title}
                    </h3>
                    <button
                      onClick={() => isSaved ? null : saveTip(tip)}
                      disabled={isSaved}
                      className={`p-2 rounded-lg transition-all ${
                        isSaved 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'hover:bg-purple-500/20 text-purple-400 hover:text-purple-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <p className="text-purple-200/80 text-sm leading-relaxed mb-4">
                    {tip.content}
                  </p>
                  
                  <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 bg-gradient-to-r ${colorMap[tip.color]}`}>
                    <Sparkles className="w-3 h-3" />
                    <span className="font-medium">{tip.quick_action}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryList.map((category, idx) => {
              const Icon = iconMap[category.icon] || BedDouble;
              const isSaved = savedTips.some(s => 
                category.tips.some(t => t.id === s.tip_id)
              );

              return (
                <motion.button
                  key={category.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`relative overflow-hidden rounded-2xl p-5 border text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${colorMap[category.color]}`}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className="w-8 h-8" />
                      {isSaved && (
                        <Bookmark className="w-4 h-4 fill-current opacity-60" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm opacity-80">
                      {category.tips.length} techniques
                    </p>
                    <ChevronRight className="w-5 h-5 mt-3 opacity-60" />
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-t from-[#1a0b2e] to-transparent border-t border-purple-500/10">
        <p className="text-xs text-purple-400/60 text-center">
          Wisdom drawn from Islamic tradition and modern sleep science
        </p>
      </div>
    </motion.div>
  );
}