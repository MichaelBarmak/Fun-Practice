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
    const userValue = parseFloat(userInput.replace(/,/g, '').trim());
    if (isNaN(userValue)) return false;
    const tolerance = question.tolerance ?? 0;
    return Math.abs(userValue - question.correctAnswer) <= tolerance;
  }

  if (question.answerType === 'multiple_choice') {
    return userInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  }

  return null;
}
