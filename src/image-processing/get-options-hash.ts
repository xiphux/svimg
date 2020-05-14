import { createHash } from 'crypto';

export default function getOptionsHash(options: { [key: string]: number | string | boolean }, length?: number): string {
    const hash = createHash('md5').update(
        Object.entries(options).map(([k, v]) => `${k}=${v}`).join(',')
    ).digest('hex');

    return length ? hash.substring(0, length) : hash;
}