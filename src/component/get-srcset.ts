import type Image from '../image-processing/image';

interface GetSrcsetOptions {
  pathOnly?: boolean;
}

export default function getSrcset(
  images: Image[],
  options?: GetSrcsetOptions,
): string {
  return images
    .map((i) => (options?.pathOnly ? i.path : `${i.path} ${i.width}w`))
    .join(', ');
}
