// sharp only supports a very specific list of image formats,
// no point depending on a complete mime type database

export default function getMimeType(format: string): string {
    switch (format) {
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'avif':
        case 'tiff':
        case 'gif':
            return `image/${format}`;
        case 'svg':
            return 'image/svg+xml';
    }
    return '';
}