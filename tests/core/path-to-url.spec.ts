import pathToUrl, { SrcGenerator } from '../../src/core/path-to-url';
import { basename } from 'node:path';
import { describe, it, expect, vi } from 'vitest';

describe('pathToUrl', () => {
  it('returns url if nothing needs to be normalized', () => {
    expect(pathToUrl('g/url/to/file.jpg')).toEqual('g/url/to/file.jpg');
  });

  it('normalizes windows slashes', () => {
    expect(pathToUrl('g\\url\\to\\file.jpg')).toEqual('g/url/to/file.jpg');
  });

  it('strips input dir if specified', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it('strips input dir on windows', () => {
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static\\',
        outputDir: 'static\\g',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it("won't strip input dir if it doesn't match path", () => {
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual('other/g/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('other/g/url/to/file.jpg');
  });

  it('preserves root relative src', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static\\',
        outputDir: 'static\\g',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
      }),
    ).toEqual('/other/g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '//url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it('can use a custom src generator to add a custom path', () => {
    const generator = vi.fn((path, info) => '/test/' + path);

    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
        srcGenerator: generator,
      }),
    ).toEqual('/test/url/to/file.jpg');

    expect(generator).toHaveBeenCalledWith('url/to/file.jpg', {
      src: 'url/to/infile.jpg',
      inputDir: 'static/',
      outputDir: 'static/g',
    });
  });

  it('can use a custom src generator to add a custom domain', () => {
    const generator = vi.fn(
      (path, info) => 'https://static.example.com/images/' + path,
    );

    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
        srcGenerator: generator,
      }),
    ).toEqual('https://static.example.com/images/url/to/file.jpg');

    expect(generator).toHaveBeenCalledWith('url/to/file.jpg', {
      src: 'url/to/infile.jpg',
      inputDir: 'static/',
      outputDir: 'static/g',
    });
  });

  it('can use a custom src generator to rewrite paths', () => {
    const generator = vi.fn(
      (path, info) => 'some/other/path/' + basename(path),
    );

    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g',
        srcGenerator: generator,
      }),
    ).toEqual('some/other/path/file.jpg');

    expect(generator).toHaveBeenCalledWith('url/to/file.jpg', {
      src: 'url/to/infile.jpg',
      inputDir: 'static/',
      outputDir: 'static/g',
    });
  });
});
