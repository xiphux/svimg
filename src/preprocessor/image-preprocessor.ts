import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';
import ImageProcessingQueue from '../image-processing/image-processing-queue';
import PlaceholderQueue from '../placeholder/placeholder-queue';
import processImageNode from './process-image-node';
import getImageNodes from './get-image-nodes';

export interface ImagePreprocessorOptions {
    publicDir: string;
    outputDir: string;
    webp: boolean;
}

export default function imagePreprocessor(options?: ImagePreprocessorOptions): PreprocessorGroup {

    const processingQueue = new ImageProcessingQueue();
    const placeholderQueue = new PlaceholderQueue();

    return {
        async markup({ content }): Promise<Processed> {

            const imageNodes = getImageNodes(content);
            if (!imageNodes.length) {
                return {
                    code: content,
                };
            }

            let offset = 0;
            for (const node of imageNodes) {
                ({ content, offset } = await processImageNode(content, offset, node, {
                    processing: processingQueue,
                    placeholder: placeholderQueue,
                }, options));
            }

            return {
                code: content,
            };
        }
    }
}