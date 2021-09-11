import getComponentAttributes, {
  GetComponentAttributesOutput,
} from './get-component-attributes';
import { join, dirname } from 'path';
import pathToUrl from '../core/path-to-url';
import Queue from '../core/queue';
import createPlaceholder from '../placeholder/create-placeholder';
import processImage from '../image-processing/process-image';

interface GenerateComponentAttributesOptions {
  src: string;
  queue?: Queue;
  inputDir: string;
  outputDir: string;
  webp?: boolean;
  avif?: boolean;
  widths?: number[];
  quality?: number;
  skipGeneration?: boolean;
  skipPlaceholder?: boolean;
}

export default async function generateComponentAttributes({
  src,
  queue,
  inputDir,
  outputDir,
  webp,
  avif,
  widths,
  quality,
  skipGeneration,
  skipPlaceholder,
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
      path: pathToUrl(i.path, { inputDir, src }),
    })),
    webpImages: webpImages.map((i) => ({
      ...i,
      path: pathToUrl(i.path, { inputDir, src }),
    })),
    avifImages: avifImages.map((i) => ({
      ...i,
      path: pathToUrl(i.path, { inputDir, src }),
    })),
    placeholder,
    aspectRatio,
  });
}
