import resizeImageMultiple from '../../src/image-processing/resize-image-multiple';
import ensureResizeImage from '../../src/image-processing/ensure-resize-image';
import { join, sep } from 'node:path';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/image-processing/ensure-resize-image');

describe('resizeImageMultiple', () => {
  beforeEach(() => {
    (ensureResizeImage as Mock).mockReset();
  });

  it('requires input file', async () => {
    const enqueue = vi.fn();
    await expect(
      resizeImageMultiple('', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 75,
        filenameGenerator: ({ width, quality }) => `${width}.${quality}.jpg`,
        aspectRatio: 3 / 2,
      }),
    ).rejects.toThrow();

    expect(ensureResizeImage).not.toHaveBeenCalled();
  });

  it('requires output dir', async () => {
    const enqueue = vi.fn();
    await expect(
      resizeImageMultiple('/in/file', '', { enqueue } as any, {
        widths: [100, 200],
        quality: 75,
        filenameGenerator: ({ width, quality }) => `${width}.${quality}.jpg`,
        aspectRatio: 3 / 2,
      }),
    ).rejects.toThrow();

    expect(ensureResizeImage).not.toHaveBeenCalled();
  });

  it("doesn't generate without widths", async () => {
    const enqueue = vi.fn();
    expect(
      await resizeImageMultiple('/in/file', '/out/dir', { enqueue } as any, {
        widths: [],
        quality: 75,
        filenameGenerator: ({ width, quality }) => `${width}.${quality}.jpg`,
        aspectRatio: 3 / 2,
      }),
    ).toEqual([]);

    expect(ensureResizeImage).not.toHaveBeenCalled();
  });

  it('requires filename generator to return filenames', async () => {
    const enqueue = vi.fn();
    await expect(
      resizeImageMultiple('/in/file', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 75,
        filenameGenerator: ({ width, quality }) => '',
        aspectRatio: 3 / 2,
      }),
    ).rejects.toThrow();

    expect(ensureResizeImage).not.toHaveBeenCalled();
  });

  it('generates filenames and resizes', async () => {
    const enqueue = vi.fn();
    (ensureResizeImage as Mock)
      .mockReturnValueOnce({
        path: '/out/dir/100.75.jpg',
        width: 100,
        height: 50,
      })
      .mockReturnValueOnce({
        path: '/out/dir/200.75.jpg',
        width: 200,
        height: 100,
      });

    expect(
      await resizeImageMultiple('/in/file', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 75,
        filenameGenerator: ({ width, quality }) => `${width}.${quality}.jpg`,
        aspectRatio: 3 / 2,
      }),
    ).toEqual([
      {
        path: '/out/dir/100.75.jpg',
        width: 100,
        height: 50,
      },
      {
        path: '/out/dir/200.75.jpg',
        width: 200,
        height: 100,
      },
    ]);

    expect(ensureResizeImage).toHaveBeenCalledTimes(2);
    expect(ensureResizeImage).toHaveBeenCalledWith(
      '/in/file',
      join('/out/dir', '100.75.jpg'),
      { enqueue } as any,
      { width: 100, quality: 75 },
    );
    expect(ensureResizeImage).toHaveBeenCalledWith(
      '/in/file',
      join('/out/dir', '200.75.jpg'),
      { enqueue } as any,
      { width: 200, quality: 75 },
    );
  });

  it('skips generation', async () => {
    const enqueue = vi.fn();
    expect(
      await resizeImageMultiple('/in/file', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 75,
        filenameGenerator: ({ width, quality }) => `${width}.${quality}.jpg`,
        aspectRatio: 3 / 2,
        skipGeneration: true,
      }),
    ).toEqual([
      {
        path: sep + join('out', 'dir', '100.75.jpg'),
        width: 100,
        height: 66.67,
      },
      {
        path: sep + join('out', 'dir', '200.75.jpg'),
        width: 200,
        height: 133.33,
      },
    ]);

    expect(ensureResizeImage).not.toHaveBeenCalled();
  });
});
