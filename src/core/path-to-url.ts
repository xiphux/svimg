const pathSepPattern = /\\/g;

interface PathToUrlOptions {
  inputDir?: string;
}

export default function pathToUrl(
  path: string,
  options?: PathToUrlOptions,
): string {
  path = path.replace(pathSepPattern, '/');

  if (!options) {
    return path;
  }

  let { inputDir } = options;

  if (inputDir) {
    inputDir = inputDir.replace(pathSepPattern, '/');

    if (path.startsWith(inputDir)) {
      path = path.substring(inputDir.length + (inputDir.endsWith('/') ? 0 : 1));
    }
  }

  return path;
}
