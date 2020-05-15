import { existsSync } from 'fs';
import Image from './image';
import getImageMetadata from '../core/get-image-metadata';
import resizeImageCore from '../core/resize-image';

interface ResizeImageOptions {
    width: number;
    quality: number;
}

export default async function ensureResizeImage(inputFile: string, outputFile: string, options: ResizeImageOptions): Promise<Image> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }
    if (!outputFile) {
        throw new Error('Output file is required');
    }

    let width;
    let height;
    if (existsSync(outputFile)) {
        ({ width, height } = await getImageMetadata(outputFile));
    } else {
        ({ width, height } = await resizeImageCore(
            inputFile,
            {
                width: options.width,
                quality: options.quality,
            },
            outputFile
        ));
    }
    return {
        path: outputFile,
        width,
        height,
    };
}