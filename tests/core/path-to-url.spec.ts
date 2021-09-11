import pathToUrl from '../../src/core/path-to-url';

describe('pathToUrl', () => {
  it('returns url if nothing needs to be normalized', () => {
    expect(pathToUrl('url/to/file.jpg')).toEqual('url/to/file.jpg');
  });

  it('normalizes windows slashes', () => {
    expect(pathToUrl('url\\to\\file.jpg')).toEqual('url/to/file.jpg');
  });

  it('strips input dir if specified', () => {
    expect(pathToUrl('static/url/to/file.jpg', { inputDir: 'static' })).toEqual(
      'url/to/file.jpg',
    );
    expect(
      pathToUrl('static/url/to/file.jpg', { inputDir: 'static/' }),
    ).toEqual('url/to/file.jpg');
  });

  it('strips input dir on windows', () => {
    expect(
      pathToUrl('static\\url\\to\\file.jpg', { inputDir: 'static' }),
    ).toEqual('url/to/file.jpg');
    expect(
      pathToUrl('static\\url\\to\\file.jpg', { inputDir: 'static/' }),
    ).toEqual('url/to/file.jpg');
    expect(
      pathToUrl('static\\url\\to\\file.jpg', { inputDir: 'static\\' }),
    ).toEqual('url/to/file.jpg');
  });

  it("won't strip input dir if it doesn't match path", () => {
    expect(pathToUrl('other/url/to/file.jpg', { inputDir: 'static' })).toEqual(
      'other/url/to/file.jpg',
    );
    expect(pathToUrl('other/url/to/file.jpg', { inputDir: 'static/' })).toEqual(
      'other/url/to/file.jpg',
    );
  });
});
