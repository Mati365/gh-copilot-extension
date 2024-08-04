/* eslint-disable import/no-default-export */
import 'vitest/config';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index',
      fileName: 'index',
      formats: ['es'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    setupFiles: ['@gh-copilot-ext/commons/test-utils/globals'],
    globals: true,
    include: ['**/*.test.tsx', '**/*.test.ts'],
    coverage: {
      exclude: ['**/index.ts'],
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportOnFailure: true,
    },
  },
  plugins: [
    tsconfigPaths(),
    dts({
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    }),
    react(),
  ],
});
