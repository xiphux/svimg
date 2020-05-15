import resizeImage from '../../src/image-processing/resize-image';
import { existsSync } from 'fs';
import sharp from 'sharp';

jest.mock('fs');
jest.mock('sharp', () => ({
    default: jest.fn(),
}));

describe('resizeImage', () => {

    let metadata: jest.Mock;
    let jpeg: jest.Mock;
    let png: jest.Mock;
    let webp: jest.Mock;
    let resize: jest.Mock;
    let toFile: jest.Mock;
    beforeEach(() => {
        (existsSync as jest.Mock).mockReset();
        (sharp as any as jest.Mock).mockReset();
        metadata = jest.fn();
        jpeg = jest.fn(() => ({
            jpeg,
            png,
            webp,
            resize,
            toFile,
        }));
        png = jest.fn(() => ({
            jpeg,
            png,
            webp,
            resize,
            toFile,
        }));
        webp = jest.fn(() => ({
            jpeg,
            png,
            webp,
            resize,
            toFile,
        }));
        resize = jest.fn(() => ({
            jpeg,
            png,
            webp,
            resize,
            toFile,
        }));
        toFile = jest.fn();
        (sharp as any as jest.Mock).mockReturnValue({
            metadata,
            jpeg,
            png,
            webp,
            resize,
            toFile,
        });
    });

    it('requires input file', async () => {
        await expect(resizeImage('', '/out/file.jpg', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(sharp).not.toHaveBeenCalled();
    });

    it('requires output file', async () => {
        await expect(resizeImage('/in/file.jpg', '', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(sharp).not.toHaveBeenCalled();
    });

    it('returns metadata if the file exists', async () => {
        metadata.mockReturnValue({
            width: 300,
            height: 200,
        });

        (existsSync as jest.Mock).mockReturnValue(true);

        expect(await resizeImage(
            '/in/file.jpg',
            '/out/file.jpg',
            {
                width: 300,
                quality: 75,
            }
        )).toEqual({
            path: '/out/file.jpg',
            width: 300,
            height: 200,
        });

        expect(existsSync).toHaveBeenCalledWith('/out/file.jpg');
        expect(sharp).toHaveBeenCalledWith('/out/file.jpg');
        expect(toFile).not.toHaveBeenCalled();
        expect(metadata).toHaveBeenCalled();
    });

    it('converts to specified width and quality if file doesn\'t exist', async () => {
        toFile.mockReturnValue({
            width: 300,
            height: 200,
        });

        (existsSync as jest.Mock).mockReturnValue(false);

        expect(await resizeImage(
            '/in/file.jpg',
            '/out/file.jpg',
            {
                width: 300,
                quality: 75,
            }
        )).toEqual({
            path: '/out/file.jpg',
            width: 300,
            height: 200,
        });

        expect(existsSync).toHaveBeenCalledWith('/out/file.jpg');
        expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
        expect(jpeg).toHaveBeenCalledWith({
            quality: 75,
            force: false,
        });
        expect(png).toHaveBeenCalledWith({
            quality: 75,
            force: false,
        });
        expect(webp).toHaveBeenCalledWith({
            quality: 75,
            force: false,
        });
        expect(toFile).toHaveBeenCalledWith('/out/file.jpg');
        expect(metadata).not.toHaveBeenCalled();
    });

});