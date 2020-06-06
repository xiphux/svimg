import getNodeAttributes from '../../src/preprocessor/get-node-attributes';

describe('getNodeAttributes', () => {

    it('handles nodes without attributes', () => {
        expect(getNodeAttributes({} as any)).toEqual({});
        expect(getNodeAttributes({ attributes: [] } as any)).toEqual({});
    });

    it('handles single attributes', () => {
        expect(getNodeAttributes({
            attributes: [
                {
                    name: 'src',
                    value: [
                        {
                            data: 'val',
                        }
                    ]
                }
            ]
        } as any)).toEqual({
            src: 'val',
        });
    });

    it('handles multiple attributes', () => {
        expect(getNodeAttributes({
            attributes: [
                {
                    name: 'src',
                    value: [
                        {
                            data: 'val',
                        }
                    ]
                },
                {
                    name: 'srcset',
                    value: [
                        {
                            data: 'val2',
                        }
                    ]
                }
            ]
        } as any)).toEqual({
            src: 'val',
            srcset: 'val2',
        });
    });

    it('handles boolean attributes', () => {
        expect(getNodeAttributes({
            attributes: [
                {
                    name: 'immediate',
                    value: true
                }
            ]
        } as any)).toEqual({
            immediate: true,
        });
    });

});