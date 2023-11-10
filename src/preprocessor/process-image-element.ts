import generateComponentAttributes from '../component/generate-component-attributes';
import formatAttribute from '../core/format-attribute';
import type Queue from '../core/queue';
import tryParseInt from '../core/try-parse-int';
import type { ImagePreprocessorOptions } from './image-preprocessor';
import parseAttributes from './parse-attributes';

export default async function processImageElement(
  element: string,
  queue: Queue,
  options: ImagePreprocessorOptions,
): Promise<string> {
  if (!element) {
    return element;
  }

  const attrs = parseAttributes(element);
  const src = attrs['src'];
  if (!src) {
    return element;
  }

  const width = tryParseInt(attrs['width']);
  const quality = tryParseInt(attrs['quality']);
  const immediate = !!attrs['immediate'];

  const newAttrs = await generateComponentAttributes({
    src,
    queue,
    inputDir: options.inputDir,
    outputDir: options.outputDir,
    webp: options.webp,
    avif: options.avif,
    widths: width ? [width] : undefined,
    quality,
    skipPlaceholder: immediate || undefined,
    srcGenerator: options.srcGenerator,
    embedPlaceholder: options.embedPlaceholder,
  });

  const attrString = Object.entries(newAttrs)
    .map(([attr, val]) => formatAttribute(attr, val))
    .join(' ');

  return element.substring(0, 6) + ' ' + attrString + element.substring(6);
}
