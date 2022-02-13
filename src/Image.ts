import { SvelteComponentTyped } from 'svelte';

export interface ImageProps {
  src: string;
  alt?: string;
  class?: string;
  width?: number | string;
  immediate?: boolean;
  blur?: number | string;
  quality?: number | string;
}

export default class Image extends SvelteComponentTyped<ImageProps> {}
