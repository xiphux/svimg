import type Image from '../image-processing/image';
import getSrcset from './get-srcset';

export interface GetComponentAttributesOutput {
  srcset: string;
  srcsetwebp?: string;
  srcsetavif?: string;
  placeholder?: string;
  aspectratio: number;
  placeholdersrc?: string;
  placeholderwebp?: string;
  placeholderavif?: string;
}

interface GetComponentAttributesInput {
  images: Image[];
  webpImages: Image[];
  avifImages: Image[];
  placeholder?: string;
  aspectRatio: number;
  placeholderImage?: Image;
  placeholderWebp?: Image;
  placeholderAvif?: Image;
}

export default function getComponentAttributes(
  input: GetComponentAttributesInput,
): GetComponentAttributesOutput {
  return {
    srcset: getSrcset(input.images),
    srcsetwebp: input.webpImages.length
      ? getSrcset(input.webpImages)
      : undefined,
    srcsetavif: input.avifImages.length
      ? getSrcset(input.avifImages)
      : undefined,
    placeholder: input.placeholder,
    aspectratio: input.aspectRatio,
    placeholdersrc: input.placeholderImage
      ? getSrcset([input.placeholderImage], { pathOnly: true })
      : undefined,
    placeholderwebp: input.placeholderWebp
      ? getSrcset([input.placeholderWebp], { pathOnly: true })
      : undefined,
    placeholderavif: input.placeholderAvif
      ? getSrcset([input.placeholderAvif], { pathOnly: true })
      : undefined,
  };
}
