/**
 * Evaluates a user's answer against the expected correct word.
 *
 * Comparison is **case-insensitive** and trailing/leading whitespace is
 * stripped from both sides before matching.
 *
 * @param input - The user's typed answer
 * @param answer - The correct word
 * @returns `true` when the answer is correct
 */
export const evaluateAnswer = (input: string, answer: string): boolean => {
  const normalised = input.trim().toLowerCase();
  const expected = answer.trim().toLowerCase();

  return normalised === expected;
};
