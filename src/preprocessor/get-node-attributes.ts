import { INode } from "svelte/types/compiler/compile/nodes/interfaces";

export default function getNodeAttributes(node: INode): Record<string, string> {
    if (!node.attributes) {
        return {};
    }

    // InlineComponent.Attribute typescript type in svelte is incomplete :(
    return node.attributes.reduce(
        (rv: Record<string, string>, a: any) => {
            if (a.name && a.value && a.value.length) {
                rv[a.name] = a.value[0].data;
            }
            return rv;
        },
        {}
    );
}