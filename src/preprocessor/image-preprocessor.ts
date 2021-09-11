import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';
import Queue from '../core/queue';
import replaceAsync from 'string-replace-async';
import processImageElement from './process-image-element';

export interface ImagePreprocessorOptions {
  inputDir: string;
  outputDir: string;
  publicPath?: string;
  webp?: boolean;
  avif?: boolean;
}

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
