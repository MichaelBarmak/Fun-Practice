/**
 * Checks whether the user's answer is correct for a given question.
 *
 * Returns:
 *   true    — correct
 *   false   — incorrect
 *   null    — no checking (theory questions)
 *
 * To support new answer types (e.g. "fraction", "expression"), add a new
 * case below and define how to parse and compare the user's input.
 */
export function checkAnswer(question, userInput) {
  if (question.answerType === 'theory') {
    return null; // Theory questions have no numeric check
  }

  if (question.answerType === 'numeric') {
    // Strip commas (e.g. "1,000") and whitespace before parsing
    const userValue = parseFloat(userInput.replace(/,/g, '').trim());

    if (isNaN(userValue)) return false;

    const tolerance = question.tolerance ?? 0;
    return Math.abs(userValue - question.correctAnswer) <= tolerance;
  }

  // Unknown answer type — no check
  return null;
}
