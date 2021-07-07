import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';
import processImageNode from './process-image-node';
import getImageNodes from './get-image-nodes';
import Queue from '../core/queue';
import extractBlocks from './extract-blocks';
import injectBlocks from './inject-blocks';

export interface ImagePreprocessorOptions {
    inputDir: string;
    outputDir: string;
    webp?: boolean;
    avif?: boolean;
}

export default function imagePreprocessor(options?: ImagePreprocessorOptions): PreprocessorGroup {

    const queue = new Queue();

    return {
        async markup({ content }): Promise<Processed> {

            let styleBlocks: string[];
            let scriptBlocks: string[];

            ({ content, blocks: scriptBlocks } = extractBlocks(content, 'script'));
            ({ content, blocks: styleBlocks } = extractBlocks(content, 'style'));

            const imageNodes = getImageNodes(content);

            if (imageNodes.length) {
                let offset = 0;
                for (const node of imageNodes) {
                    ({ content, offset } = await processImageNode(content, offset, node, queue, options));
                }
            }

            content = injectBlocks(content, 'style', styleBlocks);
            content = injectBlocks(content, 'script', scriptBlocks);

            return {
                code: content,
            };
        }
    }
}