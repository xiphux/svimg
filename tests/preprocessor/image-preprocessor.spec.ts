import imagePreprocessor from '../../src/preprocessor/image-preprocessor';
import getImageNodes from '../../src/preprocessor/get-image-nodes';
import processImageNode from '../../src/preprocessor/process-image-node';
import Queue from '../../src/core/queue';

jest.mock('../../src/preprocessor/get-image-nodes');
jest.mock('../../src/preprocessor/process-image-node');
jest.mock('../../src/core/queue');

describe('imagePreprocessor', () => {

    beforeEach(() => {
        (getImageNodes as jest.Mock).mockReset();
        (processImageNode as jest.Mock).mockReset();
    });

    it('returns content if there aren\'t any image nodes', async () => {
        (getImageNodes as jest.Mock).mockReturnValue([]);

        const processor = imagePreprocessor({
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        });

        expect(await processor.markup!({
            content: '<content>',
            filename: 'file',
        })).toEqual({
            code: '<content>',
        });

        expect(getImageNodes).toHaveBeenCalledWith('<content>');
        expect(processImageNode).not.toHaveBeenCalled();
    });

    it('processes image nodes', async () => {
        (getImageNodes as jest.Mock).mockReturnValue([
            { node: '1' },
            { node: '2' }
        ]);
        (processImageNode as jest.Mock).mockImplementationOnce(
            () => Promise.resolve({ content: '<content2>', offset: 5 })
        ).mockImplementationOnce(
            () => Promise.resolve({ content: '<content3>', offset: 15 })
        );

        const processor = imagePreprocessor({
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        });

        expect(await processor.markup!({
            content: '<content>',
            filename: 'file',
        })).toEqual({
            code: '<content3>',
        });

        expect(processImageNode).toHaveBeenCalledTimes(2);
        expect(processImageNode).toHaveBeenNthCalledWith(
            1,
            '<content>',
            0,
            { node: '1' },
            expect.any(Queue),
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            }
        );
        expect(processImageNode).toHaveBeenNthCalledWith(
            2,
            '<content2>',
            5,
            { node: '2' },
            expect.any(Queue),
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            }
        );
    });

});
