import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';
import processImageNode from './process-image-node';
import getImageNodes from './get-image-nodes';
import Queue from '../core/queue';

export interface ImagePreprocessorOptions {
    inputDir: string;
    outputDir: string;
    webp?: boolean;
}

export default function imagePreprocessor(options?: ImagePreprocessorOptions): PreprocessorGroup {

    const queue = new Queue();

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
                ({ content, offset } = await processImageNode(content, offset, node, queue, options));
            }

            return {
                code: content,
            };
        }
    }
}