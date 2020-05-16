import PlaceholderQueue from '../../src/placeholder/placeholder-queue';
import md5file from 'md5-file';
import createPlaceholder from '../../src/placeholder/create-placeholder';

jest.mock('md5-file', () => ({
    default: jest.fn(),
}));
jest.mock('../../src/placeholder/create-placeholder');

describe('PlaceholderQueue', () => {

    let queue: PlaceholderQueue;
    beforeEach(() => {
        (createPlaceholder as jest.Mock).mockReset();
        (md5file as any as jest.Mock).mockReset();
        queue = new PlaceholderQueue();
    });

    it('will create a placeholder', async () => {
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'));

        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            },
        })).toEqual('<svg />');

        expect(createPlaceholder).toHaveBeenCalledTimes(1);
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
    });

    it('will use the cache for the same image', async () => {
        (createPlaceholder as jest.Mock).mockImplementationOnce(() => Promise.resolve('<svg />'));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'));

        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg />');
        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg />');

        expect(createPlaceholder).toHaveBeenCalledTimes(1);
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
    });

    it('will reprocess if the input file is different', async () => {
        (createPlaceholder as jest.Mock).mockImplementationOnce(() => Promise.resolve('<svg />')).mockImplementationOnce(() => Promise.resolve('<svg2 />'));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'));

        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg />');
        expect(await queue.process({
            inputFile: '/in/file2.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg2 />');

        expect(createPlaceholder).toHaveBeenCalledTimes(2);
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file2.jpg', { blur: 30 });
    });

    it('will reprocess if the blur is different', async () => {
        (createPlaceholder as jest.Mock).mockImplementationOnce(
            () => Promise.resolve('<svg />')
        ).mockImplementationOnce(
            () => Promise.resolve('<svg2 />')
        ).mockImplementationOnce(
            () => Promise.resolve('<svg3 />')
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'));

        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg />');
        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 50,
            }
        })).toEqual('<svg2 />');
        expect(await queue.process({
            inputFile: '/in/file.jpg',
        })).toEqual('<svg3 />');

        expect(createPlaceholder).toHaveBeenCalledTimes(3);
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 50 });
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', undefined);
    });

    it('will reprocess if the file contents change', async () => {
        (createPlaceholder as jest.Mock).mockImplementationOnce(() => Promise.resolve('<svg />')).mockImplementationOnce(() => Promise.resolve('<svg2 />'));
        (md5file as any as jest.Mock).mockImplementationOnce(() => Promise.resolve('filehash1')).mockImplementationOnce(() => Promise.resolve('filehash2'));

        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg />');
        expect(await queue.process({
            inputFile: '/in/file.jpg',
            options: {
                blur: 30,
            }
        })).toEqual('<svg2 />');

        expect(createPlaceholder).toHaveBeenCalledTimes(2);
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
        expect(createPlaceholder).toHaveBeenCalledWith('/in/file.jpg', { blur: 30 });
    });

});
