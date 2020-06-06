import fs from 'fs';
import md5file from 'md5-file';
import { basename, extname } from 'path';
import resizeImageMultiple from './resize-image-multiple';
import getOptionsHash from './get-options-hash';
import getProcessImageOptions from './get-process-image-options';
import Image from './image';
import getImageMetadata from '../core/get-image-metadata';
import exists from '../core/exists';
import Queue from '../core/queue';

export interface ProcessImageOptions {
    widths?: number[];
    quality?: number;
    webp?: boolean;
    skipGeneration?: boolean;
}

export interface ProcessImageOutput {
    images: Image[];
    webpImages: Image[];
    aspectRatio: number;
}

export default async function processImage(inputFile: string, outputDir: string, queue: Queue, options?: ProcessImageOptions): Promise<ProcessImageOutput> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }
    if (!outputDir) {
        throw new Error('Output dir is required');
    }

    const [, metadata, fileHash] = await Promise.all([
        (async () => {
            if (!(options?.skipGeneration)) {
                if (!(await queue.enqueue(exists, outputDir))) {
                    await queue.enqueue(fs.promises.mkdir, outputDir, { recursive: true });
                }
            }
        })(),
        queue.enqueue(getImageMetadata, inputFile),
        queue.enqueue(md5file, inputFile)
    ]);

    const { skipGeneration, ...restOpts } = options || {};
    const { widths, quality, webp } = getProcessImageOptions(metadata.width, restOpts);

    const filename = basename(inputFile);
    const extension = extname(filename);
    const baseFilename = filename.substring(0, filename.length - extension.length);
    const aspectRatio = metadata.width / metadata.height;

    const [images, webpImages] = await Promise.all([
        resizeImageMultiple(inputFile, outputDir, queue, {
            widths,
            quality,
            filenameGenerator: ({ width, quality }) => `${baseFilename}.${getOptionsHash({ width, quality }, 7)}.${fileHash}${extension}`,
            aspectRatio,
            skipGeneration,
        }),
        webp ? resizeImageMultiple(inputFile, outputDir, queue, {
            widths,
            quality,
            filenameGenerator: ({ width, quality }) => `${baseFilename}.${getOptionsHash({ width, quality }, 7)}.${fileHash}.webp`,
            aspectRatio,
            skipGeneration,
        }) : []
    ]);

    return {
        images,
        webpImages,
        aspectRatio,
    };
}