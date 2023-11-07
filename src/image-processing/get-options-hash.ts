import getHash from '../core/get-hash';

export default function getOptionsHash(
  options: { [key: string]: number | string | boolean | undefined },
  length?: number,
): string {
  const hash = getHash(
    Object.entries(options)
      .map(([k, v]) => `${k}=${v}`)
      .join(','),
  );

  return length ? hash.substring(0, length) : hash;
}
