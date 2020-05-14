import processImage from '../../src/image-processing/process-image';
import { existsSync, mkdir } from 'fs';
import sharp from 'sharp';
import md5file from 'md5-file';
import getProcessImageOptions from '../../src/image-processing/get-process-image-options';
import resizeImageMultiple from '../../src/image-processing/resize-image-multiple';
import getImageOptionsHash from '../../src/image-processing/get-image-options-hash';

jest.mock('fs');
jest.mock('sharp', () => ({
    default: jest.fn(),
}));
jest.mock('md5-file', () => ({
    default: jest.fn(),
}));
jest.mock('../../src/image-processing/get-process-image-options');
jest.mock('../../src/image-processing/resize-image-multiple');
jest.mock('../../src/image-processing/get-image-options-hash');

describe('processImage', () => {

    let metadata: jest.Mock;
    beforeEach(() => {
        (existsSync as jest.Mock).mockReset();
        (mkdir as any as jest.Mock).mockReset().mockImplementation((dir, opts, callback) => callback());
        (sharp as any as jest.Mock).mockReset();
        metadata = jest.fn();
        (sharp as any as jest.Mock).mockImplementation(() => ({
            metadata,
        }));
        (md5file as any as jest.Mock).mockReset();
        (getProcessImageOptions as jest.Mock).mockReset();
        (resizeImageMultiple as jest.Mock).mockReset();
    });

    it('requires an input file', async () => {
        await expect(processImage('/in/file.jpg', '', {})).rejects.toThrow();

        expect(mkdir).not.toHaveBeenCalled();
        expect(resizeImageMultiple).not.toHaveBeenCalled();
    });

    it('requires an output dir', async () => {
        await expect(processImage('', '/out/dir', {})).rejects.toThrow();

        expect(mkdir).not.toHaveBeenCalled();
        expect(resizeImageMultiple).not.toHaveBeenCalled();
    });

    it('creates the dir if it doesn\'t exist', async () => {
        (existsSync as jest.Mock).mockReturnValue(false);
        metadata.mockImplementation(() => Promise.resolve({
            width: 300,
        }));
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });

        await processImage('/in/file.jpg', '/out/dir', {});

        expect(existsSync).toHaveBeenCalledWith('/out/dir');
        expect(mkdir).toHaveBeenCalledWith('/out/dir', { recursive: true }, expect.anything());
    });

    it('won\'t create the dir if it exists', async () => {
        (existsSync as jest.Mock).mockReturnValue(true);
        metadata.mockImplementation(() => Promise.resolve({
            width: 300,
        }));
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });

        await processImage('/in/file.jpg', '/out/dir', {});

        expect(existsSync).toHaveBeenCalledWith('/out/dir');
        expect(mkdir).not.toHaveBeenCalled();
    });

    it('resizes images with hashed filename generator', async () => {
        (existsSync as jest.Mock).mockReturnValue(true);
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });
        metadata.mockImplementation(() => Promise.resolve({
            width: 300,
        }));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash'));
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
        (getImageOptionsHash as jest.Mock).mockReturnValue('optionshash');

        expect(await processImage('/in/file.jpg', '/out/dir', { widths: [100, 200], quality: 85, webp: false })).toEqual({
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
        });

        expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
        expect(metadata).toHaveBeenCalled();

        expect(getProcessImageOptions).toHaveBeenCalledWith(300, { widths: [100, 200], quality: 85 })

        expect(md5file).toHaveBeenCalledWith('/in/file.jpg');
        expect(resizeImageMultiple).toHaveBeenCalledTimes(1);
        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
        });
        const filenameGenerator = (resizeImageMultiple as jest.Mock).mock.calls[0][2].filenameGenerator;
        expect(filenameGenerator({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.jpg');
    });

    it('generates webp images if requested', async () => {
        (existsSync as jest.Mock).mockReturnValue(true);
        (getProcessImageOptions as jest.Mock).mockReturnValue({
            widths: [200, 300],
            quality: 85,
        });
        metadata.mockImplementation(() => Promise.resolve({
            width: 300,
        }));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash'));
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
        (getImageOptionsHash as jest.Mock).mockReturnValue('optionshash');

        expect(await processImage('/in/file.jpg', '/out/dir', { widths: [100, 200], quality: 85, webp: true })).toEqual({
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
        });

        expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
        expect(metadata).toHaveBeenCalled();

        expect(getProcessImageOptions).toHaveBeenCalledWith(300, { widths: [100, 200], quality: 85 })

        expect(md5file).toHaveBeenCalledWith('/in/file.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledTimes(2);
        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
        });
        const filenameGenerator = (resizeImageMultiple as jest.Mock).mock.calls[0][2].filenameGenerator;
        expect(filenameGenerator({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.jpg');

        expect(resizeImageMultiple).toHaveBeenCalledWith('/in/file.jpg', '/out/dir', {
            widths: [200, 300],
            quality: 85,
            filenameGenerator: expect.any(Function),
        });
        const filenameGeneratorWebp = (resizeImageMultiple as jest.Mock).mock.calls[1][2].filenameGenerator;
        expect(filenameGeneratorWebp({ width: 300, quality: 85 })).toEqual('file.optionshash.filehash.webp');
    });

});
