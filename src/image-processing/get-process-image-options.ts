interface ProcessImageOptions {
    widths: number[];
    quality: number;
}

const DEFAULT_WIDTHS = [480, 1024, 1920, 2560];
const DEFAULT_QUALITY = 75;

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

    return {
        widths,
        quality,
    };
}