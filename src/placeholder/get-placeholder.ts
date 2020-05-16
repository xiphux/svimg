import svgDataUri from 'mini-svg-data-uri';
import getMimeType from '../core/get-mime-type';
import resizeImage from '../core/resize-image';
import getImageMetadata from '../core/get-image-metadata';
import getBlurSvg from './get-blur-svg';

interface CreatePlaceholderOptions {
    blur?: number;
}

const BLUR_WIDTH = 64;

export default async function getPlaceholder(inputFile: string, options?: CreatePlaceholderOptions): Promise<string> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    const blur = options?.blur || 40;

    const { width, height, format } = await getImageMetadata(inputFile);
    const blurData = await resizeImage(inputFile, { width: BLUR_WIDTH });
    const blur64 = blurData.toString('base64');
    const mime = getMimeType(format);
    const href = `data:${mime};base64,${blur64}`;

    const svg = getBlurSvg(href, width, height, blur);

    return svgDataUri(svg);
}