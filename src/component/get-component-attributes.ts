import Image from "../image-processing/image";
import getSrcset from "./get-srcset";

interface GetComponentAttributesOutput {
    srcset: string;
    srcsetWebp?: string;
    placeholder?: string;
}

interface GetComponentAttributesInput {
    images: Image[];
    webpImages: Image[];
    placeholder?: string;
}

export default function getComponentAttributes(input: GetComponentAttributesInput): GetComponentAttributesOutput {
    return {
        srcset: getSrcset(input.images),
        srcsetWebp: input.webpImages.length ? getSrcset(input.webpImages) : undefined,
        placeholder: input.placeholder,
    };
}