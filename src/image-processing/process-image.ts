import { mkdir } from 'node:fs/promises';
import md5file from 'md5-file';
import { basename, extname } from 'node:path';
import resizeImageMultiple from './resize-image-multiple';
import getOptionsHash from './get-options-hash';
import getProcessImageOptions from './get-process-image-options';
import type Image from './image';
import getImageMetadata from '../core/get-image-metadata';
import exists from '../core/exists';
import type Queue from '../core/queue';

export interface ProcessImageOptions {
  widths?: number[];
  quality?: number;
  webp?: boolean;
  avif?: boolean;
  skipGeneration?: boolean;
}

export interface ProcessImageOutput {
  images: Image[];
  webpImages: Image[];
  avifImages: Image[];
  aspectRatio: number;
}

export default async function processImage(
  inputFile: string,
  outputDir: string,
  queue: Queue,
  options?: ProcessImageOptions,
): Promise<ProcessImageOutput> {
  if (!inputFile) {
    throw new Error('Input file is required');
  }
  if (!outputDir) {
    throw new Error('Output dir is required');
  }

  const [, metadata, fileHash] = await Promise.all([
    (async () => {
      if (!options?.skipGeneration) {
        if (!(await queue.enqueue(exists, outputDir))) {
          await queue.enqueue(mkdir, outputDir, {
            recursive: true,
          });
        }
      }
    })(),
    queue.enqueue(getImageMetadata, inputFile),
    queue.enqueue(md5file, inputFile),
  ]);

  if (!metadata.width || !metadata.height) {
    throw new Error('Image dimensions could not be determined');
  }

  const { skipGeneration, ...restOpts } = options || {};
  const { widths, quality, webp, avif } = getProcessImageOptions(
    metadata.width,
    restOpts,
  );

  const filename = basename(inputFile);
  const extension = extname(filename);
  const baseFilename = filename.substring(
    0,
    filename.length - extension.length,
  );
  const aspectRatio = metadata.width / metadata.height;

  const [images, webpImages, avifImages] = await Promise.all([
    resizeImageMultiple(inputFile, outputDir, queue, {
      widths,
      quality,
      filenameGenerator: ({ width, quality }) =>
        `${baseFilename}.${getOptionsHash(
          { width, quality },
          7,
        )}.${fileHash}${extension}`,
      aspectRatio,
      skipGeneration,
    }),
    webp
      ? resizeImageMultiple(inputFile, outputDir, queue, {
          widths,
          quality,
          filenameGenerator: ({ width, quality }) =>
            `${baseFilename}.${getOptionsHash(
              { width, quality },
              7,
            )}.${fileHash}.webp`,
          aspectRatio,
          skipGeneration,
        })
      : [],
    avif
      ? resizeImageMultiple(inputFile, outputDir, queue, {
          widths,
          quality,
          filenameGenerator: ({ width, quality }) =>
            `${baseFilename}.${getOptionsHash(
              { width, quality },
              7,
            )}.${fileHash}.avif`,
          aspectRatio,
          skipGeneration,
        })
      : [],
  ]);

  return {
    images,
    webpImages,
    avifImages,
    aspectRatio,
  };
}
