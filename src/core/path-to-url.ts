const pathSepPattern = /\\/g;

export default function pathToUrl(path: string, baseDir?: string): string {
    path = path.replace(pathSepPattern, '/');

    if (baseDir) {
        baseDir = baseDir.replace(pathSepPattern, '/');

        if (path.startsWith(baseDir)) {
            path = path.substring(baseDir.length + (baseDir.endsWith('/') ? 0 : 1));
        }
    }

    return path;
}