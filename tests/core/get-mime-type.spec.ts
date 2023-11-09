import getMimeType from '../../src/core/get-mime-type';
import { describe, it, expect } from 'vitest';

describe('getMimeType', () => {
  it('returns blank for an unknown format', () => {
    expect(getMimeType('dummy')).toEqual('');
  });

  it('supports jpeg', () => {
    expect(getMimeType('jpeg')).toEqual('image/jpeg');
  });

  it('supports png', () => {
    expect(getMimeType('png')).toEqual('image/png');
  });

  it('supports webp', () => {
    expect(getMimeType('webp')).toEqual('image/webp');
  });

  it('supports avif', () => {
    expect(getMimeType('avif')).toEqual('image/avif');
  });

  it('supports tiff', () => {
    expect(getMimeType('tiff')).toEqual('image/tiff');
  });

  it('supports gif', () => {
    expect(getMimeType('gif')).toEqual('image/gif');
  });

  it('supports svg', () => {
    expect(getMimeType('svg')).toEqual('image/svg+xml');
  });
});
