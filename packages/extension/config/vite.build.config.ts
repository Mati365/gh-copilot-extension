/* eslint-disable import/no-default-export, import/no-relative-packages */
import 'vitest/config';

import path from 'node:path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        foreground: './src/foreground.ts',
        serviceWorker: './src/service-worker/index.ts',
      },
      output: {
        dir: 'dist',
        entryFileNames: 'js/[name].js',
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, '../template/[!.]*'),
          dest: path.resolve(__dirname, '../dist/'),
        },
      ],
    }),
  ],
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
});
