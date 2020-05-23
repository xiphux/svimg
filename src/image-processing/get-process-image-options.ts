import { DEFAULT_WIDTHS, DEFAULT_QUALITY, DEFAULT_WEBP } from '../constants/defaults';

interface ProcessImageOptions {
    widths: number[];
    quality: number;
    webp: boolean;
}

export default function getProcessImageOptions(imageWidth: number, options?: Partial<ProcessImageOptions>): ProcessImageOptions {
    let widths = options?.widths || DEFAULT_WIDTHS;
    widths = widths.filter(w => w <= imageWidth);
    if (!(options?.widths?.length)) {
        if (!widths.length || imageWidth > Math.max(...widths)) {
            // use original width if smaller or larger than all widths
            widths.push(imageWidth);
        }
    }

    const quality = options?.quality || DEFAULT_QUALITY;

    const webp = options?.webp ?? DEFAULT_WEBP;

    return {
        widths,
        quality,
        webp,
    };
}