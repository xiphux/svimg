import InlineComponent from "svelte/types/compiler/compile/nodes/InlineComponent";
import getNodeAttributes from "./get-node-attributes";
import { ImagePreprocessorOptions } from "./image-preprocessor";
import formatAttribute from "../core/format-attribute";
import generateComponentAttributes from "../component/generate-component-attributes";
import Queue from "../core/queue";

const TAG_START = '<Image';

export default async function processImageNode(
    content: string,
    offset: number,
    node: InlineComponent,
    queue: Queue,
    options?: ImagePreprocessorOptions
): Promise<{ content: string, offset: number }> {
    const nodeAttr = getNodeAttributes(node);
    const src = nodeAttr.src && typeof nodeAttr.src === 'string' ? nodeAttr.src : '';
    const width = nodeAttr.width && typeof nodeAttr.width === 'string' ? nodeAttr.width : '';
    const blur = nodeAttr.blur && typeof nodeAttr.blur === 'string' ? nodeAttr.blur : '';
    const immediate = !!(nodeAttr.immediate);
    if (!src) {
        return {
            content,
            offset,
        };
    }

    const forceWidth = width && /^[0-9]+$/.test(width) ? parseInt(width, 10) : undefined;
    const forceBlur = blur && /^[0-9]+$/.test(blur) ? parseInt(blur, 10) : undefined;

    const attributes = await generateComponentAttributes({
        src,
        queue,
        inputDir: options.inputDir,
        outputDir: options.outputDir,
        webp: options.webp,
        widths: forceWidth ? [forceWidth] : undefined,
        blur: forceBlur,
        skipPlaceholder: immediate || undefined,
    });

    const attrString = Object.entries(attributes).map(([attr, val]) => formatAttribute(attr, val)).join(' ');

    const splitIndex = node.start + offset + TAG_START.length;

    return {
        content: content.substring(0, splitIndex) + ' ' + attrString + content.substring(splitIndex),
        offset: offset + attrString.length + 1,
    };
}