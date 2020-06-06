import { INode } from "svelte/types/compiler/compile/nodes/interfaces";

export default function getNodeAttributes(node: INode): Record<string, string | boolean> {
    if (!node.attributes) {
        return {};
    }

    // InlineComponent.Attribute typescript type in svelte is incomplete :(
    return node.attributes.reduce(
        (rv: Record<string, string | boolean>, a: any) => {
            if (a.name && a.value) {
                if (a.value.length) {
                    rv[a.name] = a.value[0].data;
                } else if (a.value === true) {
                    rv[a.name] = true;
                }
            }
            return rv;
        },
        {}
    );
}