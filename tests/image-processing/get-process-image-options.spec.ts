import getProcessImageOptions from '../../src/image-processing/get-process-image-options';

describe('getProcessImageOptions', () => {

    it('returns default widths less than or equal to the original width', () => {
        const { widths } = getProcessImageOptions(1920);
        expect(widths).toEqual([480, 1024, 1920]);
    });

    it('returns default widths with original image width if original is larger', () => {
        const { widths } = getProcessImageOptions(4160);
        expect(widths).toEqual([480, 1024, 1920, 2560, 4160]);
    });

    it('returns original width if it\'s smaller than all default widths', () => {
        const { widths } = getProcessImageOptions(150);
        expect(widths).toEqual([150]);
    });

    it('returns passed widths smaller than original width', () => {
        const { widths } = getProcessImageOptions(2100, {
            widths: [500, 1000, 1500, 2000, 2500]
        });
        expect(widths).toEqual([500, 1000, 1500, 2000]);
    });

    it('returns default quality if not passed', () => {
        const { quality } = getProcessImageOptions(500);
        expect(quality).toEqual(75);
    });

    it('returns passed quality', () => {
        const { quality } = getProcessImageOptions(500, {
            quality: 80
        });
        expect(quality).toEqual(80);
    });

});