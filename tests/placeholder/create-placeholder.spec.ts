import createPlaceholder from '../../src/placeholder/create-placeholder';
import getImageMetadata from '../../src/core/get-image-metadata';
import resizeImage from '../../src/core/resize-image';
import getBlurSvg from '../../src/placeholder/get-blur-svg';
import getMimeType from '../../src/core/get-mime-type';
import svgDataUri from 'mini-svg-data-uri';

jest.mock('../../src/core/get-image-metadata');
jest.mock('../../src/core/resize-image');
jest.mock('../../src/placeholder/get-blur-svg');
jest.mock('../../src/core/get-mime-type');
jest.mock('mini-svg-data-uri', () => ({
    default: jest.fn(),
}));

describe('createPlaceholder', () => {

    beforeEach(() => {
        (getImageMetadata as jest.Mock).mockReset();
        (resizeImage as jest.Mock).mockReset();
        (getBlurSvg as jest.Mock).mockReset();
        (getMimeType as jest.Mock).mockReset();
        (svgDataUri as any as jest.Mock).mockReset();
    });

    it('requires input file', async () => {
        await expect(createPlaceholder('')).rejects.toThrow();
    });

    it('creates an svg with default blur', async () => {
        (getImageMetadata as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
            format: 'jpeg'
        }));
        (resizeImage as jest.Mock).mockImplementation(() => Promise.resolve({
            toString: jest.fn(() => 'base64data')
        }));
        (getMimeType as jest.Mock).mockReturnValue('image/jpeg');
        (getBlurSvg as jest.Mock).mockReturnValue('<svg />');
        (svgDataUri as any as jest.Mock).mockReturnValue('<optimizedsvg />');

        expect(await createPlaceholder('/in/file.jpg')).toEqual('<optimizedsvg />');

        expect(getImageMetadata).toHaveBeenCalledWith('/in/file.jpg');
        expect(resizeImage).toHaveBeenCalledWith('/in/file.jpg', { width: 64 });
        expect(getMimeType).toHaveBeenCalledWith('jpeg');
        expect(getBlurSvg).toHaveBeenCalledWith('data:image/jpeg;base64,base64data', 300, 200, 40);
        expect(svgDataUri).toHaveBeenCalledWith('<svg />');
    });

    it('creates an svg with custom blur', async () => {
        (getImageMetadata as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
            format: 'jpeg'
        }));
        (resizeImage as jest.Mock).mockImplementation(() => Promise.resolve({
            toString: jest.fn(() => 'base64data')
        }));
        (getMimeType as jest.Mock).mockReturnValue('image/jpeg');
        (getBlurSvg as jest.Mock).mockReturnValue('<svg />');
        (svgDataUri as any as jest.Mock).mockReturnValue('<optimizedsvg />');

        expect(await createPlaceholder('/in/file.jpg', { blur: 30 })).toEqual('<optimizedsvg />');

        expect(getImageMetadata).toHaveBeenCalledWith('/in/file.jpg');
        expect(resizeImage).toHaveBeenCalledWith('/in/file.jpg', { width: 64 });
        expect(getMimeType).toHaveBeenCalledWith('jpeg');
        expect(getBlurSvg).toHaveBeenCalledWith('data:image/jpeg;base64,base64data', 300, 200, 30);
        expect(svgDataUri).toHaveBeenCalledWith('<svg />');
    });

});
