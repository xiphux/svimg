import exists from '../../src/core/exists';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
}));

describe('exists', () => {
  beforeEach(() => {
    (access as Mock).mockReset();
  });

  it('returns false without file', async () => {
    expect(await exists('')).toEqual(false);
    expect(access).not.toHaveBeenCalled();
  });

  it('returns true if file exists', async () => {
    (access as Mock).mockImplementation(() => Promise.resolve());
    expect(await exists('test/file.jpg')).toEqual(true);
    expect(access).toHaveBeenCalledWith('test/file.jpg', constants.F_OK);
  });

  it("returns false if file doesn't exist", async () => {
    (access as Mock).mockImplementation(() =>
      Promise.reject({
        code: 'ENOENT',
      }),
    );
    expect(await exists('test/file.jpg')).toEqual(false);
    expect(access).toHaveBeenCalledWith('test/file.jpg', constants.F_OK);
  });

  it('throws error if encountered', async () => {
    (access as Mock).mockImplementation(() =>
      Promise.reject({
        code: 'EPERM',
      }),
    );
    await expect(exists('test/file.jpg')).rejects.toThrow();
    expect(access).toHaveBeenCalledWith('test/file.jpg', constants.F_OK);
  });
});
