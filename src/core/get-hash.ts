import { createHash } from 'node:crypto';

export default function getHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}
