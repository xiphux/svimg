import pathToUrl from '../../src/core/path-to-url';

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
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it('strips input dir on windows', () => {
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static\\',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it("won't strip input dir if it doesn't match path", () => {
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
      }),
    ).toEqual('other/g/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('other/g/url/to/file.jpg');
  });

  it('preserves root relative src', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static\\',
      }),
    ).toEqual('/g/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: '/url/to/infile.jpg',
        inputDir: 'static/',
      }),
    ).toEqual('/other/g/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: '//url/to/infile.jpg',
        inputDir: 'static',
      }),
    ).toEqual('g/url/to/file.jpg');
  });

  it('uses public path if given', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: '/subdir',
      }),
    ).toEqual('/subdir/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: '/subdir/',
      }),
    ).toEqual('/subdir/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/subdir',
      }),
    ).toEqual('/subdir/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/subdir',
      }),
    ).toEqual('/subdir/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static\\',
        outputDir: 'static\\g\\',
        publicPath: '/subdir',
      }),
    ).toEqual('/subdir/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/subdir',
      }),
    ).toEqual('/subdir/other/g/url/to/file.jpg');
  });

  it('can use a root public path', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: '/',
      }),
    ).toEqual('/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: '/',
      }),
    ).toEqual('/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/',
      }),
    ).toEqual('/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/',
      }),
    ).toEqual('/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static\\',
        outputDir: 'static\\g\\',
        publicPath: '/',
      }),
    ).toEqual('/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: '/',
      }),
    ).toEqual('/other/g/url/to/file.jpg');
  });

  it('can use an external public path', () => {
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static',
        outputDir: 'static/g',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/url/to/file.jpg');
    expect(
      pathToUrl('static/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/url/to/file.jpg');
    expect(
      pathToUrl('static\\g\\url\\to\\file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static\\',
        outputDir: 'static\\g\\',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/url/to/file.jpg');
    expect(
      pathToUrl('other/g/url/to/file.jpg', {
        src: 'url/to/infile.jpg',
        inputDir: 'static/',
        outputDir: 'static/g/',
        publicPath: 'http://example.com/images',
      }),
    ).toEqual('http://example.com/images/other/g/url/to/file.jpg');
  });
});
