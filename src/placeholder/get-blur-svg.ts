import { v4 as uuidv4 } from 'uuid';

export default function getBlurSvg(href: string, width: number, height: number, blur: number): string {
    const filterId = uuidv4();
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
        `<filter id="${filterId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
        `<feGaussianBlur stdDeviation="${blur} ${blur}" edgeMode="duplicate" />` +
        `<feComponentTransfer><feFuncA type="discrete" tableValues="1 1" /></feComponentTransfer>` +
        `</filter>` +
        `<image filter="url(#${filterId})" xlink:href="${href}" x="0" y="0" height="100%" width="100%" />` +
        `</svg>`;
}