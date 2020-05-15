import resizeImage from '../../src/image-processing/resize-image';
import { existsSync } from 'fs';
import getImageMetadata from '../../src/core/get-image-metadata';
import resizeImageCore from '../../src/core/resize-image';

jest.mock('fs');
jest.mock('../../src/core/get-image-metadata');
jest.mock('../../src/core/resize-image');

describe('resizeImage', () => {

    beforeEach(() => {
        (existsSync as jest.Mock).mockReset();
        (getImageMetadata as jest.Mock).mockReset();
        (resizeImageCore as jest.Mock).mockReset();
    });

    it('requires input file', async () => {
        await expect(resizeImage('', '/out/file.jpg', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(resizeImageCore).not.toHaveBeenCalled();
    });

    it('requires output file', async () => {
        await expect(resizeImage('/in/file.jpg', '', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(resizeImageCore).not.toHaveBeenCalled();
    });

    it('returns metadata if the file exists', async () => {
        (getImageMetadata as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
        }));

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
        expect(getImageMetadata).toHaveBeenCalledWith('/out/file.jpg');
        expect(resizeImageCore).not.toHaveBeenCalled();
    });

    it('converts to specified width and quality if file doesn\'t exist', async () => {
        (resizeImageCore as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
        }));

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
        expect(resizeImageCore).toHaveBeenCalledWith('/in/file.jpg', { width: 300, quality: 75 }, '/out/file.jpg');
        expect(getImageMetadata).not.toHaveBeenCalled();
    });

});