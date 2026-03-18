'use client';

import { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import InterviewMode from './InterviewMode';

export default function AppClient({ questions }) {
  const [mode, setMode] = useState('list'); // 'list' | 'interview'
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (mode === 'interview') {
    return <InterviewMode questions={questions} onExit={() => setMode('list')} />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase mb-2">
            Interview Prep
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            LeetProb
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl">
            Test your intuition, check your answers, and deepen your understanding.
          </p>
        </div>
      </div>

      <QuestionList questions={questions} onStartInterview={() => setMode('interview')} />

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </main>
  );
}
