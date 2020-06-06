import processImage from '../../src/image-processing/process-image';
import md5file from 'md5-file';
import getProcessImageOptions from '../../src/image-processing/get-process-image-options';
import resizeImageMultiple from '../../src/image-processing/resize-image-multiple';
import getOptionsHash from '../../src/image-processing/get-options-hash';
import getImageMetadata from '../../src/core/get-image-metadata';
import exists from '../../src/core/exists';
import fs from 'fs';

jest.mock('fs', () => ({
    default: {
        promises: {
            mkdir: jest.fn(),
        }
    }
}));
jest.mock('../../src/image-processing/get-process-image-options');
jest.mock('../../src/image-processing/resize-image-multiple');
jest.mock('../../src/image-processing/get-options-hash');

describe('processImage', () => {

    beforeEach(() => {
        (getProcessImageOptions as jest.Mock).mockReset();
        (resizeImageMultiple as jest.Mock).mockReset();
    });

    it('requires an input file', async () => {
        const enqueue = jest.fn();
        await expect(processImage('/in/file.jpg', '', { enqueue } as any)).rejects.toThrow();

        expect(enqueue).not.toHaveBeenCalled();
        expect(resizeImageMultiple).not.toHaveBeenCalled();
    });

    it('requires an output dir', async () => {
        const enqueue = jest.fn();
        await expect(processImage('', '/out/dir', { enqueue } as any)).rejects.toThrow();

        expect(enqueue).not.toHaveBeenCalled();
        expect(resizeImageMultiple).not.toHaveBeenCalled();
    });

    it('creates the dir if it doesn\'t exist', async () => {
        const enqueue = jest.fn().mockImplementationOnce(
            () => Promise.resolve(false)
        ).mockImplementationOnce(() => Promise.resolve({
            width: 300,
        }));
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });

        await processImage('/in/file.jpg', '/out/dir', { enqueue } as any);

        expect(enqueue).toHaveBeenCalledWith(exists, '/out/dir');
        expect(enqueue).toHaveBeenCalledWith(fs.promises.mkdir, '/out/dir', { recursive: true });
    });

    it('won\'t create the dir if it exists', async () => {
        const enqueue = jest.fn().mockImplementationOnce(
            () => Promise.resolve(true)
        ).mockImplementationOnce(() => Promise.resolve({
            width: 300,
        }));
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });

        await processImage('/in/file.jpg', '/out/dir', { enqueue } as any);

        expect(enqueue).toHaveBeenCalledWith(exists, '/out/dir');
        expect(enqueue).not.toHaveBeenCalledWith(fs.promises.mkdir, '/out/dir', { recursive: true });
    });

    it('won\'t create the dir if skipping generation', async () => {
        const enqueue = jest.fn().mockImplementationOnce(() => Promise.resolve({
            width: 300,
        }));
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });

        await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, {
            skipGeneration: true,
        });

        expect(enqueue).not.toHaveBeenCalledWith(exists, '/out/dir');
        expect(enqueue).not.toHaveBeenCalledWith(fs.promises.mkdir, '/out/dir', { recursive: true });
    });

    it('resizes images with hashed filename generator', async () => {
        const enqueue = jest.fn().mockImplementationOnce(
            () => Promise.resolve(true)
        ).mockImplementationOnce(() => Promise.resolve({
            width: 300,
            height: 300,
        })).mockImplementationOnce(
            () => Promise.resolve('filehash'),
        );
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
            webp: false,
        });
        (resizeImageMultiple as jest.Mock).mockImplementation(() => Promise.resolve([
            {
                path: '/out/dir/file.1.jpg',
                width: 200,
                height: 200,
            },
            {
                path: '/out/dir/file.2.jpg',
                width: 300,
                height: 300,
            }
        ]));
        (getOptionsHash as jest.Mock).mockReturnValue('optionshash');

        expect(await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, { widths: [100, 200], quality: 85, webp: false })).toEqual({
            images: [
                {
                    path: '/out/dir/file.1.jpg',
                    width: 200,
                    height: 200,
                },
                {
                    path: '/out/dir/file.2.jpg',
                    width: 300,
                    height: 300,
                }
            ],
            webpImages: [],
            aspectRatio: 1,
        });

        expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

        expect(getProcessImageOptions).toHaveBeenCalledWith(300, { widths: [100, 200], quality: 85, webp: false })

        expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');
        expect(resizeImageMultiple).toHaveBeenCalledTimes(1);
        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', { enqueue } as any, {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
            aspectRatio: 1,
        });
        const filenameGenerator = (resizeImageMultiple as jest.Mock).mock.calls[0][3].filenameGenerator;
        expect(filenameGenerator({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.jpg');
    });

    it('generates webp images if requested', async () => {
        const enqueue = jest.fn().mockImplementationOnce(
            () => Promise.resolve(true)
        ).mockImplementationOnce(() => Promise.resolve({
            width: 300,
            height: 300,
        })).mockImplementationOnce(
            () => Promise.resolve('filehash'),
        );
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
            webp: true,
        });
        (resizeImageMultiple as jest.Mock).mockImplementationOnce(() => Promise.resolve([
            {
                path: '/out/dir/file.1.jpg',
                width: 200,
                height: 200,
            },
            {
                path: '/out/dir/file.2.jpg',
                width: 300,
                height: 300,
            }
        ])).mockImplementationOnce(() => Promise.resolve([
            {
                path: '/out/dir/file.1.webp',
                width: 200,
                height: 200,
            },
            {
                path: '/out/dir/file.2.webp',
                width: 300,
                height: 300,
            }
        ]));
        (getOptionsHash as jest.Mock).mockReturnValue('optionshash');

        expect(await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, { widths: [100, 200], quality: 85, webp: true })).toEqual({
            images: [
                {
                    path: '/out/dir/file.1.jpg',
                    width: 200,
                    height: 200,
                },
                {
                    path: '/out/dir/file.2.jpg',
                    width: 300,
                    height: 300,
                }
            ],
            webpImages: [
                {
                    path: '/out/dir/file.1.webp',
                    width: 200,
                    height: 200,
                },
                {
                    path: '/out/dir/file.2.webp',
                    width: 300,
                    height: 300,
                }
            ],
            aspectRatio: 1,
        });

        expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

        expect(getProcessImageOptions).toHaveBeenCalledWith(300, { widths: [100, 200], quality: 85, webp: true })

        expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledTimes(2);
        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', { enqueue } as any, {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
            aspectRatio: 1,
        });
        const filenameGenerator = (resizeImageMultiple as jest.Mock).mock.calls[0][3].filenameGenerator;
        expect(filenameGenerator({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', { enqueue } as any, {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
            aspectRatio: 1,
        });
        const filenameGeneratorWebp = (resizeImageMultiple as jest.Mock).mock.calls[1][3].filenameGenerator;
        expect(filenameGeneratorWebp({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.webp');
    });

    it('skips generation', async () => {
        const enqueue = jest.fn().mockImplementationOnce(() => Promise.resolve({
            width: 300,
            height: 100,
        })).mockImplementationOnce(
            () => Promise.resolve('filehash'),
        );
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
            webp: true,
        });
        (resizeImageMultiple as jest.Mock).mockImplementationOnce(() => Promise.resolve([
            {
                path: '/out/dir/file.1.jpg',
                width: 200,
                height: 200,
            },
            {
                path: '/out/dir/file.2.jpg',
                width: 300,
                height: 300,
            }
        ])).mockImplementationOnce(() => Promise.resolve([
            {
                path: '/out/dir/file.1.webp',
                width: 200,
                height: 200,
            },
            {
                path: '/out/dir/file.2.webp',
                width: 300,
                height: 300,
            }
        ]));
        (getOptionsHash as jest.Mock).mockReturnValue('optionshash');

        expect(await processImage('/in/file.jpg', '/out/dir', { enqueue } as any, { widths: [100, 200], quality: 85, webp: true, skipGeneration: true })).toEqual({
            images: [
                {
                    path: '/out/dir/file.1.jpg',
                    width: 200,
                    height: 200,
                },
                {
                    path: '/out/dir/file.2.jpg',
                    width: 300,
                    height: 300,
                }
            ],
            webpImages: [
                {
                    path: '/out/dir/file.1.webp',
                    width: 200,
                    height: 200,
                },
                {
                    path: '/out/dir/file.2.webp',
                    width: 300,
                    height: 300,
                }
            ],
            aspectRatio: 300 / 100,
        });

        expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');

        expect(getProcessImageOptions).toHaveBeenCalledWith(300, { widths: [100, 200], quality: 85, webp: true })

        expect(enqueue).toHaveBeenCalledWith(md5file, '/in/file.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledTimes(2);
        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', { enqueue } as any, {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
            aspectRatio: 300 / 100,
            skipGeneration: true,
        });
        const filenameGenerator = (resizeImageMultiple as jest.Mock).mock.calls[0][3].filenameGenerator;
        expect(filenameGenerator({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', { enqueue } as any, {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
            aspectRatio: 300 / 100,
            skipGeneration: true,
        });
        const filenameGeneratorWebp = (resizeImageMultiple as jest.Mock).mock.calls[1][3].filenameGenerator;
        expect(filenameGeneratorWebp({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.webp');
    });

});
