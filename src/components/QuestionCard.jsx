'use client';

import { useState, useEffect, useRef } from 'react';
import { checkAnswer } from '../utils/answerChecker';
import MathText from './MathText';

const DIFFICULTY_STYLES = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
};

const CATEGORY_STYLE = 'bg-indigo-100 text-indigo-700';
const SOURCE_STYLE = 'bg-violet-100 text-violet-700';

export default function QuestionCard({
  question,
  isExpanded,
  onToggle,
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [part2Answer, setPart2Answer] = useState('');
  const [part2Feedback, setPart2Feedback] = useState(null);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [stopwatchKey, setStopwatchKey] = useState(0);

  function handleCheckAnswer(answer) {
    const input = answer ?? userAnswer;
    const result = checkAnswer(question, input);
    if (result === true) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  }

  function handleRevealSolution() {
    setSolutionVisible(true);
  }

  function handleCheckPart2() {
    const cleaned = part2Answer.replace(/,/g, '').trim();
    const userValue = parseFloat(cleaned);
    if (isNaN(userValue)) { setPart2Feedback('incorrect'); return; }
    const tolerance = question.part2Tolerance ?? 0;
    if (Math.abs(userValue - question.part2Answer) <= tolerance) {
      setPart2Feedback('correct');
    } else {
      setPart2Feedback('incorrect');
    }
  }

  function handleToggle() {
    if (isExpanded) {
      setUserAnswer('');
      setFeedback(null);
      setPart2Answer('');
      setPart2Feedback(null);
      setSolutionVisible(false);
      setStopwatchKey(k => k + 1);
    }
    onToggle();
  }

  return (
    <div
      id={`question-${question.id}`}
      className={`bg-white rounded-xl border transition-shadow duration-200
        ${isExpanded ? 'border-indigo-300 shadow-md' : 'border-slate-200 hover:shadow-sm'}`}
    >
      {/* ── Card header ── */}
      <div className="flex items-start px-5 py-4 gap-3">
        {/* Clickable title + meta area */}
        <button
          onClick={handleToggle}
          className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
          aria-expanded={isExpanded}
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
              {question.id}
            </span>
            <span className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
              {question.title}
            </span>
            {question.isNew && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 uppercase tracking-wide">
                New
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLE}`}>
              {question.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty] ?? 'bg-slate-100 text-slate-600'}`}>
              {question.difficulty}
            </span>
            {question.source && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLE}`}>
                {question.source}
              </span>
            )}
            {question.timeLimit && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                ⏱ {question.timeLimit} min
              </span>
            )}
          </div>

          {!isExpanded && (
            <p className="text-sm text-slate-500 line-clamp-2">{question.preview}</p>
          )}
        </button>

        {/* Stopwatch — visible only when expanded */}
        {isExpanded && question.timeLimit && (
          <div className="flex-shrink-0 mt-0.5">
            <Stopwatch key={stopwatchKey} timeLimit={question.timeLimit} />
          </div>
        )}

        {/* Chevron */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 mt-1 text-slate-400 transition-transform duration-200 focus:outline-none ${isExpanded ? 'rotate-180' : ''}`}
          aria-label={isExpanded ? 'Collapse question' : 'Expand question'}
        >
          <ChevronIcon />
        </button>
      </div>

      {/* ── Expandable detail panel ── */}
      <div className={`${isExpanded ? 'overflow-x-auto accordion-open' : 'overflow-hidden accordion-closed'}`}>
        <div className="px-5 pb-6 pt-1 border-t border-slate-100">
          {/* Full question text */}
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-5">
            <MathText text={question.question} />
          </p>

          {/* ── Numeric answer input ── */}
          {question.answerType === 'numeric' && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => { setUserAnswer(e.target.value); setFeedback(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  placeholder="e.g. 0.5 or 1/2"
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  aria-label="Your answer"
                />
                <button
                  onClick={() => handleCheckAnswer()}
                  disabled={!userAnswer.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Check
                </button>
              </div>
              <Feedback feedback={feedback} />
            </div>
          )}

          {/* ── Multiple choice buttons ── */}
          {question.answerType === 'multiple_choice' && (
            <div className="mb-4">
              <div className="flex gap-3">
                {question.options.map((opt) => {
                  const isSelected = userAnswer === opt;
                  const isCorrectOpt = opt === question.correctAnswer;
                  let btnStyle = 'border border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600';
                  if (isSelected && feedback === 'correct') btnStyle = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold';
                  else if (isSelected && feedback === 'incorrect') btnStyle = 'border-2 border-rose-400 bg-rose-50 text-rose-700 font-semibold';
                  else if (isSelected) btnStyle = 'border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold';
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setUserAnswer(opt);
                        setFeedback(null);
                        handleCheckAnswer(opt);
                      }}
                      className={`px-6 py-2 rounded-lg text-sm transition-colors ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <Feedback feedback={feedback} />
            </div>
          )}

          {/* ── Part 2 numeric answer (for mixed theory+numeric questions) ── */}
          {question.part2Answer !== undefined && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-600 mb-2">Your answer for Part 2:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={part2Answer}
                  onChange={(e) => { setPart2Answer(e.target.value); setPart2Feedback(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckPart2()}
                  placeholder="Enter a number"
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  aria-label="Part 2 answer"
                />
                <button
                  onClick={handleCheckPart2}
                  disabled={!part2Answer.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Check
                </button>
              </div>
              <Feedback feedback={part2Feedback} />
            </div>
          )}

          {/* ── Show / Hide Solution button ── */}
          <button
            onClick={solutionVisible ? () => setSolutionVisible(false) : handleRevealSolution}
            className="text-sm text-indigo-600 font-medium hover:underline focus:outline-none"
          >
            {solutionVisible ? 'Hide Solution' : 'Show Solution'}
          </button>

          {/* ── Solution panel ── */}
          {solutionVisible && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Solution
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                <MathText text={question.solution} />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Feedback({ feedback }) {
  if (feedback === 'correct') {
    return (
      <p className="mt-2 text-sm font-medium text-emerald-600 flex items-center gap-1">
        <span>✓</span> Correct!
      </p>
    );
  }
  if (feedback === 'incorrect') {
    return (
      <p className="mt-2 text-sm font-medium text-rose-600 flex items-center gap-1">
        <span>✕</span> Not quite — try again or reveal the solution.
      </p>
    );
  }
  return null;
}

function Stopwatch({ timeLimit }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function reset() {
    setRunning(false);
    setElapsed(0);
  }

  const limitSecs = timeLimit * 60;
  const isOver = elapsed >= limitSecs;
  const isWarning = !isOver && elapsed >= limitSecs - 30;

  const timerColor = isOver ? 'text-rose-600' : isWarning ? 'text-amber-500' : 'text-emerald-600';
  const borderColor = isOver ? 'border-rose-300' : isWarning ? 'border-amber-300' : 'border-emerald-300';
  const bgColor = isOver ? 'bg-rose-50' : isWarning ? 'bg-amber-50' : 'bg-emerald-50';

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const display = `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-4 ${bgColor} ${borderColor}`}>
      <span className={`font-mono font-bold text-sm tabular-nums w-10 ${timerColor}`}>{display}</span>
      <button
        onClick={() => setRunning(r => !r)}
        className={`text-sm ${timerColor} hover:opacity-70 transition-opacity`}
        aria-label={running ? 'Pause stopwatch' : 'Start stopwatch'}
      >
        {running ? '⏸' : '▶'}
      </button>
      <button
        onClick={reset}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Reset stopwatch"
      >
        ↺
      </button>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
