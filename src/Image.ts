import { SvelteComponent } from 'svelte';

export interface ImageProps {
  /**
   * Image url
   */
  src: string;

  /**
   * Alternate text for the image
   */
  alt?: string;

  /**
   * CSS classes to apply to image
   */
  class?: string;

  /**
   * Resize image to specified width in pixels
   */
  width?: number | string;

  /**
   * Set to true to disable lazy-loading
   *
   * @default false
   */
  immediate?: boolean;

  /**
   * Amount of blur to apply to placeholder
   *
   * @default 40
   */
  blur?: number | string;

  /**
   * Quality of the resized images
   *
   * @default sharp's default quality
   */
  quality?: number | string;
}

/**
 * Image lazy loading Svelte component
 * for the svimg package
 */
export default class Image extends SvelteComponent<ImageProps> {}
