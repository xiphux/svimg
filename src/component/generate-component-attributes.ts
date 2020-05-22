import getComponentAttributes, { GetComponentAttributesOutput } from './get-component-attributes';
import { join, dirname } from 'path';
import ImageProcessingQueue from '../image-processing/image-processing-queue';
import PlaceholderQueue from '../placeholder/placeholder-queue';
import pathToUrl from '../core/path-to-url';

interface GenerateComponentAttributesOptions {
    src: string;
    processingQueue: ImageProcessingQueue;
    placeholderQueue: PlaceholderQueue;
    inputDir: string;
    outputDir: string;
    webp?: boolean;
    widths?: number[];
}

export default async function generateComponentAttributes({
    src,
    processingQueue,
    placeholderQueue,
    inputDir,
    outputDir,
    webp,
    widths
}: GenerateComponentAttributesOptions): Promise<GetComponentAttributesOutput> {
    if (!src) {
        throw new Error('Src is required');
    }
    if (!inputDir) {
        throw new Error('Input dir is required');
    }
    if (!outputDir) {
        throw new Error('Output dir is required');
    }

    const inputFile = join(inputDir, src);
    const outputDirReal = join(outputDir, dirname(src));

    const [{ images, webpImages }, placeholder] = await Promise.all([
        processingQueue.process({
            inputFile,
            outputDir: outputDirReal,
            options: {
                webp: webp ?? true,
                widths,
            }
        }),
        placeholderQueue.process({
            inputFile,
        })
    ]);

    return getComponentAttributes({
        images: images.map((i) => ({
            ...i,
            path: pathToUrl(i.path, inputDir),
        })),
        webpImages: webpImages.map((i) => ({
            ...i,
            path: pathToUrl(i.path, inputDir),
        })),
        placeholder,
    });
}