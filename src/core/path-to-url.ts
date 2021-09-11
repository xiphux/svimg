const pathSepPattern = /\\/g;

interface PathToUrlOptions {
  inputDir?: string;
  src?: string;
}

export default function pathToUrl(
  path: string,
  options?: PathToUrlOptions,
): string {
  path = path.replace(pathSepPattern, '/');

  if (!options) {
    return path;
  }

  let { inputDir, src } = options;

  if (inputDir) {
    inputDir = inputDir.replace(pathSepPattern, '/');

    if (path.startsWith(inputDir)) {
      path = path.substring(inputDir.length + (inputDir.endsWith('/') ? 0 : 1));
    }
  }

  if (src && !path.startsWith('/') && /^\/[^\/]/.test(src)) {
    path = '/' + path;
  }

  return path;
}
