import processImageNode from '../../src/preprocessor/process-image-node';
import getNodeAttributes from '../../src/preprocessor/get-node-attributes';
import generateComponentAttributes from '../../src/component/generate-component-attributes';

jest.mock('../../src/preprocessor/get-node-attributes');
jest.mock('../../src/component/generate-component-attributes');

describe('processImageNode', () => {

    beforeEach(() => {
        (generateComponentAttributes as jest.Mock).mockReset();
    });

    it('returns unmodified without a src', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({});
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image /></div>',
            offset: 0,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).not.toHaveBeenCalled();
    });

    it('processes node', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
        });
    });

    it('processes node with offset', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            5,
            { start: 0 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 57,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
        });
    });

    it('processes node with webp', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            srcsetwebp: 'g/img/test1.webp 300w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        });
    });

    it('processes node with a forced pixel width', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            width: '150',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 150w',
            srcsetwebp: 'g/img/test1.webp 150w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 150w" srcsetwebp="g/img/test1.webp 150w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            widths: [150],
        });
    });

    it('ignores a non pixel width', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            width: '100%',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            srcsetwebp: 'g/img/test1.webp 300w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        });
    });

    it('ignores a dynamic width', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            width: '{width}',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            srcsetwebp: 'g/img/test1.webp 300w',
            placeholder: '<svg />',
        }));
        const processingQueue = { process: jest.fn() };
        const placeholderQueue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: processingQueue as any,
                placeholder: placeholderQueue as any,
            },
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            processingQueue,
            placeholderQueue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        });
    });

});