import { access } from 'node:fs/promises';
import { constants } from 'node:fs';

export default async function exists(file: string): Promise<boolean> {
  if (!file) {
    return false;
  }

  try {
    await access(file, constants.F_OK);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw Error(err);
  }
}
