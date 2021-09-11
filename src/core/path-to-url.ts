const pathSepPattern = /\\/g;

function stripPrefix(path: string, prefix: string): string {
  prefix = prefix.replace(pathSepPattern, '/');

  if (!path.startsWith(prefix)) {
    return path;
  }

  return path.substring(prefix.length + (prefix.endsWith('/') ? 0 : 1));
}

interface PathToUrlOptions {
  inputDir?: string;
  src?: string;
  outputDir?: string;
  publicPath?: string;
}

export default function pathToUrl(
  path: string,
  options?: PathToUrlOptions,
): string {
  path = path.replace(pathSepPattern, '/');

  if (!options) {
    return path;
  }

  let { inputDir, src, outputDir, publicPath } = options;

  if (publicPath) {
    if (outputDir) {
      path = stripPrefix(path, outputDir);
    }

    path = publicPath + (publicPath.endsWith('/') ? '' : '/') + path;

    return path;
  }

  if (inputDir) {
    path = stripPrefix(path, inputDir);
  }

  if (src && !path.startsWith('/') && /^\/[^\/]/.test(src)) {
    path = '/' + path;
  }

  return path;
}
