const pathSepPattern = /\\/g;

function stripPrefix(path: string, prefix: string): string {
  prefix = prefix.replace(pathSepPattern, '/');

  if (!path.startsWith(prefix)) {
    return path;
  }

  return path.substring(prefix.length + (prefix.endsWith('/') ? 0 : 1));
}

interface SrcGeneratorInfo {
  inputDir: string;
  outputDir: string;
  src: string;
}

type SrcGenerator = (path: string, info?: SrcGeneratorInfo) => string;

function createPublicPathSrcGenerator(publicPath: string): SrcGenerator {
  return (path) => publicPath + (publicPath.endsWith('/') ? '' : '/') + path;
}

function defaultSrcGenerator(
  path: string,
  { inputDir, src }: SrcGeneratorInfo,
) {
  if (inputDir) {
    path = stripPrefix(path, inputDir);
  }

  if (src && !path.startsWith('/') && /^\/[^\/]/.test(src)) {
    path = '/' + path;
  }

  return path;
}

interface PathToUrlOptions {
  inputDir: string;
  src: string;
  outputDir: string;
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

  const { publicPath, ...info } = options;

  let srcGenerator: SrcGenerator;

  if (publicPath) {
    srcGenerator = createPublicPathSrcGenerator(publicPath);
  }

  if (srcGenerator) {
    if (info.outputDir) {
      path = stripPrefix(path, info.outputDir);
    }

    return srcGenerator(path, info);
  }

  return defaultSrcGenerator(path, info);
}
