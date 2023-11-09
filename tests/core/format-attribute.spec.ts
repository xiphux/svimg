import formatAttribute from '../../src/core/format-attribute';
import { describe, it, expect } from 'vitest';

describe('formatAttribute', () => {
  it("won't format unnecessary attributes", () => {
    expect(formatAttribute('attr', '')).toEqual('');
    expect(formatAttribute('attr', false)).toEqual('');
  });

  it('will format a string attribute', () => {
    expect(formatAttribute('attr', 'val')).toEqual('attr="val"');
  });

  it('will format a boolean attribute', () => {
    expect(formatAttribute('attr', true)).toEqual('attr');
  });
});
