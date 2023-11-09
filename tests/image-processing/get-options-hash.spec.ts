import getOptionsHash from '../../src/image-processing/get-options-hash';
import getHash from '../../src/core/get-hash';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/core/get-hash');

describe('getOptionsHash', () => {
  beforeEach(() => {
    (getHash as Mock).mockReset();
  });

  it('returns an md5 hash of options', () => {
    (getHash as Mock).mockReturnValue('abcdefghi');

    expect(getOptionsHash({ width: 500, quality: 80 })).toEqual('abcdefghi');

    expect(getHash).toHaveBeenCalledWith('width=500,quality=80');
  });

  it('returns a truncated md5 hash of options', () => {
    (getHash as Mock).mockReturnValue('abcdefghi');

    expect(getOptionsHash({ width: 500, quality: 80 }, 7)).toEqual('abcdefg');

    expect(getHash).toHaveBeenCalledWith('width=500,quality=80');
  });
});
