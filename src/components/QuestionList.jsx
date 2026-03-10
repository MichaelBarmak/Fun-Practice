'use client';

import { useState, useMemo } from 'react';
import QuestionCard from './QuestionCard';
import { useSolvedQuestions } from '../hooks/useSolvedQuestions';

/**
 * Client component that owns search, category filtering, and expand state.
 * Receives the full questions array from the server page component.
 */
export default function QuestionList({ questions }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const { solvedIds, markSolved } = useSolvedQuestions();

  // Build unique sorted category list from the data
  const categories = useMemo(() => {
    const cats = [...new Set(questions.map((q) => q.category))].sort();
    return ['All', ...cats];
  }, [questions]);

  // Filter questions based on search text and selected category
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

      return matchesSearch && matchesCategory;
    });
  }, [questions, search, selectedCategory]);

  const solvedCount = solvedIds.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* ── Stats bar ── */}
      <div className="flex items-center justify-between mb-6 text-sm text-slate-500">
        <span>
          <span className="font-semibold text-slate-700">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'question' : 'questions'}
          {(search || selectedCategory !== 'All') && ' matching'}
        </span>
        <span>
          <span className="font-semibold text-emerald-600">{solvedCount}</span> /{' '}
          {questions.length} solved
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
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
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
              isSolved={solvedIds.includes(q.id)}
              onToggle={() =>
                setExpandedId((prev) => (prev === q.id ? null : q.id))
              }
              onSolve={() => markSolved(q.id)}
            />
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-xs text-slate-400 mt-12">
        Progress saved in your browser. Questions updated regularly.
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
