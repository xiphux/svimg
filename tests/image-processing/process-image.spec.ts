import processImage from '../../src/image-processing/process-image';
import md5file from 'md5-file';
import getProcessImageOptions from '../../src/image-processing/get-process-image-options';
import resizeImageMultiple from '../../src/image-processing/resize-image-multiple';
import getOptionsHash from '../../src/image-processing/get-options-hash';
import getImageMetadata from '../../src/core/get-image-metadata';
import exists from '../../src/core/exists';
import { mkdir } from 'node:fs/promises';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/image-processing/get-process-image-options');
vi.mock('../../src/image-processing/resize-image-multiple');
vi.mock('../../src/image-processing/get-options-hash');

describe('processImage', () => {
  beforeEach(() => {
    (getProcessImageOptions as Mock).mockReset();
    (resizeImageMultiple as Mock).mockReset();
  });

  it('requires an input file', async () => {
    const enqueue = vi.fn();
    await expect(
      processImage('/in/file.jpg', '', { enqueue } as any),
    ).rejects.toThrow();

    expect(enqueue).not.toHaveBeenCalled();
    expect(resizeImageMultiple).not.toHaveBeenCalled();
  });

  it('requires an output dir', async () => {
    const enqueue = vi.fn();
    await expect(
      processImage('', '/out/dir', { enqueue } as any),
    ).rejects.toThrow();

    expect(enqueue).not.toHaveBeenCalled();
    expect(resizeImageMultiple).not.toHaveBeenCalled();
  });

  it("creates the dir if it doesn't exist", async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(false))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      );
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
    });

    await processImage('/in/file.jpg', '/out/dir', { enqueue } as any);

    expect(enqueue).toHaveBeenCalledWith(exists, '/out/dir');
    expect(enqueue).toHaveBeenCalledWith(mkdir, '/out/dir', {
      recursive: true,
    });
  });

  it("won't create the dir if it exists", async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      );
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
    });

    await processImage('/in/file.jpg', '/out/dir', { enqueue } as any);

    expect(enqueue).toHaveBeenCalledWith(exists, '/out/dir');
    expect(enqueue).not.toHaveBeenCalledWith(mkdir, '/out/dir', {
      recursive: true,
    });
  });

  it("won't create the dir if skipping generation", async () => {
    const enqueue = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        width: 300,
        height: 300,
      }),
    );
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
    });

    await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
      skipGeneration: true,
    });

    expect(enqueue).not.toHaveBeenCalledWith(exists, '/out/dir');
    expect(enqueue).not.toHaveBeenCalledWith(mkdir, '/out/dir', {
      recursive: true,
    });
  });

  it('resizes images with hashed filename generator', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve('filehash'));
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
      webp: false,
      avif: false,
    });
    (resizeImageMultiple as Mock).mockImplementation(() =>
      Promise.resolve([
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ]),
    );
    (getOptionsHash as Mock).mockReturnValue('optionshash');

    expect(
      await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 85,
        webp: false,
        avif: false,
      }),
    ).toEqual({
      images: [
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 1,
    });

    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

    expect(getProcessImageOptions).toHaveBeenCalledWith(300, {
      widths: [100, 200],
      quality: 85,
      webp: false,
      avif: false,
    });

    expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');
    expect(resizeImageMultiple).toHaveBeenCalledTimes(1);
    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGenerator =
      vi.mocked(resizeImageMultiple).mock.calls[0][3].filenameGenerator;
    expect(filenameGenerator({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.jpg',
    );
  });

  it('generates webp images if requested', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve('filehash'));
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
      webp: true,
      avif: false,
    });
    (resizeImageMultiple as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.jpg',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.jpg',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.webp',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.webp',
            width: 300,
            height: 300,
          },
        ]),
      );
    (getOptionsHash as Mock).mockReturnValue('optionshash');

    expect(
      await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 85,
        webp: true,
        avif: false,
      }),
    ).toEqual({
      images: [
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ],
      webpImages: [
        {
          path: '/out/dir/file.1.webp',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.webp',
          width: 300,
          height: 300,
        },
      ],
      avifImages: [],
      aspectRatio: 1,
    });

    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

    expect(getProcessImageOptions).toHaveBeenCalledWith(300, {
      widths: [100, 200],
      quality: 85,
      webp: true,
      avif: false,
    });

    expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

    expect(resizeImageMultiple).toHaveBeenCalledTimes(2);
    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGenerator =
      vi.mocked(resizeImageMultiple).mock.calls[0][3].filenameGenerator;
    expect(filenameGenerator({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.jpg',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGeneratorWebp =
      vi.mocked(resizeImageMultiple).mock.calls[1][3].filenameGenerator;
    expect(filenameGeneratorWebp({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.webp',
    );
  });

  it('generates avif images if requested', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve('filehash'));
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
      webp: false,
      avif: true,
    });
    (resizeImageMultiple as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.jpg',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.jpg',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.avif',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.avif',
            width: 300,
            height: 300,
          },
        ]),
      );
    (getOptionsHash as Mock).mockReturnValue('optionshash');

    expect(
      await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 85,
        webp: false,
        avif: true,
      }),
    ).toEqual({
      images: [
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [
        {
          path: '/out/dir/file.1.avif',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.avif',
          width: 300,
          height: 300,
        },
      ],
      aspectRatio: 1,
    });

    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

    expect(getProcessImageOptions).toHaveBeenCalledWith(300, {
      widths: [100, 200],
      quality: 85,
      webp: false,
      avif: true,
    });

    expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

    expect(resizeImageMultiple).toHaveBeenCalledTimes(2);
    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGenerator =
      vi.mocked(resizeImageMultiple).mock.calls[0][3].filenameGenerator;
    expect(filenameGenerator({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.jpg',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGeneratorAvif =
      vi.mocked(resizeImageMultiple).mock.calls[1][3].filenameGenerator;
    expect(filenameGeneratorAvif({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.avif',
    );
  });

  it('generates webp and avif images if requested', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 300,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve('filehash'));
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
      webp: true,
      avif: true,
    });
    (resizeImageMultiple as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.jpg',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.jpg',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.webp',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.webp',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.avif',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.avif',
            width: 300,
            height: 300,
          },
        ]),
      );
    (getOptionsHash as Mock).mockReturnValue('optionshash');

    expect(
      await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 85,
        webp: true,
        avif: true,
      }),
    ).toEqual({
      images: [
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ],
      webpImages: [
        {
          path: '/out/dir/file.1.webp',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.webp',
          width: 300,
          height: 300,
        },
      ],
      avifImages: [
        {
          path: '/out/dir/file.1.avif',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.avif',
          width: 300,
          height: 300,
        },
      ],
      aspectRatio: 1,
    });

    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

    expect(getProcessImageOptions).toHaveBeenCalledWith(300, {
      widths: [100, 200],
      quality: 85,
      webp: true,
      avif: true,
    });

    expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

    expect(resizeImageMultiple).toHaveBeenCalledTimes(3);
    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGenerator =
      vi.mocked(resizeImageMultiple).mock.calls[0][3].filenameGenerator;
    expect(filenameGenerator({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.jpg',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGeneratorWebp =
      vi.mocked(resizeImageMultiple).mock.calls[1][3].filenameGenerator;
    expect(filenameGeneratorWebp({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.webp',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 1,
      },
    );
    const filenameGeneratorAvif =
      vi.mocked(resizeImageMultiple).mock.calls[2][3].filenameGenerator;
    expect(filenameGeneratorAvif({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.avif',
    );
  });

  it('skips generation', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 100,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve('filehash'));
    (getProcessImageOptions as Mock).mockReturnValue({
      widths: [200, 300],
      quality: 85,
      webp: true,
      avif: true,
    });
    (resizeImageMultiple as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.jpg',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.jpg',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.webp',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.webp',
            width: 300,
            height: 300,
          },
        ]),
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            path: '/out/dir/file.1.avif',
            width: 200,
            height: 200,
          },
          {
            path: '/out/dir/file.2.avif',
            width: 300,
            height: 300,
          },
        ]),
      );
    (getOptionsHash as Mock).mockReturnValue('optionshash');

    expect(
      await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
        widths: [100, 200],
        quality: 85,
        webp: true,
        avif: true,
        skipGeneration: true,
      }),
    ).toEqual({
      images: [
        {
          path: '/out/dir/file.1.jpg',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.jpg',
          width: 300,
          height: 300,
        },
      ],
      webpImages: [
        {
          path: '/out/dir/file.1.webp',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.webp',
          width: 300,
          height: 300,
        },
      ],
      avifImages: [
        {
          path: '/out/dir/file.1.avif',
          width: 200,
          height: 200,
        },
        {
          path: '/out/dir/file.2.avif',
          width: 300,
          height: 300,
        },
      ],
      aspectRatio: 300 / 100,
    });

    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

    expect(getProcessImageOptions).toHaveBeenCalledWith(300, {
      widths: [100, 200],
      quality: 85,
      webp: true,
      avif: true,
    });

    expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

    expect(resizeImageMultiple).toHaveBeenCalledTimes(3);
    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 300 / 100,
        skipGeneration: true,
      },
    );
    const filenameGenerator =
      vi.mocked(resizeImageMultiple).mock.calls[0][3].filenameGenerator;
    expect(filenameGenerator({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.jpg',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 300 / 100,
        skipGeneration: true,
      },
    );
    const filenameGeneratorWebp =
      vi.mocked(resizeImageMultiple).mock.calls[1][3].filenameGenerator;
    expect(filenameGeneratorWebp({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.webp',
    );

    expect(resizeImageMultiple).toHaveBeenCalledWith(
      '/in/file.jpg',
      '/out/dir',
      { enqueue } as any,
      {
        widths: [200, 300],
        quality: 85,
        filenameGenerator: expect.any(Function),
        aspectRatio: 300 / 100,
        skipGeneration: true,
      },
    );
    const filenameGeneratorAvif =
      vi.mocked(resizeImageMultiple).mock.calls[2][3].filenameGenerator;
    expect(filenameGeneratorAvif({ width: 300, quality: 85 } as any)).toEqual(
      'file.optionshash.filehash.avif',
    );
  });
});
