import { existsSync } from 'fs';
import sharp from 'sharp';
import Image from './image';
import getImageMetadata from '../core/get-image-metadata';

interface ResizeImageOptions {
    width: number;
    quality: number;
}

export default async function resizeImage(inputFile: string, outputFile: string, options: ResizeImageOptions): Promise<Image> {
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
        ({ width, height } = await sharp(inputFile).jpeg({
            quality: options.quality,
            force: false,
        }).png({
            quality: options.quality,
            force: false,
        }).webp({
            quality: options.quality,
            force: false,
        }).resize(options.width).toFile(outputFile));
    }
    return {
        path: outputFile,
        width,
        height,
    };
}