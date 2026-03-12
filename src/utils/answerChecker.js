/**
 * Checks whether the user's answer is correct for a given question.
 *
 * Returns:
 *   true    — correct
 *   false   — incorrect
 *   null    — no checking (theory questions)
 */
export function checkAnswer(question, userInput) {
  if (question.answerType === 'theory') {
    return null;
  }

  if (question.answerType === 'numeric') {
    const cleaned = userInput.replace(/,/g, '').trim();
    let userValue;
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        userValue = (den !== 0) ? num / den : NaN;
      } else {
        userValue = NaN;
      }
    } else {
      userValue = parseFloat(cleaned);
    }
    if (isNaN(userValue)) return false;
    const tolerance = question.tolerance ?? 0;
    return Math.abs(userValue - question.correctAnswer) <= tolerance;
  }

  if (question.answerType === 'multiple_choice') {
    return userInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  }

  return null;
}
