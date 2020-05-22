import generateComponentAttributes from '../../src/component/generate-component-attributes';
import { join } from 'path';

describe('generateComponentAttributes', () => {

    let process: jest.Mock;
    let placeholderProcess: jest.Mock;
    let processingQueue: {
        process: jest.Mock
    };
    let placeholderQueue: {
        process: jest.Mock,
    };
    beforeEach(() => {
        process = jest.fn();
        placeholderProcess = jest.fn();
        processingQueue = {
            process,
        };
        placeholderQueue = {
            process: placeholderProcess,
        };
    });

    it('won\'t process without src', async () => {
        await expect(generateComponentAttributes({
            src: '',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: 'static/g',
        })).rejects.toThrow();

        expect(process).not.toHaveBeenCalled();
        expect(placeholderProcess).not.toHaveBeenCalled();
    });

    it('won\'t process without input dir', async () => {
        await expect(generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: '',
            outputDir: 'static/g',
        })).rejects.toThrow();

        expect(process).not.toHaveBeenCalled();
        expect(placeholderProcess).not.toHaveBeenCalled();
    });

    it('won\'t process without output dir', async () => {
        await expect(generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: '',
        })).rejects.toThrow();

        expect(process).not.toHaveBeenCalled();
        expect(placeholderProcess).not.toHaveBeenCalled();
    });

    it('will process src', async () => {
        process.mockImplementation(() => Promise.resolve({
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
            ]
        }));
        placeholderProcess.mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: 'static/g',
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            placeholder: '<svg />',
        });

        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
            outputDir: join('static', 'g', 'assets', 'images'),
            options: {
                webp: true,
            },
        });
        expect(placeholderProcess).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
        });
    });

    it('will process src with webp = true', async () => {
        process.mockImplementation(() => Promise.resolve({
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
            ]
        }));
        placeholderProcess.mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 300w, g/assets/images/avatar.2.webp 500w',
            placeholder: '<svg />',
        });

        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
            outputDir: join('static', 'g', 'assets', 'images'),
            options: {
                webp: true,
            },
        });
        expect(placeholderProcess).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
        });
    });

    it('will process src with webp = false', async () => {
        process.mockImplementation(() => Promise.resolve({
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
            webpImages: []
        }));
        placeholderProcess.mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            webp: false,
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 300w, g/assets/images/avatar.2.jpg 500w',
            placeholder: '<svg />',
        });

        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
            outputDir: join('static', 'g', 'assets', 'images'),
            options: {
                webp: false,
            },
        });
        expect(placeholderProcess).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
        });
    });

    it('will process src with widths', async () => {
        process.mockImplementation(() => Promise.resolve({
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
            ]
        }));
        placeholderProcess.mockImplementation(() => Promise.resolve('<svg />'));

        expect(await generateComponentAttributes({
            src: 'assets/images/avatar.jpg',
            processingQueue: processingQueue as any,
            placeholderQueue: placeholderQueue as any,
            inputDir: 'static',
            outputDir: 'static/g',
            widths: [150],
        })).toEqual({
            srcset: 'g/assets/images/avatar.1.jpg 150w',
            srcsetwebp: 'g/assets/images/avatar.1.webp 150w',
            placeholder: '<svg />',
        });

        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
            outputDir: join('static', 'g', 'assets', 'images'),
            options: {
                webp: true,
                widths: [150],
            },
        });
        expect(placeholderProcess).toHaveBeenCalledWith({
            inputFile: join('static', 'assets', 'images', 'avatar.jpg'),
        });
    });

});
