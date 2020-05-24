import PlaceholderQueue from '../../src/placeholder/placeholder-queue';
import createPlaceholder from '../../src/placeholder/create-placeholder';

jest.mock('../../src/placeholder/create-placeholder');

describe('PlaceholderQueue', () => {

    let queue: PlaceholderQueue;
    beforeEach(() => {
        (createPlaceholder as jest.Mock).mockReset();
        queue = new PlaceholderQueue();
    });

    it('will create a placeholder', async () => {
        (createPlaceholder as jest.Mock).mockImplementation(() => Promise.resolve('<svg />'));

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

});
