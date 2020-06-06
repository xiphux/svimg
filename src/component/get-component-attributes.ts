import Image from "../image-processing/image";
import getSrcset from "./get-srcset";

export interface GetComponentAttributesOutput {
    srcset: string;
    srcsetwebp?: string;
    placeholder?: string;
    aspectratio: number;
}

interface GetComponentAttributesInput {
    images: Image[];
    webpImages: Image[];
    placeholder?: string;
    aspectRatio: number;
}

export default function getComponentAttributes(input: GetComponentAttributesInput): GetComponentAttributesOutput {
    return {
        srcset: getSrcset(input.images),
        srcsetwebp: input.webpImages.length ? getSrcset(input.webpImages) : undefined,
        placeholder: input.placeholder,
        aspectratio: input.aspectRatio,
    };
}