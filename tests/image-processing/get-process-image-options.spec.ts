import getProcessImageOptions from '../../src/image-processing/get-process-image-options';
import { describe, it, expect } from 'vitest';

describe('getProcessImageOptions', () => {
  it('returns default widths less than or equal to the original width', () => {
    const { widths } = getProcessImageOptions(1920);
    expect(widths).toEqual([480, 1024, 1920]);
  });

  it('returns default widths with original image width if original is larger', () => {
    const { widths } = getProcessImageOptions(4160);
    expect(widths).toEqual([480, 1024, 1920, 2560, 4160]);
  });

  it("returns original width if it's smaller than all default widths", () => {
    const { widths } = getProcessImageOptions(150);
    expect(widths).toEqual([150]);
  });

  it("returns original width if it's smaller than all passed widths", () => {
    expect(
      getProcessImageOptions(150, {
        widths: [300],
      }).widths,
    ).toEqual([150]);
    expect(
      getProcessImageOptions(150, {
        widths: [300, 500],
      }).widths,
    ).toEqual([150]);
  });

  it('returns passed widths smaller than original width', () => {
    const { widths } = getProcessImageOptions(2100, {
      widths: [500, 1000, 1500, 2000, 2500],
    });
    expect(widths).toEqual([500, 1000, 1500, 2000]);
  });

  it('returns undefined quality if not passed', () => {
    const { quality } = getProcessImageOptions(500);
    expect(quality).toBeUndefined();
  });

  it('returns passed quality', () => {
    const { quality } = getProcessImageOptions(500, {
      quality: 80,
    });
    expect(quality).toEqual(80);
  });

  it('returns passed webp', () => {
    const opts = getProcessImageOptions(500, {
      webp: true,
    });
    expect(opts.webp).toEqual(true);
    const opts2 = getProcessImageOptions(500, {
      webp: false,
    });
    expect(opts2.webp).toEqual(false);
  });

  it('defaults webp to true', () => {
    const opts = getProcessImageOptions(500, {});
    expect(opts.webp).toEqual(true);
    const opts2 = getProcessImageOptions(500);
    expect(opts2.webp).toEqual(true);
  });

  it('returns passed avif', () => {
    const opts = getProcessImageOptions(500, {
      avif: true,
    });
    expect(opts.avif).toEqual(true);
    const opts2 = getProcessImageOptions(500, {
      avif: false,
    });
    expect(opts2.avif).toEqual(false);
  });

  it('defaults avif to true', () => {
    const opts = getProcessImageOptions(500, {});
    expect(opts.avif).toEqual(true);
    const opts2 = getProcessImageOptions(500);
    expect(opts2.avif).toEqual(true);
  });
});
