import parseAttributes from '../../src/preprocessor/parse-attributes';
import * as parser from 'node-html-parser';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('parseAttributes', () => {
  let parseSpy: any;

  beforeEach(() => {
    parseSpy = vi.spyOn(parser, 'parse');
  });

  afterEach(() => {
    parseSpy.mockClear();
  });

  it('returns empty if nothing is passed', () => {
    expect(parseAttributes('')).toEqual({});
  });

  it('parses a string attribute', () => {
    expect(parseAttributes('<Image src="images/test.jpg" />')).toEqual({
      src: 'images/test.jpg',
    });

    expect(parseAttributes("<Image src='images/test.jpg' />")).toEqual({
      src: 'images/test.jpg',
    });
  });

  it('parses an expression attribute', () => {
    expect(parseAttributes('<Image alt={altText} />')).toEqual({
      alt: '{altText}',
    });
  });

  it('parses a numeric attribute', () => {
    expect(parseAttributes('<Image width="150" />')).toEqual({
      width: '150',
    });

    expect(parseAttributes('<Image width=150 />')).toEqual({
      width: '150',
    });
  });

  it('parses an empty value attribute', () => {
    expect(parseAttributes('<Image immediate />')).toEqual({
      immediate: 'immediate',
    });
  });

  it('parses multiple', () => {
    expect(
      parseAttributes(
        '<Image src="images/test.jpg" alt={altText} class="red" width="150" immediate />',
      ),
    ).toEqual({
      src: 'images/test.jpg',
      alt: '{altText}',
      class: 'red',
      width: '150',
      immediate: 'immediate',
    });
  });

  it('strips unix line breaks before parsing', () => {
    expect(
      parseAttributes(
        '<Image\n\tsrc="images/test.jpg"\n\talt={altText}\n\tclass="red"\n\twidth="150"\n\timmediate\n\t/>',
      ),
    ).toEqual({
      src: 'images/test.jpg',
      alt: '{altText}',
      class: 'red',
      width: '150',
      immediate: 'immediate',
    });

    expect(parseSpy).toHaveBeenCalledWith(
      '<Image \tsrc="images/test.jpg" \talt={altText} \tclass="red" \twidth="150" \timmediate \t/>',
    );
  });

  it('strips windows line breaks before parsing', () => {
    expect(
      parseAttributes(
        '<Image\r\nsrc="images/test2.jpg"\r\nalt={altText}\r\nclass="red"\r\nwidth="150"\r\nimmediate\r\n/>',
      ),
    ).toEqual({
      src: 'images/test2.jpg',
      alt: '{altText}',
      class: 'red',
      width: '150',
      immediate: 'immediate',
    });

    expect(parseSpy).toHaveBeenCalledWith(
      '<Image src="images/test2.jpg" alt={altText} class="red" width="150" immediate />',
    );
  });
});
