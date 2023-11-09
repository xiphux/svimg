import getComponentAttributes from '../../src/component/get-component-attributes';
import { describe, it, expect } from 'vitest';

describe('getComponentAttributes', () => {
  it('returns single srcset', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
    });

    expect(attributes.srcset).toEqual('one.jpg 100w, two.jpg 200w');
    expect(attributes.srcsetwebp).toBeUndefined();
    expect(attributes.srcsetavif).toBeUndefined();
  });

  it('returns webp srcset', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [
        {
          path: 'one.webp',
          width: 100,
          height: 200,
        },
        {
          path: 'two.webp',
          width: 200,
          height: 300,
        },
      ],
      avifImages: [],
      aspectRatio: 0.5,
    });

    expect(attributes.srcset).toEqual('one.jpg 100w, two.jpg 200w');
    expect(attributes.srcsetwebp).toEqual('one.webp 100w, two.webp 200w');
    expect(attributes.srcsetavif).toBeUndefined();
  });

  it('returns avif srcset', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [
        {
          path: 'one.avif',
          width: 100,
          height: 200,
        },
        {
          path: 'two.avif',
          width: 200,
          height: 300,
        },
      ],
      aspectRatio: 0.5,
    });

    expect(attributes.srcset).toEqual('one.jpg 100w, two.jpg 200w');
    expect(attributes.srcsetwebp).toBeUndefined();
    expect(attributes.srcsetavif).toEqual('one.avif 100w, two.avif 200w');
  });

  it('returns webp and avif srcset', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [
        {
          path: 'one.webp',
          width: 100,
          height: 200,
        },
        {
          path: 'two.webp',
          width: 200,
          height: 300,
        },
      ],
      avifImages: [
        {
          path: 'one.avif',
          width: 100,
          height: 200,
        },
        {
          path: 'two.avif',
          width: 200,
          height: 300,
        },
      ],
      aspectRatio: 0.5,
    });

    expect(attributes.srcset).toEqual('one.jpg 100w, two.jpg 200w');
    expect(attributes.srcsetwebp).toEqual('one.webp 100w, two.webp 200w');
    expect(attributes.srcsetavif).toEqual('one.avif 100w, two.avif 200w');
  });

  it('returns placeholder', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      placeholder: 'placeholder1',
      aspectRatio: 0.5,
    });

    expect(attributes.placeholder).toEqual('placeholder1');
  });

  it('returns aspect ratio', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
    });

    expect(attributes.aspectratio).toEqual(0.5);
  });

  it('returns placeholder src', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
      placeholderImage: {
        path: 'placeholder.jpg',
        width: 64,
        height: 128,
      },
    });

    expect(attributes.placeholdersrc).toEqual('placeholder.jpg');
  });

  it('returns placeholder webp', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
      placeholderWebp: {
        path: 'placeholder.webp',
        width: 64,
        height: 128,
      },
    });

    expect(attributes.placeholderwebp).toEqual('placeholder.webp');
  });

  it('returns placeholder avif', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
      placeholderAvif: {
        path: 'placeholder.avif',
        width: 64,
        height: 128,
      },
    });

    expect(attributes.placeholderavif).toEqual('placeholder.avif');
  });

  it('returns multiple placeholders', () => {
    const attributes = getComponentAttributes({
      images: [
        {
          path: 'one.jpg',
          width: 100,
          height: 200,
        },
        {
          path: 'two.jpg',
          width: 200,
          height: 300,
        },
      ],
      webpImages: [],
      avifImages: [],
      aspectRatio: 0.5,
      placeholderImage: {
        path: 'placeholder.jpg',
        width: 64,
        height: 128,
      },
      placeholderWebp: {
        path: 'placeholder.webp',
        width: 64,
        height: 128,
      },
      placeholderAvif: {
        path: 'placeholder.avif',
        width: 64,
        height: 128,
      },
    });

    expect(attributes.placeholdersrc).toEqual('placeholder.jpg');
    expect(attributes.placeholderwebp).toEqual('placeholder.webp');
    expect(attributes.placeholderavif).toEqual('placeholder.avif');
  });
});
