export default function tryParseInt(val: string): number | undefined {
    return val && /^[0-9]+$/.test(val) ? parseInt(val, 10) : undefined;
}
