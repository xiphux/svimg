import type {
  PreprocessorGroup,
  Processed,
} from 'svelte/types/compiler/preprocess';
import Queue from '../core/queue';
import replaceAsync from 'string-replace-async';
import processImageElement from './process-image-element';
import type { SrcGenerator } from '../core/path-to-url';

export interface ImagePreprocessorOptions {
  /**
   * The static asset directory where
   * image urls are retrieved from
   */
  inputDir: string;

  /**
   * The output directory where resized image files
   * should be written to. This should usually be a
   * subdirectory within the normal static asset directory
   */
  outputDir: string;

  /**
   * Whether to generate WebP versions of images
   * in addition to the original image formats
   *
   * @default true
   */
  webp?: boolean;

  /**
   * Whether to generate AVIF versions of images
   * in addition to the original image formats
   *
   * @default true
   */
  avif?: boolean;

  /**
   * An optional function to override the logic of
   * how src URLs are generated for the srcset.
   *
   * This is called once per generated image file,
   * and can be used to customize the generated
   * image URLs - for example, to add or remove
   * path components or to specify a CDN domain.
   *
   * The default behavior without this parameter
   * will work for common use cases, where the
   * outputDir is a subdirectory of the inputDir
   * static asset directory and the site is served
   * from the root of the domain.
   */
  srcGenerator?: SrcGenerator;

  /**
   * Set to false to generate placeholder images
   * as separate image files, rather than
   * embedding them into the document.
   *
   * @default true
   */
  embedPlaceholder?: boolean;
}

/**
 * Image processing Svelte preprocessor
 * for the svimg package
 *
 * @param options Image preprocessor options
 * @returns Svelte preprocessor
 */
export default function imagePreprocessor(
  options: ImagePreprocessorOptions,
): PreprocessorGroup {
  const queue = new Queue();

  return {
    async markup({ content }): Promise<Processed> {
      return {
        code: await replaceAsync(content, /<Image[^>]+>/g, (element) =>
          processImageElement(element, queue, options),
        ),
      };
    },
  };
}
