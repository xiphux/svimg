import type Image from './image';
import getImageMetadata from '../core/get-image-metadata';
import { resizeImageToFile } from '../core/resize-image';
import exists from '../core/exists';
import type Queue from '../core/queue';

interface ResizeImageOptions {
  width: number;
  quality?: number;
}

export default async function ensureResizeImage(
  inputFile: string,
  outputFile: string,
  queue: Queue,
  options: ResizeImageOptions,
): Promise<Image> {
  if (!inputFile) {
    throw new Error('Input file is required');
  }
  if (!outputFile) {
    throw new Error('Output file is required');
  }

  let width: number | undefined;
  let height: number | undefined;
  if (await queue.enqueue(exists, outputFile)) {
    ({ width, height } = await queue.enqueue(getImageMetadata, outputFile));
  } else {
    ({ width, height } = await queue.enqueue(
      resizeImageToFile,
      inputFile,
      {
        width: options.width,
        quality: options.quality,
      },
      outputFile,
    ));
  }
  if (!width || !height) {
    throw new Error('Image dimensions could not be determined');
  }
  return {
    path: outputFile,
    width,
    height,
  };
}
