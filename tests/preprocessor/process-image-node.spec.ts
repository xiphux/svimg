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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            5,
            { start: 0 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 57,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: false,
        });
    });

    it('processes node with avif', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            srcsetavif: 'g/img/test1.avif 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetavif="g/img/test1.avif 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: true,
        });
    });

    it('processes node with webp and avif', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            srcsetwebp: 'g/img/test1.webp 300w',
            srcsetavif: 'g/img/test1.avif 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
                avif: true,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" srcsetavif="g/img/test1.avif 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 122,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: true,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 150w" srcsetwebp="g/img/test1.webp 150w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: false,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: false,
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
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: true,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" srcsetwebp="g/img/test1.webp 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 87,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: false,
        });
    });

    it('processes node with a specified quality', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            quality: '50',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
            quality: 50,
        });
    });

    it('ignores a negative quality', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            quality: '-50',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
        });
    });

    it('ignores a non number quality', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            quality: '100%',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
        });
    });

    it('ignores a dynamic quality', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            quality: '{quality}',
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
            placeholder: '<svg />',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" placeholder="<svg />" src="img/test.jpg" /></div>',
            offset: 52,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
        });
    });

    it('skips placeholder if immediate', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
            immediate: true,
        });
        (generateComponentAttributes as jest.Mock).mockImplementation(() => Promise.resolve({
            srcset: 'g/img/test1.jpg 300w',
        }));
        const queue = { process: jest.fn() };

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            queue as any,
            {
                inputDir: 'static',
                outputDir: 'static/g',
                webp: false,
                avif: false,
            },
        )).toEqual({
            content: '<div><Image srcset="g/img/test1.jpg 300w" src="img/test.jpg" /></div>',
            offset: 30,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(generateComponentAttributes).toHaveBeenCalledWith({
            src: 'img/test.jpg',
            queue,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
            skipPlaceholder: true,
        });
    });

});