import generateComponentAttributes from '../../src/component/generate-component-attributes';
import { join, basename, extname } from 'node:path';
import Queue from '../../src/core/queue';
import createPlaceholder from '../../src/placeholder/create-placeholder';
import processImage from '../../src/image-processing/process-image';
import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../src/core/queue');
vi.mock('../../src/placeholder/create-placeholder');
vi.mock('../../src/image-processing/process-image');

describe('generateComponentAttributes', () => {
  beforeEach(() => {
    (createPlaceholder as Mock).mockReset();
    (processImage as Mock).mockReset();
    (Queue as Mock).mockReset();
  });

  it("won't process without src", async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    await expect(
      generateComponentAttributes({
        src: '',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).rejects.toThrow();

    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).not.toHaveBeenCalled();
    expect(Queue).not.toHaveBeenCalled();
  });

  it("won't process without input dir", async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    await expect(
      generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: '',
        outputDir: 'static/g',
      }),
    ).rejects.toThrow();

    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).not.toHaveBeenCalled();
    expect(Queue).not.toHaveBeenCalled();
  });

  it("won't process without output dir", async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    await expect(
      generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: '',
      }),
    ).rejects.toThrow();

    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).not.toHaveBeenCalled();
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process src', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
  });

  it('will process src with webp = true and avif = true', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: true,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process src with webp = false and avif = true', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: true,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process src with webp = true and avif = false', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: false,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process src with webp = false and avif = false', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [],
        avifImages: [],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: false,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process src with widths', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 150,
            height: 150,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 150,
            height: 150,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 150,
            height: 150,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        widths: [150],
      }),
    ).toEqual({
      srcset: 'g/assets/images/avatar.1.jpg 150w',
      srcsetwebp: 'g/assets/images/avatar.1.webp 150w',
      srcsetavif: 'g/assets/images/avatar.1.avif 150w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
        widths: [150],
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will process images with custom quality', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 150,
            height: 150,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 150,
            height: 150,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 150,
            height: 150,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        quality: 50,
      }),
    ).toEqual({
      srcset: 'g/assets/images/avatar.1.jpg 150w',
      srcsetwebp: 'g/assets/images/avatar.1.webp 150w',
      srcsetavif: 'g/assets/images/avatar.1.avif 150w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
        quality: 50,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will create queues if not provided', async () => {
    (Queue as Mock).mockReturnValue({
      enqueue: true,
    });
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      { enqueue: true } as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      { enqueue: true },
    );
    expect(Queue).toHaveBeenCalled();
  });

  it('will skip image generation', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        skipGeneration: true,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
        skipGeneration: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      queue,
    );
    expect(Queue).not.toHaveBeenCalled();
  });

  it('will skip placeholder', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        skipPlaceholder: true,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(Queue).not.toHaveBeenCalled();
  });

  it('can add a custom path to all urls with src generator', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        srcGenerator: (path) => 'test/' + path,
      }),
    ).toEqual({
      srcset:
        'test/assets/images/avatar.1.jpg 300w, test/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'test/assets/images/avatar.1.webp 300w, test/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'test/assets/images/avatar.1.avif 300w, test/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });
  });

  it('can add a custom domain to all urls with src generator', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        srcGenerator: (path) => 'https://static.example.com/' + path,
      }),
    ).toEqual({
      srcset:
        'https://static.example.com/assets/images/avatar.1.jpg 300w, https://static.example.com/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'https://static.example.com/assets/images/avatar.1.webp 300w, https://static.example.com/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'https://static.example.com/assets/images/avatar.1.avif 300w, https://static.example.com/assets/images/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });
  });

  it('can rewrite paths for all urls with src generator', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        srcGenerator: (path) => 'static/' + basename(path),
      }),
    ).toEqual({
      srcset: 'static/avatar.1.jpg 300w, static/avatar.2.jpg 500w',
      srcsetwebp: 'static/avatar.1.webp 300w, static/avatar.2.webp 500w',
      srcsetavif: 'static/avatar.1.avif 300w, static/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });
  });

  it('can conditionally rewrite paths for all urls with src generator', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'static/g/assets/images/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'static/g/assets/images/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'static/g/assets/images/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'static/g/assets/images/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        srcGenerator: (path) =>
          'assets/' + extname(path).substring(1) + '/' + basename(path),
      }),
    ).toEqual({
      srcset: 'assets/jpg/avatar.1.jpg 300w, assets/jpg/avatar.2.jpg 500w',
      srcsetwebp:
        'assets/webp/avatar.1.webp 300w, assets/webp/avatar.2.webp 500w',
      srcsetavif:
        'assets/avif/avatar.1.avif 300w, assets/avif/avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });
  });

  it('can handle different input/output dirs with src generator', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock).mockImplementation(() =>
      Promise.resolve({
        images: [
          {
            path: 'public/avatar.1.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'public/avatar.2.jpg',
            width: 500,
            height: 500,
          },
        ],
        webpImages: [
          {
            path: 'public/avatar.1.webp',
            width: 300,
            height: 300,
          },
          {
            path: 'public/avatar.2.webp',
            width: 500,
            height: 500,
          },
        ],
        avifImages: [
          {
            path: 'public/avatar.1.avif',
            width: 300,
            height: 300,
          },
          {
            path: 'public/avatar.2.avif',
            width: 500,
            height: 500,
          },
        ],
        aspectRatio: 0.5,
      }),
    );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'avatar.jpg',
        queue: queue as any,
        inputDir: 'content/posts',
        outputDir: 'public',
        srcGenerator: (path) => basename(path),
      }),
    ).toEqual({
      srcset: 'avatar.1.jpg 300w, avatar.2.jpg 500w',
      srcsetwebp: 'avatar.1.webp 300w, avatar.2.webp 500w',
      srcsetavif: 'avatar.1.avif 300w, avatar.2.avif 500w',
      placeholder: '<svg />',
      aspectratio: 0.5,
    });

    expect(processImage).toHaveBeenCalledWith(
      join('content', 'posts', 'avatar.jpg'),
      join('public'),
      queue as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).toHaveBeenCalledWith(
      join('content', 'posts', 'avatar.jpg'),
      queue,
    );
  });

  it('will generate placeholder files', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/avatar.1.jpg',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.jpg',
              width: 500,
              height: 500,
            },
          ],
          webpImages: [
            {
              path: 'static/g/assets/images/avatar.1.webp',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.webp',
              width: 500,
              height: 500,
            },
          ],
          avifImages: [
            {
              path: 'static/g/assets/images/avatar.1.avif',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.avif',
              width: 500,
              height: 500,
            },
          ],
          aspectRatio: 0.5,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/placeholder.jpg',
              width: 64,
              height: 64,
            },
          ],
          webpImages: [
            {
              path: 'static/g/assets/images/placeholder.webp',
              width: 64,
              height: 64,
            },
          ],
          avifImages: [
            {
              path: 'static/g/assets/images/placeholder.avif',
              width: 64,
              height: 64,
            },
          ],
          aspectRatio: 0.5,
        }),
      );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        embedPlaceholder: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      aspectratio: 0.5,
      placeholdersrc: 'g/assets/images/placeholder.jpg',
      placeholderwebp: 'g/assets/images/placeholder.webp',
      placeholderavif: 'g/assets/images/placeholder.avif',
    });

    expect(processImage).toHaveBeenNthCalledWith(
      1,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
      },
    );
    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).toHaveBeenNthCalledWith(
      2,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: true,
        widths: [64],
      },
    );
  });

  it('will generate placeholder files without avif', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/avatar.1.jpg',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.jpg',
              width: 500,
              height: 500,
            },
          ],
          webpImages: [
            {
              path: 'static/g/assets/images/avatar.1.webp',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.webp',
              width: 500,
              height: 500,
            },
          ],
          avifImages: [],
          aspectRatio: 0.5,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/placeholder.jpg',
              width: 64,
              height: 64,
            },
          ],
          webpImages: [
            {
              path: 'static/g/assets/images/placeholder.webp',
              width: 64,
              height: 64,
            },
          ],
          avifImages: [],
          aspectRatio: 0.5,
        }),
      );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        embedPlaceholder: false,
        avif: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetwebp:
        'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
      aspectratio: 0.5,
      placeholdersrc: 'g/assets/images/placeholder.jpg',
      placeholderwebp: 'g/assets/images/placeholder.webp',
    });

    expect(processImage).toHaveBeenNthCalledWith(
      1,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: false,
      },
    );
    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).toHaveBeenNthCalledWith(
      2,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: true,
        avif: false,
        widths: [64],
      },
    );
  });

  it('will generate placeholder files without webp', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/avatar.1.jpg',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.jpg',
              width: 500,
              height: 500,
            },
          ],
          webpImages: [],
          avifImages: [
            {
              path: 'static/g/assets/images/avatar.1.avif',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.avif',
              width: 500,
              height: 500,
            },
          ],
          aspectRatio: 0.5,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/placeholder.jpg',
              width: 64,
              height: 64,
            },
          ],
          webpImages: [],
          avifImages: [
            {
              path: 'static/g/assets/images/placeholder.avif',
              width: 64,
              height: 64,
            },
          ],
          aspectRatio: 0.5,
        }),
      );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        embedPlaceholder: false,
        webp: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      srcsetavif:
        'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
      aspectratio: 0.5,
      placeholdersrc: 'g/assets/images/placeholder.jpg',
      placeholderavif: 'g/assets/images/placeholder.avif',
    });

    expect(processImage).toHaveBeenNthCalledWith(
      1,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: true,
      },
    );
    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).toHaveBeenNthCalledWith(
      2,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: true,
        widths: [64],
      },
    );
  });

  it('will generate placeholder files without webp or avif', async () => {
    const queue = vi.fn(() => ({ enqueue: vi.fn() }));
    (processImage as Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/avatar.1.jpg',
              width: 300,
              height: 300,
            },
            {
              path: 'static/g/assets/images/avatar.2.jpg',
              width: 500,
              height: 500,
            },
          ],
          webpImages: [],
          avifImages: [],
          aspectRatio: 0.5,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          images: [
            {
              path: 'static/g/assets/images/placeholder.jpg',
              width: 64,
              height: 64,
            },
          ],
          webpImages: [],
          avifImages: [],
          aspectRatio: 0.5,
        }),
      );
    (createPlaceholder as Mock).mockImplementation(() =>
      Promise.resolve('<svg />'),
    );

    expect(
      await generateComponentAttributes({
        src: 'assets/images/avatar.jpg',
        queue: queue as any,
        inputDir: 'static',
        outputDir: 'static/g',
        embedPlaceholder: false,
        webp: false,
        avif: false,
      }),
    ).toEqual({
      srcset:
        'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
      aspectratio: 0.5,
      placeholdersrc: 'g/assets/images/placeholder.jpg',
    });

    expect(processImage).toHaveBeenNthCalledWith(
      1,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: false,
      },
    );
    expect(createPlaceholder).not.toHaveBeenCalled();
    expect(processImage).toHaveBeenNthCalledWith(
      2,
      join('static', 'assets', 'images', 'avatar.jpg'),
      join('static', 'g', 'assets', 'images'),
      queue as any,
      {
        webp: false,
        avif: false,
        widths: [64],
      },
    );
  });
});
