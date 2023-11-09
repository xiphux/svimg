import typescript from 'rollup-plugin-typescript2';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const entryPoints = [
  { entry: 'index', formats: ['es'] },
  {
    entry: 's-image',
    formats: ['iife'],
    extraPlugins: [
      svelte({
        compilerOptions: {
          customElement: true,
        },
      }),
      resolve(),
    ],
  },
];

export default [
  ...entryPoints.map((entryPoint) => ({
    input: `src/${entryPoint.entry}.ts`,
    output: entryPoint.formats.map((format) => ({
      file: `dist/${entryPoint.entry}.${format == 'cjs' ? 'cjs' : 'js'}`,
      format,
      interop: 'compat',
    })),
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      /^node:.*/,
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      ...(entryPoint.extraPlugins || []),
    ],
  })),
];
