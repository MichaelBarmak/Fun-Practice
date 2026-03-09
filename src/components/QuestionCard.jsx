'use client';

import { useState } from 'react';
import { checkAnswer } from '../utils/answerChecker';

// ── Badge helpers ────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
};

const CATEGORY_STYLE = 'bg-indigo-100 text-indigo-700';

// ── Main component ────────────────────────────────────────────────────────────

/**
 * A single question card with expand/collapse accordion behaviour.
 *
 * Props:
 *   question   — question object from questions.json
 *   isExpanded — whether the detail panel is open
 *   isSolved   — whether the user has marked this as solved
 *   onToggle   — callback to open/close this card
 *   onSolve    — callback to mark the question as solved
 */
export default function QuestionCard({
  question,
  isExpanded,
  isSolved,
  onToggle,
  onSolve,
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [solutionVisible, setSolutionVisible] = useState(false);

  function handleCheckAnswer() {
    const result = checkAnswer(question, userAnswer);
    if (result === true) {
      setFeedback('correct');
      onSolve();
    } else {
      setFeedback('incorrect');
    }
  }

  function handleRevealSolution() {
    setSolutionVisible(true);
    onSolve(); // Viewing the solution counts as "solved"
  }

  // Reset per-card state when the card is closed
  function handleToggle() {
    if (isExpanded) {
      setUserAnswer('');
      setFeedback(null);
      setSolutionVisible(false);
    }
    onToggle();
  }

  return (
    <div
      className={`bg-white rounded-xl border transition-shadow duration-200 overflow-hidden
        ${isExpanded ? 'border-indigo-300 shadow-md' : 'border-slate-200 hover:shadow-sm'}`}
    >
      {/* ── Card header (always visible, clickable) ── */}
      <button
        onClick={handleToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-xl"
        aria-expanded={isExpanded}
      >
        {/* Solved checkmark */}
        <div className="mt-0.5 flex-shrink-0 w-5 h-5">
          {isSolved ? (
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold"
              title="Solved"
            >
              ✓
            </span>
          ) : (
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300" />
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
              {question.title}
            </span>
            {question.isNew && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 uppercase tracking-wide">
                New
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLE}`}>
              {question.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                DIFFICULTY_STYLES[question.difficulty] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          {/* Preview — hidden when expanded */}
          {!isExpanded && (
            <p className="text-sm text-slate-500 line-clamp-2">{question.preview}</p>
          )}
        </div>

        {/* Chevron */}
        <span
          className={`flex-shrink-0 mt-1 text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <ChevronIcon />
        </span>
      </button>

      {/* ── Expandable detail panel ── */}
      <div
        className={`overflow-hidden ${isExpanded ? 'accordion-open' : 'accordion-closed'}`}
      >
        <div className="px-5 pb-6 pt-1 border-t border-slate-100">
          {/* Full question text */}
          <p className="text-slate-700 text-sm sm:text-base whitespace-pre-line leading-relaxed mb-5">
            {question.question}
          </p>

          {/* ── Numeric answer input ── */}
          {question.answerType === 'numeric' && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setFeedback(null); // Reset feedback on new input
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  placeholder="Your answer (e.g. 0.5)"
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  aria-label="Your answer"
                />
                <button
                  onClick={handleCheckAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Check
                </button>
              </div>

              {/* Feedback */}
              {feedback === 'correct' && (
                <p className="mt-2 text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <span>✓</span> Correct!
                </p>
              )}
              {feedback === 'incorrect' && (
                <p className="mt-2 text-sm font-medium text-rose-600 flex items-center gap-1">
                  <span>✕</span> Not quite — try again or reveal the solution.
                </p>
              )}
            </div>
          )}

          {/* ── Show Solution button ── */}
          {!solutionVisible && (
            <button
              onClick={handleRevealSolution}
              className="text-sm text-indigo-600 font-medium hover:underline focus:outline-none"
            >
              Show Solution
            </button>
          )}

          {/* ── Solution panel ── */}
          {solutionVisible && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Solution
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {question.solution}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
