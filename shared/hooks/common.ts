/**
 * Parses a raw AI text result (potentially wrapped in markdown code fences)
 * into a plain JavaScript object.
 *
 * @param textResult - Raw text string from the AI API response
 * @returns Parsed object on success, or `null` when parsing fails or input is missing
 */
export const parseTextResult = (textResult: string | undefined | null): unknown => {
  if (!textResult) {
    console.error('parseTextResult: received empty or undefined input');
    return null;
  }

  try {
    const cleanResult = textResult
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleanResult) as Record<string, unknown>;
  } catch (e) {
    console.error('Failed to parse text_result:', e);
    return null;
  }
};