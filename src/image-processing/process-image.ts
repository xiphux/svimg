import { existsSync, mkdir } from 'fs';
import { promisify } from 'util';
import md5file from 'md5-file';
import { basename, extname } from 'path';
import resizeImageMultiple from './resize-image-multiple';
import getOptionsHash from './get-options-hash';
import getProcessImageOptions from './get-process-image-options';
import Image from './image';
import getImageMetadata from '../core/get-image-metadata';

const mkdirPromise = promisify(mkdir);

export interface ProcessImageOptions {
    widths?: number[];
    quality?: number;
    webp?: boolean;
    skipGeneration?: boolean;
}

export interface ProcessImageOutput {
    images: Image[];
    webpImages: Image[];
}

export default async function processImage(inputFile: string, outputDir: string, options?: ProcessImageOptions): Promise<ProcessImageOutput> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }
    if (!outputDir) {
        throw new Error('Output dir is required');
    }

    if (!options?.skipGeneration && !existsSync(outputDir)) {
        await mkdirPromise(outputDir, { recursive: true });
    }

    const metadata = await getImageMetadata(inputFile);

    const { skipGeneration, ...restOpts } = options;
    const { widths, quality, webp } = getProcessImageOptions(metadata.width, restOpts);

    const filename = basename(inputFile);
    const extension = extname(filename);
    const baseFilename = filename.substring(0, filename.length - extension.length);
    const fileHash = await md5file(inputFile);
    const aspectRatio = metadata.width / metadata.height;

    const images = await resizeImageMultiple(inputFile, outputDir, {
        widths,
        quality,
        filenameGenerator: ({ width, quality }) => `${baseFilename}.${getOptionsHash({ width, quality }, 7)}.${fileHash}${extension}`,
        aspectRatio,
        skipGeneration,
    });
    const webpImages = webp ? await resizeImageMultiple(inputFile, outputDir, {
        widths,
        quality,
        filenameGenerator: ({ width, quality }) => `${baseFilename}.${getOptionsHash({ width, quality }, 7)}.${fileHash}.webp`,
        aspectRatio,
        skipGeneration,
    }) : [];

    return {
        images,
        webpImages
    };
}