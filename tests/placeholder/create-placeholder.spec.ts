import createPlaceholder from '../../src/placeholder/create-placeholder';
import getImageMetadata from '../../src/core/get-image-metadata';
import resizeImage from '../../src/core/resize-image';
import getMimeType from '../../src/core/get-mime-type';

jest.mock('../../src/core/get-image-metadata');
jest.mock('../../src/core/resize-image');
jest.mock('../../src/core/get-mime-type');

describe('createPlaceholder', () => {

    beforeEach(() => {
        (getImageMetadata as jest.Mock).mockReset();
        (resizeImage as jest.Mock).mockReset();
        (getMimeType as jest.Mock).mockReset();
    });

    it('requires input file', async () => {
        await expect(createPlaceholder('', { enqueue: jest.fn() } as any)).rejects.toThrow();
    });

    it('creates a placeholder', async () => {
        const enqueue = jest.fn().mockImplementationOnce(() => Promise.resolve({
            width: 300,
            height: 200,
            format: 'jpeg'
        })).mockImplementationOnce(() => Promise.resolve({
            toString: jest.fn(() => 'base64data')
        }));
        (getMimeType as jest.Mock).mockReturnValue('image/jpeg');

        expect(await createPlaceholder('/in/file.jpg', { enqueue } as any)).toEqual('data:image/jpeg;base64,base64data');

        expect(enqueue).toHaveBeenCalledTimes(2);
        expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');
        expect(enqueue).toHaveBeenCalledWith(resizeImage, '/in/file.jpg', { width: 64 });
        expect(getMimeType).toHaveBeenCalledWith('jpeg');
    });

});
