'use client';

import { useState, useMemo } from 'react';
import QuestionCard from './QuestionCard';
/**
 * Client component that owns search, category filtering, and expand state.
 * Receives the full questions array from the server page component.
 */
export default function QuestionList({ questions, onStartInterview }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  function pickRandom() {
    const random = questions[Math.floor(Math.random() * questions.length)];
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedSource('All');
    setExpandedId(random.id);
    setTimeout(() => {
      document.getElementById(`question-${random.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  // Build unique sorted category list from the data
  const categories = useMemo(() => {
    const cats = [...new Set(questions.map((q) => q.category))].sort();
    return ['All', ...cats];
  }, [questions]);

  // Build unique sorted source list from the data
  const sources = useMemo(() => {
    const srcs = [...new Set(questions.map((q) => q.source).filter(Boolean))].sort();
    return ['All', ...srcs];
  }, [questions]);

  // Filter questions based on search text, category, and difficulty
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const isNumberSearch = /^\d+$/.test(q);
    return questions.filter((item) => {
      const matchesSearch =
        !q ||
        (isNumberSearch && item.id === parseInt(q)) ||
        item.title.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      const matchesSource =
        selectedSource === 'All' || item.source === selectedSource;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesSource;
    });
  }, [questions, search, selectedCategory, selectedDifficulty, selectedSource]);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* ── Interview simulation banner ── */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col gap-3">
        <p className="text-sm font-semibold text-indigo-800">Ready to practice?</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={pickRandom}
            className="w-full px-4 py-2.5 bg-white border border-indigo-300 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Random Question
          </button>
          <button
            onClick={onStartInterview}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Simulate 3 Questions Interview
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center justify-between mb-6 text-sm text-slate-500">
        <span>
          <span className="font-semibold text-slate-700">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'question' : 'questions'}
          {(search || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedSource !== 'All') && ' matching'}
        </span>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setExpandedId(null); // Collapse all when searching
          }}
          placeholder="Search by title or question number..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          aria-label="Search questions"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Difficulty filter pills ── */}
      <div className="flex gap-2 flex-wrap mb-3">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => { setSelectedDifficulty(d); setExpandedId(null); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedDifficulty === d
                ? 'bg-slate-700 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ── Source filter pills ── */}
      <div className="flex gap-2 flex-wrap mb-3">
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => { setSelectedSource(src); setExpandedId(null); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedSource === src
                ? 'bg-violet-600 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:border-violet-300 hover:text-violet-600'
            }`}
          >
            {src}
          </button>
        ))}
      </div>

      {/* ── Category filter pills ── */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setExpandedId(null);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Question cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">?</p>
          <p className="font-medium">No questions match your search.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedDifficulty('All'); setSelectedSource('All'); }}
            className="mt-3 text-sm text-indigo-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isExpanded={expandedId === q.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === q.id ? null : q.id))
              }
            />
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-xs text-slate-400 mt-12">
        Questions updated regularly.
      </p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
