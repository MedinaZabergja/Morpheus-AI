'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

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

      if (!res.ok) {
        throw new Error(`Gabim nga serveri: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (err: any) {
      setError(err.message || 'Diçka shkoi gabim. Provo përsëri.');
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
            <div className="p-8 rounded-2xl glass animate-in fade-in zoom-in-95 duration-500 border-l-4 border-indigo-500">
              <h2 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <span role="img" aria-label="sparkles">✨</span>
                AI Response:
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-200 leading-8 whitespace-pre-wrap text-lg">
                  {response}
                </p>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
