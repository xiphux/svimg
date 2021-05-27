import generateComponentAttributes from '../../src/component/generate-component-attributes';
import { join } from 'path';
import Queue from '../../src/core/queue';
import createPlaceholder from '../../src/placeholder/create-placeholder';
import processImage from '../../src/image-processing/process-image';

jest.mock('../../src/core/queue');
jest.mock('../../src/placeholder/create-placeholder');
jest.mock('../../src/image-processing/process-image');

describe('generateComponentAttributes', () => {

    beforeEach(() => {
        (createPlaceholder as jest.Mock).mockReset();
        (processImage as jest.Mock).mockReset();
        (Queue as jest.Mock).mockReset();
    });

    it('won\'t process without src', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        await expect(generateComponentAttributes({
            src: '',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
        })).rejects.toThrow();

        expect(createPlaceholder).not.toHaveBeenCalled();
        expect(processImage).not.toHaveBeenCalled();
        expect(Queue).not.toHaveBeenCalled();
    });

    it('won\'t process without input dir', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        await expect(generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: '',
            outputDir: 'static/g',
        })).rejects.toThrow();

        expect(createPlaceholder).not.toHaveBeenCalled();
        expect(processImage).not.toHaveBeenCalled();
        expect(Queue).not.toHaveBeenCalled();
    });

    it('won\'t process without output dir', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        await expect(generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: '',
        })).rejects.toThrow();

        expect(createPlaceholder).not.toHaveBeenCalled();
        expect(processImage).not.toHaveBeenCalled();
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process src', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
    });

    it('will process src with webp = true and avif = true', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: true,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process src with webp = false and avif = true', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: true,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: false,
                avif: true,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process src with webp = true and avif = false', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: false,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: false,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process src with webp = false and avif = false', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [],
            avifImages: [],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
            avif: false,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: false,
                avif: false,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process src with widths', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 150,
                    height: 150,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 150,
                    height: 150,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 150,
                    height: 150,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            widths: [150],
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 150w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 150w',
            srcsetavif: 'g/assets/images/avatar.1.avif 150w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
                widths: [150],
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will process images with custom quality', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 150,
                    height: 150,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 150,
                    height: 150,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 150,
                    height: 150,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            quality: 50,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 150w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 150w',
            srcsetavif: 'g/assets/images/avatar.1.avif 150w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
                quality: 50,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will create queues if not provided', async () => {
        (Queue as jest.Mock).mockReturnValue({
            enqueue: true
        });
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            inputDir: 'static',
            outputDir: 'static/g',
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            { enqueue: true } as any,
            {
                webp: true,
                avif: true,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            { enqueue: true }
        );
        expect(Queue).toHaveBeenCalled();
    });

    it('will skip image generation', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            skipGeneration: true,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            placeholder: '<svg />',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
                skipGeneration: true,
            },
        );
        expect(createPlaceholder).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            queue
        );
        expect(Queue).not.toHaveBeenCalled();
    });

    it('will skip placeholder', async () => {
        const queue = jest.fn(() => ({ enqueue: jest.fn() }));
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve({
            images: [
                {
                    path: 'static/g/assets/images/avatar.1.jpg',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.jpg',
                    width: 500,
                    height: 500,
                },
            ],
            webpImages: [
                {
                    path: 'static/g/assets/images/avatar.1.webp',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.webp',
                    width: 500,
                    height: 500,
                },
            ],
            avifImages: [
                {
                    path: 'static/g/assets/images/avatar.1.avif',
                    width: 300,
                    height: 300,
                },
                {
                    path: 'static/g/assets/images/avatar.2.avif',
                    width: 500,
                    height: 500,
                },
            ],
            aspectRatio: 0.5,
        }));
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            queue: queue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            skipPlaceholder: true,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            srcsetavif: 'g/assets/images/avatar.1.avif 300w, g/assets/images/avatar.2.avif 500w',
            aspectratio: 0.5,
        });

        expect(processImage).toHaveBeenCalledWith(
            join('static', 'assets', 'images', 'avatar.jpg'),
            join('static', 'g', 'assets', 'images'),
            queue as any,
            {
                webp: true,
                avif: true,
            },
        );
        expect(createPlaceholder).not.toHaveBeenCalled();
        expect(Queue).not.toHaveBeenCalled();
    });

});
