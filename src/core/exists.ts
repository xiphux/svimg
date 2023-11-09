import { access } from 'node:fs/promises';
import { constants } from 'node:fs';

function isError(error: any): error is NodeJS.ErrnoException {
  return 'code' in error;
}

export default async function exists(file: string): Promise<boolean> {
  if (!file) {
    return false;
  }

  try {
    await access(file, constants.F_OK);
    return true;
  } catch (err) {
    if (isError(err) && err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
