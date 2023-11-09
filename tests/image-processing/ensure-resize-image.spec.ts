import ensureResizeImage from '../../src/image-processing/ensure-resize-image';
import getImageMetadata from '../../src/core/get-image-metadata';
import { resizeImageToFile } from '../../src/core/resize-image';
import exists from '../../src/core/exists';
import { describe, it, expect, vi } from 'vitest';

describe('ensureResizeImage', () => {
  it('requires input file', async () => {
    const enqueue = vi.fn();
    await expect(
      ensureResizeImage('', '/out/file.jpg', { enqueue } as any, {
        width: 300,
        quality: 75,
      }),
    ).rejects.toThrow();

    expect(enqueue).not.toHaveBeenCalled();
  });

  it('requires output file', async () => {
    const enqueue = vi.fn();
    await expect(
      ensureResizeImage('/in/file.jpg', '', { enqueue } as any, {
        width: 300,
        quality: 75,
      }),
    ).rejects.toThrow();

    expect(enqueue).not.toHaveBeenCalled();
  });

  it('returns metadata if the file exists', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 200,
        }),
      );

    expect(
      await ensureResizeImage(
        '/in/file.jpg',
        '/out/file.jpg',
        { enqueue } as any,
        {
          width: 300,
          quality: 75,
        },
      ),
    ).toEqual({
      path: '/out/file.jpg',
      width: 300,
      height: 200,
    });

    expect(enqueue).toHaveBeenCalledWith(exists, '/out/file.jpg');
    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/out/file.jpg');
    expect(enqueue).not.toHaveBeenCalledWith(
      resizeImageToFile,
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("converts to specified width and quality if file doesn't exist", async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(false))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 200,
        }),
      );

    expect(
      await ensureResizeImage(
        '/in/file.jpg',
        '/out/file.jpg',
        { enqueue } as any,
        {
          width: 300,
          quality: 75,
        },
      ),
    ).toEqual({
      path: '/out/file.jpg',
      width: 300,
      height: 200,
    });

    expect(enqueue).toHaveBeenCalledWith(exists, '/out/file.jpg');
    expect(enqueue).toHaveBeenCalledWith(
      resizeImageToFile,
      '/in/file.jpg',
      { width: 300, quality: 75 },
      '/out/file.jpg',
    );
    expect(enqueue).not.toHaveBeenCalledWith(
      getImageMetadata,
      expect.anything(),
    );
  });
});
