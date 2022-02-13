import type Image from '../image-processing/image';

export default function getSrcset(images: Image[]): string {
  return images.map((i) => `${i.path} ${i.width}w`).join(', ');
}
