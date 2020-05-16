import pathToUrl from '../../src/core/path-to-url';

describe('pathToUrl', () => {

    it('returns url if nothing needs to be normalized', () => {
        expect(pathToUrl('url/to/file.jpg')).toEqual('url/to/file.jpg');
    });

    it('normalizes windows slashes', () => {
        expect(pathToUrl('url\\to\\file.jpg')).toEqual('url/to/file.jpg');
    });

    it('strips public dir if specified', () => {
        expect(pathToUrl('static/url/to/file.jpg', 'static')).toEqual('url/to/file.jpg');
        expect(pathToUrl('static/url/to/file.jpg', 'static/')).toEqual('url/to/file.jpg');
    });

    it('strips public dir on windows', () => {
        expect(pathToUrl('static\\url\\to\\file.jpg', 'static')).toEqual('url/to/file.jpg');
        expect(pathToUrl('static\\url\\to\\file.jpg', 'static/')).toEqual('url/to/file.jpg');
        expect(pathToUrl('static\\url\\to\\file.jpg', 'static\\')).toEqual('url/to/file.jpg');
    });

    it('won\'t strip public dir if it doesn\'t match path', () => {
        expect(pathToUrl('other/url/to/file.jpg', 'static')).toEqual('other/url/to/file.jpg');
        expect(pathToUrl('other/url/to/file.jpg', 'static/')).toEqual('other/url/to/file.jpg');
    });

});
