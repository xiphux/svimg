import getMimeType from '../core/get-mime-type';
import resizeImage from '../core/resize-image';
import getImageMetadata from '../core/get-image-metadata';
import Queue from '../core/queue';

const BLUR_WIDTH = 64;

export default async function createPlaceholder(inputFile: string, queue: Queue): Promise<string> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    const [{ format }, blurData] = await Promise.all([
        queue.enqueue(getImageMetadata, inputFile),
        queue.enqueue(resizeImage, inputFile, { width: BLUR_WIDTH })
    ]);
    const blur64 = blurData.toString('base64');
    const mime = getMimeType(format);
    const href = `data:${mime};base64,${blur64}`;
    return href;
}