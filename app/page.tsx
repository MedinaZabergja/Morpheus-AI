'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { createClient } from './lib/supabaseClient';

interface Dream {
  id: string;
  content: string;
  ai_analysis: string;
  mood: string | null;
  title: string | null;
  created_at: string;
}

function DreamJournal() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [saving, setSaving] = useState(false);
  const { signOut, user } = useAuth();
  const supabase = createClient();

  // Load dreams from database on mount
  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDreams(data || []);
    } catch (err: any) {
      console.error('Error fetching dreams:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (res.status === 401) {
        throw new Error('Please log in to use the AI features');
      }

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.reply);
      
      // Save to database
      await saveDream(input, data.reply);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDream = async (content: string, analysis: string) => {
    setSaving(true);
    try {
      // Extract mood and title from analysis
      const mood = extractMood(analysis);
      const title = extractTitle(analysis);

      const { error } = await supabase
        .from('dreams')
        .insert({
          user_id: user?.id,
          content: content,
          ai_analysis: analysis,
          mood: mood,
          title: title,
        });

      if (error) throw error;
      
      // Refresh dreams list
      await fetchDreams();
    } catch (err: any) {
      console.error('Error saving dream:', err);
      setError('Dream analyzed but failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteDream = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setDreams(dreams.filter(d => d.id !== id));
    } catch (err: any) {
      console.error('Error deleting dream:', err);
      setError('Failed to delete dream.');
    }
  };

  // Extract mood from AI response
  const extractMood = (analysis: string): string => {
    const moods = ['anxious', 'adventurous', 'peaceful', 'mysterious', 'joyful', 'nostalgic', 'surreal'];
    const lower = analysis.toLowerCase();
    for (const mood of moods) {
      if (lower.includes(mood)) return mood;
    }
    return 'mysterious';
  };

  // Extract title from AI response
  const extractTitle = (analysis: string): string => {
    const match = analysis.match(/\*\*Title:\*\*\s*["']?([^"'\n]+)["']?/i);
    return match ? match[1].trim() : 'Untitled Dream';
  };

  return (
    <main className="min-h-screen py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
            Morpheus 🌙 AI
          </h1>
          <p className="text-slate-400 text-sm">Powered by Gemini & Next.js</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-slate-500 text-xs">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Input Form */}
        <section className="space-y-6">
          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your question here..."
              className="w-full p-6 h-48 rounded-2xl glass placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-lg"
              disabled={loading}
            />
            
            <div className="absolute bottom-4 right-4 focus-within:z-10">
                <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/30 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                {loading ? (
                    <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ✨ Thinking...
                    </>
                ) : (
                    <>✨ Send</>
                )}
                </button>
            </div>
          </form>

          {/* Loading status box */}
          {loading && (
            <div className="p-4 rounded-xl glass flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="text-xl">🌙</span>
              <span className="text-slate-300">AI is analyzing your question...</span>
            </div>
          )}

          {/* Saving status */}
          {saving && (
            <div className="p-4 rounded-xl glass flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="text-xl">💾</span>
              <span className="text-slate-300">Saving dream to journal...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 rounded-2xl glass-error flex items-start justify-between gap-5 animate-in fade-in slide-in-from-top-4 duration-500 border-l-4 border-red-500/50">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xl" role="img" aria-label="error">🚫</span>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-red-100 text-lg">Unable to reach Morpheus</p>
                  <p className="text-red-200/70 leading-relaxed text-sm">
                    {error.includes('500') || error.includes('invalid') 
                      ? "The AI engine encountered a temporary hiccup. Please try rephrasing or sending again in a moment." 
                      : error}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setError('')} 
                className="text-red-300 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                 <span className="text-xs font-black">CLOSE</span>
              </button>
            </div>
          )}

          {/* Response State */}
          {response && !loading && (
            <div className="p-8 rounded-2xl glass animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-base font-semibold text-indigo-400 mb-6 uppercase tracking-wider">
                Dream Analysis
              </h2>
              <div className="response-content text-slate-200 leading-relaxed">
                {response.split('\n').map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-4" />;
                  
                  if (line.startsWith('**') && line.endsWith('**') && !line.includes(':')) {
                    const text = line.replace(/\*\*/g, '');
                    return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{text}</h3>;
                  }
                  
                  if (line.startsWith('**') && line.includes(':**')) {
                    const text = line.replace(/\*\*/g, '');
                    return <h4 key={i} className="text-lg font-semibold text-indigo-300 mt-5 mb-2">{text}</h4>;
                  }
                  
                  if (/^\d+\.\s/.test(line)) {
                    const content = line.replace(/\*\*/g, '').replace(/^\d+\.\s/, '');
                    return (
                      <div key={i} className="flex gap-3 my-2 ml-2">
                        <span className="text-indigo-400 font-mono">{line.match(/^\d+/)?.[0]}.</span>
                        <span className="text-slate-300">{content}</span>
                      </div>
                    );
                  }
                  
                  const cleanText = line.replace(/\*\*/g, '');
                  return <p key={i} className="text-slate-300 my-2">{cleanText}</p>;
                })}
              </div>
            </div>
          )}
        </section>

        {/* Dream History from Database */}
        {dreams.length > 0 && (
          <section className="space-y-6 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Dream Journal ({dreams.length})</h2>
            {dreams.map((dream) => (
              <div key={dream.id} className="p-6 rounded-2xl glass border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-300">
                      {dream.title || 'Untitled Dream'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(dream.created_at).toLocaleString()}
                    </p>
                    {dream.mood && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-indigo-500/20 text-indigo-300">
                        {dream.mood}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDream(dream.id)}
                    className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-slate-300 text-sm mb-3 italic">{dream.content}</p>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-200 text-sm whitespace-pre-wrap">{dream.ai_analysis}</p>
                </div>
              </div>
            ))}
          </section>
        )}

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DreamJournal />
    </ProtectedRoute>
  );
}