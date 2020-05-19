import getComponentAttributes from '../../src/component/get-component-attributes';
import getSrcset from '../../src/component/get-srcset';

jest.mock('../../src/component/get-srcset');

describe('getComponentAttributes', () => {

    beforeEach(() => {
        (getSrcset as jest.Mock).mockReset();
    });

    it('returns single srcset', () => {
        (getSrcset as jest.Mock).mockReturnValue('srcset1');

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
        });

        expect(attributes.srcset).toEqual('srcset1');
        expect(getSrcset).toHaveBeenCalledWith([
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
        ]);
        expect(attributes.srcsetwebp).toBeUndefined();
    });

    it('returns webp srcset', () => {
        (getSrcset as jest.Mock).mockReturnValueOnce('srcset1').mockReturnValueOnce('srcset2');

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
        });

        expect(attributes.srcset).toEqual('srcset1');
        expect(getSrcset).toHaveBeenCalledWith([
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
        ]);
        expect(attributes.srcsetwebp).toEqual('srcset2');
        expect(getSrcset).toHaveBeenCalledWith([
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
        ]);
    });

    it('returns placeholder', () => {
        (getSrcset as jest.Mock).mockReturnValue('srcset1');

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
            placeholder: 'placeholder1'
        });

        expect(attributes.placeholder).toEqual('placeholder1');
    });

});