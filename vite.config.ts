import { resolve } from 'path';
import { defineConfig } from 'vite';

import { cssModulesConfig } from './css-modules.config';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'components/Button/index': resolve(__dirname, 'src/components/Button/index.ts'),
        'context/index': resolve(__dirname, 'src/context/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'types/index': resolve(__dirname, 'src/types/index.ts'),
        'styles/index': resolve(__dirname, 'src/styles/index.ts'),
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
          // Размещаем CSS файлы на основе их исходного пути
          if (assetInfo.name?.endsWith('.css')) {
            const name = assetInfo.name;

            // Для стилей темы
            if (name.includes('theme')) {
              return 'styles/theme.css';
            }

            // Для index.css из styles
            if (name === 'index.css' || name.includes('styles')) {
              return 'styles/index.css';
            }

            // Для CSS Modules компонентов (содержат .module в имени)
            if (name.includes('.module') || name.includes('Button')) {
              return 'components/Button/Button.css';
            }

            // Резервное имя для остальных CSS
            return `styles/${name}`;
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
