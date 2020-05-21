import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            },
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        plugins: [
            typescript({
                typescript: require('typescript'),
            })
        ],
    },
    {
        input: 'src/s-image.ts',
        output: [
            {
                file: 'dist/s-image.js',
                format: 'iife',
            },
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        plugins: [
            typescript({
                typescript: require('typescript'),
            }),
            svelte({
                customElement: true,
            }),
            resolve(),
        ],
    }
];