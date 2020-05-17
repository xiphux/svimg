import InlineComponent from "svelte/types/compiler/compile/nodes/InlineComponent";
import getNodeAttributes from "./get-node-attributes";
import { ImagePreprocessorOptions } from "./image-preprocessor";
import ImageProcessingQueue from "../image-processing/image-processing-queue";
import PlaceholderQueue from "../placeholder/placeholder-queue";
import { join, dirname } from 'path';
import getComponentAttributes from "../component/get-component-attributes";
import pathToUrl from "../core/path-to-url";
import formatAttribute from "../core/format-attribute";

const TAG_START = '<Image';

export default async function processImageNode(
    content: string,
    offset: number,
    node: InlineComponent,
    queues: {
        processing: ImageProcessingQueue,
        placeholder: PlaceholderQueue,
    },
    options?: ImagePreprocessorOptions
): Promise<{ content: string, offset: number }> {
    const { src, width } = getNodeAttributes(node);
    if (!src) {
        return {
            content,
            offset,
        };
    }

    const forceWidth = width && /^[0-9]+$/.test(width) ? parseInt(width, 10) : undefined;

    const inputFile = join(options.inputDir, src);
    const outputDir = join(options.outputDir, dirname(src));

    const [{ images, webpImages }, placeholder] = await Promise.all([
        queues.processing.process({
            inputFile,
            outputDir,
            options: {
                webp: options && options.webp !== undefined ? options.webp : true,
                widths: forceWidth ? [forceWidth] : undefined,
            }
        }),
        queues.placeholder.process({
            inputFile,
        }),
    ]);

    const attributes = getComponentAttributes({
        images: images.map((i) => ({
            ...i,
            path: pathToUrl(i.path, options.inputDir),
        })),
        webpImages: webpImages.map((i) => ({
            ...i,
            path: pathToUrl(i.path, options.inputDir),
        })),
        placeholder
    });

    const attrString = Object.entries(attributes).map(([attr, val]) => formatAttribute(attr, val)).join(' ');

    const splitIndex = node.start + offset + TAG_START.length;

    return {
        content: content.substring(0, splitIndex) + ' ' + attrString + content.substring(splitIndex),
        offset: offset + attrString.length + 1,
    };
}