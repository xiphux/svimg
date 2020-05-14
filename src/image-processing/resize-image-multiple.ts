import resizeImage from './resize-image';
import { join } from 'path';

interface ResizeImageMultipleOptions {
    widths: number[];
    quality: number;
    filenameGenerator: (options: { width: number; quality: number; inputFile: string }) => string;
}

interface Image {
    path: string;
    width: number;
    height: number;
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
        images.push(await resizeImage(inputFile, path, { width, quality: options.quality }));
    }

    return images;
}