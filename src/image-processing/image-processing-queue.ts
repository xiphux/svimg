import { ProcessImageOptions, ProcessImageOutput } from "./process-image";
import md5file from 'md5-file';
import processImage from "./process-image";
import getOptionsHash from "./get-options-hash";

export default class ImageProcessingQueue {
    constructor() {
        this.cache = new Map();
    }

    private cache: Map<string, Promise<ProcessImageOutput>>;

    public async process(inputFile: string, outputDir: string, options?: ProcessImageOptions): Promise<ProcessImageOutput> {
        if (!inputFile) {
            throw new Error('Input file is required');
        }
        if (!outputDir) {
            throw new Error('Output dir is required');
        }

        const fileHash = await md5file(inputFile);

        const cacheKey = this.getHashKey(inputFile, outputDir, fileHash, options);

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const p = processImage(inputFile, outputDir, options);
        this.cache.set(cacheKey, p);
        return p;
    }

    private getHashKey(inputFile: string, outputDir: string, fileHash: string, options?: ProcessImageOptions): string {
        return getOptionsHash({
            inputFile,
            outputDir,
            fileHash,
            options: options ? getOptionsHash({
                widths: options.widths ? options.widths.slice().sort().join(',') : undefined,
                quality: options.quality,
                webp: options.webp,
            }) : undefined,
        });
    }
}