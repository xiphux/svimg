import ensureResizeImage from './ensure-resize-image';
import { join } from 'path';
import Image from './image';

interface ResizeImageMultipleOptions {
    widths: number[];
    quality: number;
    filenameGenerator: (options: { width: number; quality: number; inputFile: string }) => string;
    skipGeneration?: boolean;
    aspectRatio: number;
}

export default async function resizeImageMultiple(inputFile: string, outputDir: string, options: ResizeImageMultipleOptions): Promise<Image[]> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }
    if (!outputDir) {
        throw new Error('Output file is required');
    }

    const images: Image[] = [];

    for (const width of options.widths) {
        const outFile = options.filenameGenerator({ width, quality: options.quality, inputFile });

        if (!outFile) {
            throw new Error('Output filename not provided');
        }

        const path = join(outputDir, outFile);

        if (options?.skipGeneration) {
            images.push({
                path,
                width,
                height: Math.round((width / options.aspectRatio + Number.EPSILON) * 100) / 100,
            });
        } else {
            images.push(await ensureResizeImage(inputFile, path, { width, quality: options.quality }));
        }
    }

    return images;
}