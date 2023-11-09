import getHash from '../../src/core/get-hash';
import { createHash } from 'node:crypto';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('node:crypto');

describe('getHash', () => {
  let update: Mock;
  let digest: Mock;
  beforeEach(() => {
    digest = vi.fn();
    update = vi.fn();
    update.mockReturnValue({ digest });
    (createHash as Mock).mockReset();
    (createHash as Mock).mockReturnValue({ update });
  });

  it('returns an md5 hex hash', () => {
    digest.mockReturnValue('abcdefghi');

    expect(getHash('datatohash')).toEqual('abcdefghi');

    expect(createHash).toHaveBeenCalledWith('md5');
    expect(update).toHaveBeenCalledWith('datatohash');
    expect(digest).toHaveBeenCalledWith('hex');
  });
});
