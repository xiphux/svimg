import parseAttributes from '../../src/preprocessor/parse-attributes';

describe('parseAttributes', () => {

    it('returns empty if nothing is passed', () => {
        expect(parseAttributes('')).toEqual({});
    });

    it('parses a string attribute', () => {
        expect(parseAttributes(
            '<Image src="images/test.jpg">'
        )).toEqual({
            src: 'images/test.jpg',
        });

        expect(parseAttributes(
            '<Image src=\'images/test.jpg\'>'
        )).toEqual({
            src: 'images/test.jpg',
        });
    });

    it('parses an expression attribute', () => {
        expect(parseAttributes(
            '<Image alt={altText}>'
        )).toEqual({
            alt: '{altText}',
        });
    });

    it('parses a numeric attribute', () => {
        expect(parseAttributes(
            '<Image width="150">'
        )).toEqual({
            width: '150',
        });

        expect(parseAttributes(
            '<Image width=150>'
        )).toEqual({
            width: '150',
        });
    });

    it('parses an empty value attribute', () => {
        expect(parseAttributes(
            '<Image immediate>'
        )).toEqual({
            immediate: 'immediate',
        });
    });

    it('parses multiple', () => {
        expect(parseAttributes(
            '<Image src="images/test.jpg" alt={altText} class="red" width="150" immediate>'
        )).toEqual({
            src: 'images/test.jpg',
            alt: '{altText}',
            class: 'red',
            width: '150',
            immediate: 'immediate',
        });
    });
})