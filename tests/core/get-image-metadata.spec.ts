import getImageMetadata from '../../src/core/get-image-metadata';
import sharp from 'sharp';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('sharp');

describe('getImageMetadata', () => {
  let metadata: Mock;
  beforeEach(() => {
    metadata = vi.fn();
    (sharp as any as Mock).mockReset().mockReturnValue({
      metadata,
    });
  });

  it('requires input file', async () => {
    await expect(getImageMetadata('')).rejects.toThrow();
  });

  it('returns metadata', async () => {
    metadata.mockImplementation(() =>
      Promise.resolve({
        width: 300,
        height: 200,
      }),
    );

    expect(await getImageMetadata('/in/file.jpg')).toEqual({
      width: 300,
      height: 200,
    });

    expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
    expect(metadata).toHaveBeenCalled();
  });
});
