import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Images here are fixed-size WebP files already cut to the sizes the page uses.
      '@next/next/no-img-element': 'off',
    },
  },
  // The 3D scene is plain JavaScript ported from the prototype; prototype/ and research/ are not part of the app.
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'prototype/**', 'research/**', 'src/three/bp3d.js']),
]);
