import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';

export default [
  // ESM build
  {
    input,
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.build.json', declaration: false })],
    external: ['react'],
  },
  // CJS build
  {
    input,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.build.json', declaration: false })],
    external: ['react'],
  },
  // Type declarations
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
    external: ['react'],
  },
];
