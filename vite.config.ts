import { resolve } from 'path';
import { defineConfig } from 'vite';

import { cssModulesConfig } from './css-modules.config';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'components/Button/index': resolve(__dirname, 'src/components/Button/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        assetFileNames: (assetInfo) => {
          // Размещаем CSS файлы рядом с соответствующими компонентами
          if (assetInfo.name?.endsWith('.css')) {
            return 'components/Button/Button.css';
          }
          return '[name][extname]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
    modules: cssModulesConfig,
  },
});
