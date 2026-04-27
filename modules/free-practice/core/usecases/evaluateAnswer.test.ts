import { describe, expect, it } from 'vitest';

import { evaluateAnswer } from './evaluateAnswer';

describe('evaluateAnswer', () => {
  it('returns true for an exact case-sensitive match', () => {
    expect(evaluateAnswer('apple', 'apple')).toBe(true);
  });

  it('returns true for a case-insensitive match', () => {
    expect(evaluateAnswer('Apple', 'apple')).toBe(true);
    expect(evaluateAnswer('APPLE', 'apple')).toBe(true);
    expect(evaluateAnswer('apple', 'APPLE')).toBe(true);
  });

  it('trims leading and trailing whitespace from input', () => {
    expect(evaluateAnswer('  apple  ', 'apple')).toBe(true);
  });

  it('trims leading and trailing whitespace from the expected answer', () => {
    expect(evaluateAnswer('apple', '  apple  ')).toBe(true);
  });

  it('returns false for a partial match', () => {
    expect(evaluateAnswer('app', 'apple')).toBe(false);
  });

  it('returns false for an empty input', () => {
    expect(evaluateAnswer('', 'apple')).toBe(false);
  });

  it('returns false for completely wrong input', () => {
    expect(evaluateAnswer('banana', 'apple')).toBe(false);
  });

  it('handles multi-word answers', () => {
    expect(evaluateAnswer('ice cream', 'ice cream')).toBe(true);
    expect(evaluateAnswer('Ice Cream', 'ice cream')).toBe(true);
  });
});
