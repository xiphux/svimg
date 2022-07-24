import { deprecate } from 'util';

const pathSepPattern = /\\/g;

function stripPrefix(path: string, prefix: string): string {
  prefix = prefix.replace(pathSepPattern, '/');

  if (!path.startsWith(prefix)) {
    return path;
  }

  return path.substring(prefix.length + (prefix.endsWith('/') ? 0 : 1));
}

export interface SrcGeneratorInfo {
  inputDir: string;
  outputDir: string;
  src: string;
}

export type SrcGenerator = (path: string, info?: SrcGeneratorInfo) => string;

const createPublicPathSrcGenerator = deprecate(function (
  publicPath: string,
): SrcGenerator {
  return (path) => publicPath + (publicPath.endsWith('/') ? '' : '/') + path;
},
'publicPath is deprecated, please use srcGenerator instead');

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
  srcGenerator?: SrcGenerator;
}

export default function pathToUrl(
  path: string,
  options?: PathToUrlOptions,
): string {
  path = path.replace(pathSepPattern, '/');

  if (!options) {
    return path;
  }

  let { publicPath, srcGenerator, ...info } = options;

  if (!srcGenerator && publicPath) {
    srcGenerator = createPublicPathSrcGenerator(publicPath);
  }

  if (srcGenerator) {
    if (info.outputDir) {
      path = stripPrefix(path, info.outputDir);
    }

    const url = srcGenerator(path, info);
    if (!url) {
      throw new Error(
        `srcGenerator function returned an empty src for path ${path}`,
      );
    }
    return url;
  }

  return defaultSrcGenerator(path, info);
}
