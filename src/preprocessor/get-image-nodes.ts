import InlineComponent from "svelte/types/compiler/compile/nodes/InlineComponent";
import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';
import { INode } from "svelte/types/compiler/compile/nodes/interfaces";

export default function getImageNodes(content: string): InlineComponent[] {
    if (!content) {
        return [];
    }

    const imageNodes: InlineComponent[] = [];

    const ast = parse(content);

    walk(ast as any, {
        enter(node: INode) {
            if (node.type === 'InlineComponent' && node.name === 'Image') {
                imageNodes.push(node);
            }
        }
    });

    imageNodes.sort((a, b) => a.start - b.start);

    return imageNodes;
}