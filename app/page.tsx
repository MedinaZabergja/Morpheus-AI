'use client';

import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function DreamJournal() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const { signOut, user } = useAuth();

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
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
                  // Skip empty lines
                  if (!line.trim()) return <div key={i} className="h-4" />;
                  
                  // Main headers (remove ** and style as headers)
                  if (line.startsWith('**') && line.endsWith('**') && !line.includes(':')) {
                    const text = line.replace(/\*\*/g, '');
                    return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{text}</h3>;
                  }
                  
                  // Section headers with colons
                  if (line.startsWith('**') && line.includes(':**')) {
                    const text = line.replace(/\*\*/g, '');
                    return <h4 key={i} className="text-lg font-semibold text-indigo-300 mt-5 mb-2">{text}</h4>;
                  }
                  
                  // Numbered list items
                  if (/^\d+\.\s/.test(line)) {
                    const content = line.replace(/\*\*/g, '').replace(/^\d+\.\s/, '');
                    return (
                      <div key={i} className="flex gap-3 my-2 ml-2">
                        <span className="text-indigo-400 font-mono">{line.match(/^\d+/)?.[0]}.</span>
                        <span className="text-slate-300">{content}</span>
                      </div>
                    );
                  }
                  
                  // Regular text (clean up any remaining **)
                  const cleanText = line.replace(/\*\*/g, '');
                  return <p key={i} className="text-slate-300 my-2">{cleanText}</p>;
                })}
              </div>
            </div>
          )}
        </section>

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