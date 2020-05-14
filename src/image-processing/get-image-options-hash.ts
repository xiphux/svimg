import { createHash } from 'crypto';

interface ImageOptions {
    width: number;
    quality: number;
}

export default function getImageOptionsHash(options: ImageOptions): string {
    return createHash('md5').update(
        Object.entries(options).map(([k, v]) => `${k}=${v}`).join(',')
    ).digest('hex').substring(0, 7);
}