import getComponentAttributes from './get-component-attributes';
import type { GetComponentAttributesOutput } from './get-component-attributes';
import { join, dirname } from 'path';
import pathToUrl from '../core/path-to-url';
import Queue from '../core/queue';
import createPlaceholder from '../placeholder/create-placeholder';
import processImage from '../image-processing/process-image';
import type { SrcGenerator } from '../core/path-to-url';

interface GenerateComponentAttributesOptions {
  src: string;
  queue?: Queue;
  inputDir: string;
  outputDir: string;
  publicPath?: string;
  webp?: boolean;
  avif?: boolean;
  widths?: number[];
  quality?: number;
  skipGeneration?: boolean;
  skipPlaceholder?: boolean;
  srcGenerator?: SrcGenerator;
}

export default async function generateComponentAttributes({
  src,
  queue,
  inputDir,
  outputDir,
  publicPath,
  webp,
  avif,
  widths,
  quality,
  skipGeneration,
  skipPlaceholder,
  srcGenerator,
}: GenerateComponentAttributesOptions): Promise<GetComponentAttributesOutput> {
  if (!src) {
    throw new Error('Src is required');
  }
  if (!inputDir) {
    throw new Error('Input dir is required');
  }
  if (!outputDir) {
    throw new Error('Output dir is required');
  }

  queue = queue || new Queue();

  const inputFile = join(inputDir, src);
  const outputDirReal = join(outputDir, dirname(src));

  const [{ images, webpImages, avifImages, aspectRatio }, placeholder] =
    await Promise.all([
      processImage(inputFile, outputDirReal, queue, {
        webp: webp ?? true,
        avif: avif ?? true,
        widths,
        skipGeneration,
        quality,
      }),
      !skipPlaceholder ? createPlaceholder(inputFile, queue) : undefined,
    ]);

  return getComponentAttributes({
    images: images.map((i) => ({
      ...i,
      path: pathToUrl(i.path, {
        inputDir,
        outputDir,
        src,
        publicPath,
        srcGenerator,
      }),
    })),
    webpImages: webpImages.map((i) => ({
      ...i,
      path: pathToUrl(i.path, {
        inputDir,
        outputDir,
        src,
        publicPath,
        srcGenerator,
      }),
    })),
    avifImages: avifImages.map((i) => ({
      ...i,
      path: pathToUrl(i.path, {
        inputDir,
        outputDir,
        src,
        publicPath,
        srcGenerator,
      }),
    })),
    placeholder,
    aspectRatio,
  });
}
