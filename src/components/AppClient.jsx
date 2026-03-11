'use client';

import { useState } from 'react';
import QuestionList from './QuestionList';
import InterviewMode from './InterviewMode';

export default function AppClient({ questions }) {
  const [mode, setMode] = useState('list'); // 'list' | 'interview'

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
    </main>
  );
}
