'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'probability-quiz-solved';

/**
 * Persists the set of solved question IDs in localStorage.
 * Safe to use in Next.js (localStorage access only happens client-side).
 */
export function useSolvedQuestions() {
  const [solvedIds, setSolvedIds] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSolvedIds(JSON.parse(stored));
    } catch {
      // Silently ignore parse errors
    }
  }, []);

  function markSolved(id) {
    setSolvedIds((prev) => {
      if (prev.includes(id)) return prev; // Already solved
      const updated = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function markUnsolved(id) {
    setSolvedIds((prev) => {
      const updated = prev.filter((x) => x !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return { solvedIds, markSolved, markUnsolved };
}
