import processImageNode from '../../src/preprocessor/process-image-node';
import getNodeAttributes from '../../src/preprocessor/get-node-attributes';
import getComponentAttributes from '../../src/component/get-component-attributes';
import { join } from 'path';

jest.mock('../../src/preprocessor/get-node-attributes');
jest.mock('../../src/component/get-component-attributes');

describe('processImageNode', () => {

    it('returns unmodified without a src', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({});
        const process = jest.fn();
        const placeholder = jest.fn();

        expect(await processImageNode(
            '<div><Image /></div>',
            0,
            { start: 5 } as any,
            {
                processing: { process } as any,
                placeholder: { process: placeholder } as any,
            },
            {
                publicDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image /></div>',
            offset: 0,
        });

        expect(process).not.toHaveBeenCalled();
        expect(placeholder).not.toHaveBeenCalled();
    });

    it('processes node', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (getComponentAttributes as jest.Mock).mockReturnValue({
            srcset: 'test',
            placeholder: 'test2',
        });
        const process = jest.fn(() => Promise.resolve({
            images: [
                {
                    path: join('static', 'g', 'img', 'test1.jpg'),
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [],
        }));
        const placeholder = jest.fn(() => Promise.resolve('<svg />'));

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: { process } as any,
                placeholder: { process: placeholder } as any,
            },
            {
                publicDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image srcset="test" placeholder="test2" src="img/test.jpg" /></div>',
            offset: 34,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
            outputDir: join('static', 'g', 'img'),
            options: {
                webp: false,
            },
        });
        expect(placeholder).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
        });
        expect(getComponentAttributes).toHaveBeenCalledWith({
            images: [
                {
                    path: 'g/img/test1.jpg',
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [],
            placeholder: '<svg />',
        });
    });

    it('processes node with offset', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (getComponentAttributes as jest.Mock).mockReturnValue({
            srcset: 'test',
            placeholder: 'test2',
        });
        const process = jest.fn(() => Promise.resolve({
            images: [
                {
                    path: join('static', 'g', 'img', 'test1.jpg'),
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [],
        }));
        const placeholder = jest.fn(() => Promise.resolve('<svg />'));

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            5,
            { start: 0 } as any,
            {
                processing: { process } as any,
                placeholder: { process: placeholder } as any,
            },
            {
                publicDir: 'static',
                outputDir: 'static/g',
                webp: false,
            },
        )).toEqual({
            content: '<div><Image srcset="test" placeholder="test2" src="img/test.jpg" /></div>',
            offset: 39,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
            outputDir: join('static', 'g', 'img'),
            options: {
                webp: false,
            },
        });
        expect(placeholder).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
        });
        expect(getComponentAttributes).toHaveBeenCalledWith({
            images: [
                {
                    path: 'g/img/test1.jpg',
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [],
            placeholder: '<svg />',
        });
    });

    it('processes node with webp', async () => {
        (getNodeAttributes as jest.Mock).mockReturnValue({
            src: 'img/test.jpg',
        });
        (getComponentAttributes as jest.Mock).mockReturnValue({
            srcset: 'test',
            placeholder: 'test2',
            srcsetWebp: 'test3',
        });
        const process = jest.fn(() => Promise.resolve({
            images: [
                {
                    path: join('static', 'g', 'img', 'test1.jpg'),
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [
                {
                    path: join('static', 'g', 'img', 'test1.webp'),
                    width: 300,
                    height: 300,
                },
            ],
        }));
        const placeholder = jest.fn(() => Promise.resolve('<svg />'));

        expect(await processImageNode(
            '<div><Image src="img/test.jpg" /></div>',
            0,
            { start: 5 } as any,
            {
                processing: { process } as any,
                placeholder: { process: placeholder } as any,
            },
            {
                publicDir: 'static',
                outputDir: 'static/g',
                webp: true,
            },
        )).toEqual({
            content: '<div><Image srcset="test" placeholder="test2" srcsetWebp="test3" src="img/test.jpg" /></div>',
            offset: 53,
        });

        expect(getNodeAttributes).toHaveBeenCalledWith({ start: 5 });
        expect(process).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
            outputDir: join('static', 'g', 'img'),
            options: {
                webp: true,
            },
        });
        expect(placeholder).toHaveBeenCalledWith({
            inputFile: join('static', 'img', 'test.jpg'),
        });
        expect(getComponentAttributes).toHaveBeenCalledWith({
            images: [
                {
                    path: 'g/img/test1.jpg',
                    width: 300,
                    height: 300,
                },
            ],
            webpImages: [
                {
                    path: 'g/img/test1.webp',
                    width: 300,
                    height: 300,
                }
            ],
            placeholder: '<svg />',
        });
    });

});