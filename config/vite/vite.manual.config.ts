/* eslint-disable import/no-default-export */
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist/manual',
  },
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manual/manual.html',
          dest: './',
        },
      ],
    }),
  ],
});
