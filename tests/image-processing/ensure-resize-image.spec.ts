import ensureResizeImage from '../../src/image-processing/ensure-resize-image';
import { existsSync } from 'fs';
import getImageMetadata from '../../src/core/get-image-metadata';
import resizeImage from '../../src/core/resize-image';

jest.mock('fs');
jest.mock('../../src/core/get-image-metadata');
jest.mock('../../src/core/resize-image');

describe('ensureResizeImage', () => {

    beforeEach(() => {
        (existsSync as jest.Mock).mockReset();
        (getImageMetadata as jest.Mock).mockReset();
        (resizeImage as jest.Mock).mockReset();
    });

    it('requires input file', async () => {
        await expect(ensureResizeImage('', '/out/file.jpg', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(resizeImage).not.toHaveBeenCalled();
    });

    it('requires output file', async () => {
        await expect(ensureResizeImage('/in/file.jpg', '', { width: 300, quality: 75 })).rejects.toThrow();

        expect(existsSync).not.toHaveBeenCalled();
        expect(resizeImage).not.toHaveBeenCalled();
    });

    it('returns metadata if the file exists', async () => {
        (getImageMetadata as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
        }));

        (existsSync as jest.Mock).mockReturnValue(true);

        expect(await ensureResizeImage(
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
        expect(resizeImage).not.toHaveBeenCalled();
    });

    it('converts to specified width and quality if file doesn\'t exist', async () => {
        (resizeImage as jest.Mock).mockImplementation(() => Promise.resolve({
            width: 300,
            height: 200,
        }));

        (existsSync as jest.Mock).mockReturnValue(false);

        expect(await ensureResizeImage(
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
        expect(resizeImage).toHaveBeenCalledWith('/in/file.jpg', { width: 300, quality: 75 }, '/out/file.jpg');
        expect(getImageMetadata).not.toHaveBeenCalled();
    });

});