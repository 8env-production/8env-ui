import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { processDirectory } from './inject-css-imports.lib.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

/**
 * Основная функция
 */
function main(): void {
  console.log('🔧 Injecting CSS imports into compiled JS files...\n');

  // Специальные правила для определенных файлов
  const specialRules: Record<string, string> = {
    'context/ThemeContext': 'styles/theme.css',
    'components/Button/Button': 'components/Button/Button.css',
    'components/Icon/Icon': 'components/Icon/Icon.css',
  };

  const { injectedCount, results } = processDirectory(distDir, specialRules);

  // Вывод результатов
  results.forEach(({ jsFile, cssFile }) => {
    console.log(`✅ ${jsFile} → ${cssFile}`);
  });

  console.log(`\n✨ Injected CSS imports into ${injectedCount} file(s)\n`);
}

main();
