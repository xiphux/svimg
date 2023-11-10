import imagePreprocessor from '../../src/preprocessor/image-preprocessor';
import processImageElement from '../../src/preprocessor/process-image-element';
import Queue from '../../src/core/queue';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/preprocessor/process-image-element');
vi.mock('../../src/core/queue');

describe('imagePreprocessor', () => {
  beforeEach(() => {
    (processImageElement as Mock).mockReset();
  });

  it("returns content if there aren't any image nodes", async () => {
    const processor = imagePreprocessor({
      inputDir: 'static',
      outputDir: 'static/g',
      webp: true,
      avif: true,
    });

    expect(
      await processor.markup!({
        content: '<content>',
        filename: 'file',
      }),
    ).toEqual({
      code: '<content>',
    });

    expect(processImageElement).not.toHaveBeenCalled();
  });

  it('processes image nodes', async () => {
    vi.mocked(processImageElement).mockImplementation((val: string) =>
      Promise.resolve(
        val.substring(0, 6) + ' srcset="srcset"' + val.substring(6),
      ),
    );
    const processor = imagePreprocessor({
      inputDir: 'static',
      outputDir: 'static/g',
      webp: true,
      avif: true,
    });

    expect(
      await processor.markup!({
        content: `
                <div>
                    <Image src="images/one.jpg" width="150" immediate />
                </div>
                <Image src="images/two.jpg" alt={altText}></Image>
            `,
        filename: 'file',
      }),
    ).toEqual({
      code: `
                <div>
                    <Image srcset="srcset" src="images/one.jpg" width="150" immediate />
                </div>
                <Image srcset="srcset" src="images/two.jpg" alt={altText}></Image>
            `,
    });

    expect(processImageElement).toHaveBeenCalledTimes(2);
    expect(processImageElement).toHaveBeenCalledWith(
      '<Image src="images/one.jpg" width="150" immediate />',
      expect.any(Queue),
      {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: true,
      },
    );
    expect(processImageElement).toHaveBeenCalledWith(
      '<Image src="images/two.jpg" alt={altText}>',
      expect.any(Queue),
      {
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: true,
      },
    );
  });
});
