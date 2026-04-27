import { describe, expect, it } from 'vitest';

import { getMemoryLevel } from './getMemoryLevel';

describe('getMemoryLevel', () => {
  it('returns "needs_review" when totalAnswered is 0', () => {
    expect(getMemoryLevel(0, 0)).toBe('needs_review');
  });

  it('returns "needs_review" when percentage is below 50%', () => {
    expect(getMemoryLevel(2, 10)).toBe('needs_review');
    expect(getMemoryLevel(0, 5)).toBe('needs_review');
    expect(getMemoryLevel(4, 10)).toBe('needs_review');
  });

  it('returns "needs_review" at exactly 49%', () => {
    // 49/100 = 49%
    expect(getMemoryLevel(49, 100)).toBe('needs_review');
  });

  it('returns "good_grasp" at exactly 50%', () => {
    expect(getMemoryLevel(5, 10)).toBe('good_grasp');
    expect(getMemoryLevel(50, 100)).toBe('good_grasp');
  });

  it('returns "good_grasp" when percentage is between 50% and 80%', () => {
    expect(getMemoryLevel(6, 10)).toBe('good_grasp');
    expect(getMemoryLevel(7, 10)).toBe('good_grasp');
    expect(getMemoryLevel(75, 100)).toBe('good_grasp');
  });

  it('returns "good_grasp" at exactly 80%', () => {
    expect(getMemoryLevel(8, 10)).toBe('good_grasp');
    expect(getMemoryLevel(80, 100)).toBe('good_grasp');
  });

  it('returns "excellent" when percentage is above 80%', () => {
    expect(getMemoryLevel(9, 10)).toBe('excellent');
    expect(getMemoryLevel(10, 10)).toBe('excellent');
    expect(getMemoryLevel(81, 100)).toBe('excellent');
  });
});
