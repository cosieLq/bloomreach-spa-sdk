/*
 * Copyright 2019-2022 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import terserOptions from './terser.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        entryFileNames: '[name].umd.js',
        exports: 'named',
        format: 'umd',
        name: 'BloomreachSpaSdk',
        sourcemap: true,
        sourcemapExcludeSources: true,
        inlineDynamicImports: true,
        globals: {
          cookie: 'cookie',
          inversify: 'inversify',
          emittery: 'emiterry',
          xmldom: 'xmldom',
        },
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript({ clean: true }),
      babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
      terser(terserOptions),
    ],
  },

  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        entryFileNames: '[name].js',
        format: 'es',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [typescript({ clean: true }), terser(terserOptions)],
  },

  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        entryFileNames: '[name].d.ts',
        format: 'es',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [dts()],
  },

  {
    input: 'src/express/index.ts',
    output: [
      {
        dir: 'lib/express',
        entryFileNames: '[name].js',
        format: 'es',
        preserveModules: true,
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript({
        clean: true,
        tsconfigOverride: {
          include: ['src/express/**/*'],
          compilerOptions: {
            declaration: true,
            declarationDir: 'lib',
            target: 'es6',
          },
        },
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
];
