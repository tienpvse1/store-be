import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
      '@decorators': path.resolve(__dirname, './src/custom-decorators'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@testing': path.resolve(__dirname, './src/testing'),
    },
    root: './src',
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
      '@decorators': path.resolve(__dirname, './src/custom-decorators'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@testing': path.resolve(__dirname, './src/testing'),
    },
  },
  plugins: [swc.vite()],
});
