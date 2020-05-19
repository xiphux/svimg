import getComponentAttributes from '../../src/component/get-component-attributes';
import getSrcset from '../../src/component/get-srcset';

jest.mock('../../src/component/get-srcset');

describe('getComponentAttributes', () => {

    beforeEach(() => {
        (getSrcset as jest.Mock).mockReset();
    });

    it('builds attributes with just srcset', () => {
        (getSrcset as jest.Mock).mockReturnValue('image1.jpg 200w');

        expect(getComponentAttributes({
            images: [{ path: 'image1.jpg', width: 200, height: 200 }],
            webpImages: [],
        })).toEqual({
            srcset: 'image1.jpg 200w'
        });

        expect(getSrcset).toHaveBeenCalledTimes(1);
        expect(getSrcset).toHaveBeenCalledWith([{ path: 'image1.jpg', width: 200, height: 200 }]);
    });

    it('builds attributes with webp srcset', () => {
        (getSrcset as jest.Mock).mockReturnValueOnce('image1.jpg 200w').mockReturnValueOnce('image1.webp 200w');

        expect(getComponentAttributes({
            images: [{ path: 'image1.jpg', width: 200, height: 200 }],
            webpImages: [{ path: 'image1.webp', width: 200, height: 200 }],
        })).toEqual({
            srcset: 'image1.jpg 200w',
            srcsetwebp: 'image1.webp 200w',
        });

        expect(getSrcset).toHaveBeenCalledTimes(2);
        expect(getSrcset).toHaveBeenCalledWith([{ path: 'image1.jpg', width: 200, height: 200 }]);
        expect(getSrcset).toHaveBeenCalledWith([{ path: 'image1.webp', width: 200, height: 200 }]);
    });

});