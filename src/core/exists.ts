import fs from 'fs';

export default async function exists(file: string): Promise<boolean> {
    if (!file) {
        return false;
    }

    try {
        await fs.promises.access(file, fs.constants.F_OK);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw Error(err);
    }
}