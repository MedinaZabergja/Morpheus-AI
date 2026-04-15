'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  BarChart3,
  User,
  Sparkles,
  Moon,
  RefreshCw,
  BedDouble,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { createClient } from './lib/supabaseClient';
import { WelcomeModal } from './components/WelcomeModal';
import { DreamCard, generateCreativeTitle } from './components/DreamCard';
import { AddDreamView } from './components/AddDreamView';
import { DreamDetailView } from './components/DreamDetailView';
import { SleepHelpView } from './components/SleepHelpView';
import { Starfield } from './components/Starfield';
import { StatisticsView } from './components/StatisticsView';

export interface Dream {
  id: string;
  content: string;
  ai_analysis: string;
  mood: string | null;
  title: string | null;
  created_at: string;
}

function DreamJournal() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAddDream, setShowAddDream] = useState(false);
  const [showSleepHelp, setShowSleepHelp] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [analyzeError, setAnalyzeError] = useState('');

  const { signOut, user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchDreams().then((fetchedDreams) => {
      if (fetchedDreams) {
        const needsTitles = fetchedDreams.some(
          (d) => !d.title || d.title === 'Untitled Dream'
        );
        if (needsTitles) {
          updateOldDreams(fetchedDreams);
        }
      }
    });

    const hasSeenWelcome = localStorage.getItem('dreamDeciphererWelcome');
    if (hasSeenWelcome) setShowWelcome(false);
  }, []);

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDreams(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching dreams:', err);
      return [];
    }
  };

  const updateOldDreams = async (currentDreams = dreams) => {
    setIsUpdating(true);
    const untitledDreams = currentDreams.filter(
      (d) => !d.title || d.title === 'Untitled Dream'
    );

    if (untitledDreams.length === 0) {
      setIsUpdating(false);
      return;
    }

    try {
      for (const dream of untitledDreams) {
        const newTitle = generateUniqueTitle(dream.content, currentDreams);
        await supabase.from('dreams').update({ title: newTitle }).eq('id', dream.id);
      }

      await fetchDreams();
      console.log('Updated all dreams with new titles!');
    } catch (err) {
      console.error('Failed to update titles:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('dreamDeciphererWelcome', 'true');
  };

  const handleAnalyze = async () => {
    if (!input.trim() || loading || saving) return;

    setLoading(true);
    setAnalyzeError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || 'The dream could not be analyzed right now. Please try again.'
        );
      }

      const reply = data?.reply;

      if (!reply || typeof reply !== 'string' || !reply.trim()) {
        throw new Error('The AI returned an empty response. Please try again.');
      }

      await saveDream(input, reply);

      setInput('');
      setShowAddDream(false);
      setAnalyzeError('');
    } catch (err) {
      console.error('Analysis error:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'A network or server error occurred. Please try again later.';

      setAnalyzeError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearAnalyzeError = () => {
    setAnalyzeError('');
  };

  const handleDeleteDream = async (dreamId: string) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setDreams(dreams.filter((d) => d.id !== dreamId));
      setSelectedDream(null);
    } catch (err) {
      console.error('Error deleting dream:', err);
      throw err;
    }
  };

  const generateUniqueTitle = (content: string, existingDreams: Dream[]): string => {
    const existingTitles = new Set(existingDreams.map((d) => d.title).filter(Boolean));
    let attempts = 0;
    let title = generateCreativeTitle(content);

    while (existingTitles.has(title) && attempts < 20) {
      title = generateCreativeTitle(content);
      attempts++;
    }

    if (existingTitles.has(title)) {
      let counter = 2;
      while (existingTitles.has(`${title} ${counter}`)) {
        counter++;
      }
      title = `${title} ${counter}`;
    }

    return title;
  };

  const saveDream = async (content: string, analysis: string) => {
    setSaving(true);
    try {
      const title = generateUniqueTitle(content, dreams);

      const lowerAnalysis = analysis.toLowerCase();

      const mood = lowerAnalysis.includes('anxious')
        ? 'anxious'
        : lowerAnalysis.includes('peaceful')
        ? 'peaceful'
        : 'mysterious';

      const { error } = await supabase.from('dreams').insert({
        user_id: user?.id,
        content,
        ai_analysis: analysis,
        mood,
        title,
      });

      if (error) {
        throw new Error('Your dream was analyzed, but it could not be saved.');
      }

      await fetchDreams();
    } catch (err) {
      console.error('Error saving:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const filteredDreams = dreams.filter(
    (dream) =>
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.ai_analysis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white font-sans relative">
      <Starfield />

      <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />

      <header className="sticky top-0 z-30 bg-[#1a0b2e]/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-purple-300" />
            <h1 className="text-xl font-bold font-serif">MorpheusAI</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <button
              onClick={() => setShowSleepHelp(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-colors text-purple-300"
            >
              <BedDouble className="w-5 h-5" />
              <span className="text-sm">Sleep Help</span>
            </button>

            <button
              onClick={() => setShowStatistics(true)}
              className="p-2 rounded-xl hover:bg-purple-500/20 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-purple-300" />
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl hover:bg-purple-500/20 transition-colors"
            >
              <User className="w-5 h-5 text-purple-300" />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by theme or mood..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2d1b4e]/50 border border-purple-500/20 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/50 font-sans"
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 pb-24">
        {filteredDreams.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500/30" />
            <p className="text-purple-300/50 font-serif text-lg">
              No dreams yet. Start journaling!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onClick={() => setSelectedDream(dream)}
              />
            ))}
          </div>
        )}
      </main>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setAnalyzeError('');
          setShowAddDream(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/40 z-30"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {showAddDream && (
          <AddDreamView
            isOpen={showAddDream}
            onClose={() => {
              setAnalyzeError('');
              setShowAddDream(false);
            }}
            input={input}
            setInput={setInput}
            onAnalyze={handleAnalyze}
            loading={loading || saving}
            serverError={analyzeError}
            clearServerError={clearAnalyzeError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSleepHelp && (
          <SleepHelpView
            isOpen={showSleepHelp}
            onClose={() => setShowSleepHelp(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStatistics && (
          <StatisticsView
            isOpen={showStatistics}
            onClose={() => setShowStatistics(false)}
            dreams={dreams}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDream && (
          <DreamDetailView
            dream={selectedDream}
            onClose={() => setSelectedDream(null)}
            onDelete={handleDeleteDream}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DreamJournal />
    </ProtectedRoute>
  );
}