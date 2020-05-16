import getImageNodes from '../../src/preprocessor/get-image-nodes';
import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';

jest.mock('svelte/compiler', () => ({
    parse: jest.fn(),
}));
jest.mock('estree-walker', () => ({
    walk: jest.fn(),
}));

describe('getImageNodes', () => {

    beforeEach(() => {
        (parse as jest.Mock).mockReset();
        (walk as jest.Mock).mockReset();
    });

    it('returns empty without content', () => {
        expect(getImageNodes('')).toEqual([]);
        expect(parse).not.toHaveBeenCalled();
        expect(walk).not.toHaveBeenCalled();
    });

    it('extracts image nodes only', () => {
        (parse as jest.Mock).mockReturnValue({ ast: true });
        (walk as jest.Mock).mockImplementation((ast, { enter }) => {
            enter({
                type: 'Fragment',
            });
            enter({
                type: 'InlineComponent',
                name: 'Image',
                id: '1',
            });
            enter({
                type: 'Element',
                name: 'img',
            });
            enter({
                type: 'InlineComponent',
                name: 'Image',
                id: '2',
            });
            enter({
                type: 'Element',
                name: 'div',
            });
        });

        expect(getImageNodes('<content>')).toEqual([
            {
                type: 'InlineComponent',
                name: 'Image',
                id: '1',
            },
            {
                type: 'InlineComponent',
                name: 'Image',
                id: '2',
            }
        ]);

        expect(parse).toHaveBeenCalledWith('<content>');
        expect(walk).toHaveBeenCalledWith({ ast: true }, {
            enter: expect.any(Function)
        });
    });

});