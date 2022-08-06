import getComponentAttributes from './get-component-attributes';
import type { GetComponentAttributesOutput } from './get-component-attributes';
import { join, dirname } from 'path';
import pathToUrl from '../core/path-to-url';
import Queue from '../core/queue';
import createPlaceholder from '../placeholder/create-placeholder';
import processImage from '../image-processing/process-image';
import type { SrcGenerator } from '../core/path-to-url';
import { PLACEHOLDER_WIDTH } from '../constants/defaults';
import type Image from '../image-processing/image';

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
  embedPlaceholder?: boolean;
}

function transformImagePath(
  image: Image,
  {
    inputDir,
    outputDir,
    src,
    publicPath,
    srcGenerator,
  }: GenerateComponentAttributesOptions,
): Image {
  return {
    ...image,
    path: pathToUrl(image.path, {
      inputDir,
      outputDir,
      src,
      publicPath,
      srcGenerator,
    }),
  };
}

export default async function generateComponentAttributes(
  options: GenerateComponentAttributesOptions,
): Promise<GetComponentAttributesOutput> {
  let {
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
    embedPlaceholder,
  } = options;

  if (!src) {
    throw new Error('Src is required');
  }
  if (!inputDir) {
    throw new Error('Input dir is required');
  }
  if (!outputDir) {
    throw new Error('Output dir is required');
  }

  if (typeof embedPlaceholder === 'undefined') {
    // TODO: change to false with major version
    embedPlaceholder = true;
  }

  queue = queue || new Queue();

  const inputFile = join(inputDir, src);
  const outputDirReal = join(outputDir, dirname(src));

  const [
    { images, webpImages, avifImages, aspectRatio },
    placeholder,
    placeholderImages,
  ] = await Promise.all([
    processImage(inputFile, outputDirReal, queue, {
      webp: webp ?? true,
      avif: avif ?? true,
      widths,
      skipGeneration,
      quality,
    }),
    !skipPlaceholder && embedPlaceholder
      ? createPlaceholder(inputFile, queue)
      : undefined,
    !skipPlaceholder && !embedPlaceholder
      ? processImage(inputFile, outputDirReal, queue, {
          webp: webp ?? true,
          avif: avif ?? true,
          widths: [PLACEHOLDER_WIDTH],
          skipGeneration,
          quality,
        })
      : undefined,
  ]);

  return getComponentAttributes({
    images: images.map((i) => transformImagePath(i, options)),
    webpImages: webpImages.map((i) => transformImagePath(i, options)),
    avifImages: avifImages.map((i) => transformImagePath(i, options)),
    placeholder,
    aspectRatio,
    placeholderImage: placeholderImages?.images?.length
      ? transformImagePath(placeholderImages.images[0], options)
      : undefined,
    placeholderWebp: placeholderImages?.webpImages?.length
      ? transformImagePath(placeholderImages.webpImages[0], options)
      : undefined,
    placeholderAvif: placeholderImages?.avifImages?.length
      ? transformImagePath(placeholderImages.avifImages[0], options)
      : undefined,
  });
}
