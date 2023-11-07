import getMimeType from '../core/get-mime-type';
import resizeImage from '../core/resize-image';
import getImageMetadata from '../core/get-image-metadata';
import type Queue from '../core/queue';
import { PLACEHOLDER_WIDTH } from '../constants/defaults';

export default async function createPlaceholder(
  inputFile: string,
  queue: Queue,
): Promise<string> {
  if (!inputFile) {
    throw new Error('Input file is required');
  }

  const [{ format }, blurData] = await Promise.all([
    queue.enqueue(getImageMetadata, inputFile),
    queue.enqueue(resizeImage, inputFile, { width: PLACEHOLDER_WIDTH }),
  ]);

  if (!format) {
    throw new Error('Image format could not be determined');
  }

  const blur64 = blurData.toString('base64');
  const mime = getMimeType(format);
  const href = `data:${mime};base64,${blur64}`;
  return href;
}
