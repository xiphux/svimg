import ensureResizeImage from './ensure-resize-image';
import { join } from 'path';
import Image from './image';
import Queue from '../core/queue';

interface ResizeImageMultipleOptions {
    widths: number[];
    quality?: number;
    filenameGenerator: (options: { width: number; quality?: number; inputFile: string }) => string;
    skipGeneration?: boolean;
    aspectRatio: number;
}

export default async function resizeImageMultiple(inputFile: string, outputDir: string, queue: Queue, options: ResizeImageMultipleOptions): Promise<Image[]> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }
    if (!outputDir) {
        throw new Error('Output file is required');
    }

    const widthPaths: Array<{ path: string, width: number }> = options.widths.map((width) => {
        const outFile = options.filenameGenerator({ width, quality: options.quality, inputFile });

        if (!outFile) {
            throw new Error('Output filename not provided');
        }

        return {
            path: join(outputDir, outFile),
            width,
        };
    })

    return options?.skipGeneration ?
        widthPaths.map(({ path, width }) => ({
            path,
            width,
            height: Math.round((width / options.aspectRatio + Number.EPSILON) * 100) / 100,
        })) :
        await Promise.all(
            widthPaths.map(
                ({ width, path }) => ensureResizeImage(inputFile, path, queue, { width, quality: options.quality })
            )
        );
}