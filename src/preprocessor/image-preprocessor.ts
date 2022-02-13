import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';
import Queue from '../core/queue';
import replaceAsync from 'string-replace-async';
import processImageElement from './process-image-element';

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
   * The public path that images will be served from.
   * This will be prepended to the src url during preprocessing.
   *
   * The default behavior will work for most use cases,
   * where the outputDir is a subdirectory of the inputDir
   * static asset directory and the site is served from the
   * root of the domain.
   *
   * This can be overridden for more advanced use cases, such as
   * a site served from a subdirectory of the domain or for
   * images served from a separate domain such as a CDN or
   * static asset domain.
   *
   * @default The outputDir relative to the inputDir static asset directory
   */
  publicPath?: string;

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
}

/**
 * Image processing Svelte preprocessor
 * for the svimg package
 *
 * @param options Image preprocessor options
 * @returns Svelte preprocessor
 */
export default function imagePreprocessor(
  options?: ImagePreprocessorOptions,
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
