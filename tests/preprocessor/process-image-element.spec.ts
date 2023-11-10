import processImageElement from '../../src/preprocessor/process-image-element';
import generateComponentAttributes from '../../src/component/generate-component-attributes';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/component/generate-component-attributes');

describe('processImageElement', () => {
  beforeEach(() => {
    (generateComponentAttributes as Mock).mockReset();
  });

  it('returns unmodified if nothing is passed', async () => {
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual('');

    expect(generateComponentAttributes).not.toHaveBeenCalled();
  });

  it('returns unmodified if invalid data is passed', async () => {
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('garbage', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual('garbage');

    expect(generateComponentAttributes).not.toHaveBeenCalled();
  });

  it('returns unmodified without a src', async () => {
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual('<Image />');

    expect(generateComponentAttributes).not.toHaveBeenCalled();
  });

  it('processes element', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('processes element with webp', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        srcsetwebp: 'g/img/test1.webp 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: false,
      }),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: true,
      avif: false,
    });
  });

  it('processes element with avif', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        srcsetavif: 'g/img/test1.avif 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: true,
      }),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" srcsetavif="g/img/test1.avif 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: true,
    });
  });

  it('processes element with webp and avif', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        srcsetwebp: 'g/img/test1.webp 300w',
        srcsetavif: 'g/img/test1.avif 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: true,
      }),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" srcsetavif="g/img/test1.avif 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: true,
      avif: true,
    });
  });

  it('processes element with forced pixel width', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" width="150" />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" width="150" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
      widths: [150],
    });
  });

  it('ignores non pixel width', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" width="100%" />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" width="100%" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('ignores dynamic width', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" width={width} />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" width={width} />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('processes node with specified quality', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" quality="50" />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" quality="50" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
      quality: 50,
    });
  });

  it('ignores negative quality', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" quality="-50" />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" quality="-50" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('ignores a non number quality', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" quality="100%" />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" quality="100%" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('ignores a dynamic quality', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" quality={quality} />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" quality={quality} />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('skips placeholder if immediate', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement(
        '<Image src="img/test.jpg" immediate />',
        queue as any,
        {
          inputDir: 'static',
          outputDir: 'static/g',
          webp: false,
          avif: false,
        },
      ),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" src="img/test.jpg" immediate />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
      skipPlaceholder: true,
    });
  });

  it('processes element with public path', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'g/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
      }),
    ).toEqual(
      '<Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
    });
  });

  it('processes element with src generator', async () => {
    (generateComponentAttributes as Mock).mockImplementation(() =>
      Promise.resolve({
        srcset: 'https://static.example.com/img/test1.jpg 300w',
        placeholder: '<svg />',
      }),
    );
    const queue = { process: vi.fn() };

    const generator = (path: string) => 'https://static.example.com/' + path;

    expect(
      await processImageElement('<Image src="img/test.jpg" />', queue as any, {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: false,
        avif: false,
        srcGenerator: generator,
      }),
    ).toEqual(
      '<Image srcset="https://static.example.com/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" />',
    );

    expect(generateComponentAttributes).toHaveBeenCalledWith({
      src: 'img/test.jpg',
      queue,
      inputDir: 'static',
      outputDir: 'static/g',
      webp: false,
      avif: false,
      srcGenerator: generator,
    });
  });
});
