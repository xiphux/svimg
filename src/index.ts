export {
  default as imagePreprocessor,
  type ImagePreprocessorOptions,
} from './preprocessor/image-preprocessor';

export type { SrcGenerator, SrcGeneratorInfo } from './core/path-to-url';

import Image from './Image';
export default Image;
