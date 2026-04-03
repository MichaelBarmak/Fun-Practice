'use client';

import { useState, useEffect } from 'react';
import MathText from './MathText';
import { checkAnswer } from '../utils/answerChecker';

const DEFAULT_DURATION = 5 * 60; // 300 seconds

function getDuration(question) {
  return question?.timeLimit ? question.timeLimit * 60 : DEFAULT_DURATION;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function InterviewMode({ questions, onExit }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'question' | 'results'
  const [selected, setSelected] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);

  function start() {
    function pickRandom(pool) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const easy   = questions.filter(q => q.difficulty === 'Easy');
    const medium = questions.filter(q => q.difficulty === 'Medium');
    const hard   = questions.filter(q => q.difficulty === 'Hard');
    const three = [
      pickRandom(easy),
      pickRandom(medium),
      pickRandom(hard),
    ].filter(Boolean);
    setSelected(three);
    setIdx(0);
    setAnswers(['', '', '']);
    setTimeLeft(getDuration(three[0]));
    setPhase('question');
  }

  // Timer: tick every second, auto-advance when it hits 0
  useEffect(() => {
    if (phase !== 'question') return;
    if (timeLeft <= 0) {
      if (idx < 2) {
        setIdx(i => i + 1);
        setTimeLeft(getDuration(selected[idx + 1]));
      } else {
        setPhase('results');
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, idx]);

  function advance() {
    if (idx < 2) {
      setIdx(i => i + 1);
      setTimeLeft(getDuration(selected[idx + 1]));
    } else {
      setPhase('results');
    }
  }

  function setAnswer(val) {
    setAnswers(prev => prev.map((a, i) => i === idx ? val : a));
  }

  if (phase === 'intro') return <IntroScreen onStart={start} onExit={onExit} />;
  if (phase === 'question') return (
    <QuestionScreen
      question={selected[idx]}
      number={idx + 1}
      answer={answers[idx]}
      onAnswer={setAnswer}
      timeLeft={timeLeft}
      isLast={idx === 2}
      onNext={advance}
    />
  );
  return <ResultsScreen questions={selected} answers={answers} onExit={onExit} />;
}

// ── Intro screen ──────────────────────────────────────────────────────────────

function IntroScreen({ onStart, onExit }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase mb-2">
            Interview Prep
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Interview Simulation
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">How it works</h2>
          <ul className="space-y-4 text-slate-600 text-sm sm:text-base mb-8">
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold shrink-0">1.</span>
              <span>
                3 questions are randomly selected in order of difficulty:{' '}
                <span className="font-medium text-emerald-600">Easy</span>{' → '}
                <span className="font-medium text-amber-500">Medium</span>{' → '}
                <span className="font-medium text-rose-500">Hard</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold shrink-0">2.</span>
              Each question has its own time limit. You may advance to the next question at any time, or wait for the timer to expire.
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold shrink-0">3.</span>
              No solutions are shown during the interview — only at the end.
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold shrink-0">4.</span>
              After all 3 questions, a results screen shows every question with its full solution.
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              onClick={onStart}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Interview
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Question screen ───────────────────────────────────────────────────────────

const DIFFICULTY_STYLES = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
};

function QuestionScreen({ question, number, answer, onAnswer, timeLeft, isLast, onNext }) {
  const urgent = timeLeft < 30;
  const warning = timeLeft < 60;
  const timerColor = urgent
    ? 'text-rose-600 animate-pulse'
    : warning
    ? 'text-amber-500'
    : 'text-indigo-600';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky progress + timer bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  n === number
                    ? 'bg-indigo-600 text-white'
                    : n < number
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {n < number ? '✓' : n}
              </div>
            ))}
            <span className="text-sm text-slate-500 ml-2">Question {number} of 3</span>
          </div>
          <div className={`text-2xl font-mono font-bold tabular-nums ${timerColor}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
              {question.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty] ?? 'bg-slate-100 text-slate-600'}`}>
              {question.difficulty}
            </span>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            <MathText text={question.question} />
          </p>

          {/* Numeric input */}
          {question.answerType === 'numeric' && (
            <div className="mt-5">
              <input
                type="text"
                value={answer}
                onChange={e => onAnswer(e.target.value)}
                placeholder="e.g. 0.5 or 1/2"
                className="w-full max-w-xs px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          )}

          {/* Multiple choice */}
          {question.answerType === 'multiple_choice' && (
            <div className="mt-5 flex gap-3">
              {question.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onAnswer(opt)}
                  className={`px-6 py-2 rounded-lg text-sm transition-colors ${
                    answer === opt
                      ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isLast ? 'Finish Interview →' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ questions, answers, onExit }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-emerald-200 text-sm font-medium tracking-widest uppercase mb-2">
            Interview Complete
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Solutions
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const result = q.answerType !== 'theory' ? checkAnswer(q, userAnswer) : null;
          return (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Question header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{q.title}</span>
                  {result === true && (
                    <span className="ml-auto text-emerald-600 text-sm font-medium">✓ Correct</span>
                  )}
                  {result === false && (
                    <span className="ml-auto text-rose-500 text-sm font-medium">✕ Incorrect</span>
                  )}
                  {result === null && (
                    <span className="ml-auto text-slate-400 text-sm">Open-ended</span>
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  <MathText text={q.question} />
                </p>
                {userAnswer && q.answerType !== 'theory' && (
                  <p className="mt-3 text-sm text-slate-500">
                    Your answer: <span className="font-medium text-slate-700">{userAnswer}</span>
                  </p>
                )}
              </div>

              {/* Solution */}
              <div className="px-6 py-5 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Solution
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <MathText text={q.solution} />
                </p>
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pt-2 pb-10">
          <button
            onClick={onExit}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Exit Interview
          </button>
        </div>
      </div>
    </div>
  );
}
