import { ProcessImageOptions, ProcessImageOutput } from "./process-image";
import processImage from "./process-image";
import getOptionsHash from "./get-options-hash";
import ProcessingQueue from "../core/processing-queue";
import { DEFAULT_WIDTHS, DEFAULT_QUALITY, DEFAULT_WEBP } from "../constants/defaults";

interface ImageProcessingQueueInput {
    inputFile: string;
    outputDir: string;
    options?: ProcessImageOptions;
}

export default class ImageProcessingQueue extends ProcessingQueue<ImageProcessingQueueInput, ProcessImageOutput> {

    protected async getHashKey({ inputFile, outputDir, options }: ImageProcessingQueueInput): Promise<string> {
        return getOptionsHash({
            inputFile,
            outputDir,
            options: getOptionsHash({
                widths: (options?.widths || DEFAULT_WIDTHS).slice().sort().join(','),
                quality: options?.quality || DEFAULT_QUALITY,
                webp: options?.webp ?? DEFAULT_WEBP,
                skipGeneration: options?.skipGeneration || false,
            }),
        });
    }

    protected async run({ inputFile, outputDir, options }: ImageProcessingQueueInput): Promise<ProcessImageOutput> {
        return processImage(inputFile, outputDir, options);
    }
}