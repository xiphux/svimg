import ImageProcessingQueue from '../../src/image-processing/image-processing-queue';
import md5file from 'md5-file';
import processImage from '../../src/image-processing/process-image';

jest.mock('md5-file', () => ({
    default: jest.fn(),
}));
jest.mock('../../src/image-processing/process-image');

describe('ImageProcessingQueue', () => {

    let queue: ImageProcessingQueue;
    beforeEach(() => {
        (processImage as jest.Mock).mockReset();
        (md5file as any as jest.Mock).mockReset();
        queue = new ImageProcessingQueue();
    });

    it('will process an image', async () => {
        (processImage as jest.Mock).mockImplementation(() => Promise.resolve([{ path: 'image.jpg' }]));
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(1);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
    });

    it('will use the cache for the same image', async () => {
        const p = new Promise((resolve) => {
            resolve([{ path: 'image.jpg' }]);
        });
        (processImage as jest.Mock).mockImplementationOnce(() => p);
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(1);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
    });

    it('will reprocess if the input file is different', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file2.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image2.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(2);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file2.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
    });

    it('will reprocess if the output dir is different', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir2',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image2.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(2);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir2',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
    });

    it('will reprocess if the widths are different', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image3.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [200, 300],
                quality: 75,
            }
        })).toEqual([{ path: 'image2.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                quality: 75,
            }
        })).toEqual([{ path: 'image3.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(3);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [200, 300],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                quality: 75,
            }
        );
    });

    it('will reprocess if the quality is different', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 85,
            }
        })).toEqual([{ path: 'image2.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
            }
        })).toEqual([{ path: 'image.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(2);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 85,
            }
        );
    });

    it('will reprocess if the file contents change', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementationOnce(
            () => Promise.resolve('filehash1')
        ).mockImplementationOnce(
            () => Promise.resolve('filehash2')
        )

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                quality: 75,
            }
        })).toEqual([{ path: 'image2.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(2);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                quality: 75,
            }
        );
    });

    it('will reprocess if skipping generation', async () => {
        (processImage as jest.Mock).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image.jpg' }])
        ).mockImplementationOnce(
            () => Promise.resolve([{ path: 'image2.jpg' }])
        );
        (md5file as any as jest.Mock).mockImplementation(() => Promise.resolve('filehash1'))

        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                skipGeneration: false,
            }
        })).toEqual([{ path: 'image.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
                skipGeneration: true,
            }
        })).toEqual([{ path: 'image2.jpg' }]);
        expect(await queue.process({
            inputFile: '/input/file.jpg',
            outputDir: '/output/dir',
            options: {
                widths: [100, 200],
            }
        })).toEqual([{ path: 'image.jpg' }]);

        expect(processImage).toHaveBeenCalledTimes(2);
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                skipGeneration: false,
            }
        );
        expect(processImage).toHaveBeenCalledWith(
            '/input/file.jpg',
            '/output/dir',
            {
                widths: [100, 200],
                skipGeneration: true,
            }
        );
    });

});