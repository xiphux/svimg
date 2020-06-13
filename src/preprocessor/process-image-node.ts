import InlineComponent from "svelte/types/compiler/compile/nodes/InlineComponent";
import getNodeAttributes from "./get-node-attributes";
import { ImagePreprocessorOptions } from "./image-preprocessor";
import formatAttribute from "../core/format-attribute";
import generateComponentAttributes from "../component/generate-component-attributes";
import Queue from "../core/queue";

const TAG_START = '<Image';

function getStringAttr(attributes: Record<string, string | boolean>, attr: string): string {
    const attrVal = attributes[attr];
    return typeof attrVal === 'string' ? attrVal : '';
}

function getIntAttr(attributes: Record<string, string | boolean>, attr: string): number | undefined {
    const val = getStringAttr(attributes, attr);
    return val && /^[0-9]+$/.test(val) ? parseInt(val, 10) : undefined;
}

export default async function processImageNode(
    content: string,
    offset: number,
    node: InlineComponent,
    queue: Queue,
    options?: ImagePreprocessorOptions
): Promise<{ content: string, offset: number }> {
    const nodeAttr = getNodeAttributes(node);
    const src = getStringAttr(nodeAttr, 'src');
    if (!src) {
        return {
            content,
            offset,
        };
    }

    const width = getIntAttr(nodeAttr, 'width');
    const blur = getIntAttr(nodeAttr, 'blur');
    const quality = getIntAttr(nodeAttr, 'quality');
    const immediate = !!(nodeAttr.immediate);

    const attributes = await generateComponentAttributes({
        src,
        queue,
        inputDir: options.inputDir,
        outputDir: options.outputDir,
        webp: options.webp,
        widths: width ? [width] : undefined,
        blur,
        quality,
        skipPlaceholder: immediate || undefined,
    });

    const attrString = Object.entries(attributes).map(([attr, val]) => formatAttribute(attr, val)).join(' ');

    const splitIndex = node.start + offset + TAG_START.length;

    return {
        content: content.substring(0, splitIndex) + ' ' + attrString + content.substring(splitIndex),
        offset: offset + attrString.length + 1,
    };
}