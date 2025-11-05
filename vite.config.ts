import { resolve } from 'path';
import { defineConfig } from 'vite';

import { cssModulesConfig } from './css-modules.config';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'components/Button/index': resolve(__dirname, 'src/components/Button/index.ts'),
        'components/Modal/index': resolve(__dirname, 'src/components/Modal/index.ts'),
        'components/Navigation/index': resolve(__dirname, 'src/components/Navigation/index.ts'),
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

            const originalFile = assetInfo.originalFileName ?? '';

            // Для CSS Modules компонентов
            if (originalFile.includes('components/')) {
              const parts = originalFile.split('/');
              const componentsIndex = parts.lastIndexOf('components');
              const componentName = parts[componentsIndex + 1];
              if (componentName) {
                return `components/${componentName}/${componentName}.css`;
              }
            }

            if (name.includes('.module')) {
              const moduleMatch = name.match(/([A-Za-z0-9]+)\.module/i);
              if (moduleMatch) {
                const componentName = moduleMatch[1];
                return `components/${componentName}/${componentName}.css`;
              }
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
