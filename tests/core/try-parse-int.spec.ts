import tryParseInt from '../../src/core/try-parse-int';
import { describe, it, expect } from 'vitest';

describe('tryParseInt', () => {
  it('returns undefined for an empty value', () => {
    expect(tryParseInt('')).toBeUndefined();
  });

  it('returns undefined for a fraction', () => {
    expect(tryParseInt('12.34')).toBeUndefined();
  });

  it('returns undefined for a mixed value', () => {
    expect(tryParseInt('150px')).toBeUndefined();
  });

  it('returns an integer', () => {
    expect(tryParseInt('150')).toEqual(150);
  });
});
