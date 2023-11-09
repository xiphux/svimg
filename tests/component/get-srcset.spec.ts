import getSrcset from '../../src/component/get-srcset';
import { describe, it, expect } from 'vitest';

describe('getSrcset', () => {
  it('builds an empty srcset', () => {
    expect(getSrcset([])).toEqual('');
  });

  it('builds a single item srcset', () => {
    expect(
      getSrcset([
        {
          path: 'images/image-300.jpg',
          width: 300,
          height: 300,
        },
      ]),
    ).toEqual('images/image-300.jpg 300w');
  });

  it('builds a multi item srcset', () => {
    expect(
      getSrcset([
        {
          path: 'images/image-300.jpg',
          width: 300,
          height: 300,
        },
        {
          path: 'images/image-600.jpg',
          width: 600,
          height: 600,
        },
        {
          path: 'images/image-900.jpg',
          width: 900,
          height: 900,
        },
      ]),
    ).toEqual(
      'images/image-300.jpg 300w, images/image-600.jpg 600w, images/image-900.jpg 900w',
    );
  });

  it('omits width for a single item', () => {
    expect(
      getSrcset(
        [
          {
            path: 'images/image-300.jpg',
            width: 300,
            height: 300,
          },
        ],
        { pathOnly: true },
      ),
    ).toEqual('images/image-300.jpg');
  });

  it('omits width for mutiple items', () => {
    expect(
      getSrcset(
        [
          {
            path: 'images/image-300.jpg',
            width: 300,
            height: 300,
          },
          {
            path: 'images/image-600.jpg',
            width: 600,
            height: 600,
          },
          {
            path: 'images/image-900.jpg',
            width: 900,
            height: 900,
          },
        ],
        { pathOnly: true },
      ),
    ).toEqual(
      'images/image-300.jpg, images/image-600.jpg, images/image-900.jpg',
    );
  });
});
