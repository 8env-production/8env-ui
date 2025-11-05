import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, sep } from 'path';

type ReadFileFn = (path: string, encoding: string) => string;
type WriteFileFn = (path: string, content: string, encoding: string) => void;

interface FileOperations {
  readFile?: ReadFileFn;
  writeFile?: WriteFileFn;
}

interface ProcessResult {
  jsFile: string;
  cssFile: string;
}

interface ProcessDirectoryResult {
  injectedCount: number;
  results: ProcessResult[];
}

/**
 * Найти все JS файлы в директории рекурсивно
 */
export function findJsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Проверить, есть ли CSS файл рядом с JS файлом
 */
export function findCssFile(jsFilePath: string): string | null {
  const dir = dirname(jsFilePath);
  const baseName = jsFilePath.replace(/\.(js|cjs)$/, '');

  // Проверяем различные варианты имен CSS файлов
  const possibleNames = [
    baseName + '.css',
    join(dir, dirname(baseName).split(sep).pop()! + '.css'),
  ];

  for (const cssPath of possibleNames) {
    try {
      statSync(cssPath);
      return cssPath;
    } catch {
      // файл не существует
    }
  }

  return null;
}

/**
 * Добавить импорт CSS в JS файл
 */
export function injectCssImport(
  jsFilePath: string,
  cssFilePath: string,
  { readFile, writeFile }: FileOperations = {}
): boolean {
  const rf: ReadFileFn =
    readFile ||
    ((path: string, encoding: string) => readFileSync(path, encoding as BufferEncoding));
  const wf: WriteFileFn =
    writeFile ||
    ((path: string, content: string, encoding: string) =>
      writeFileSync(path, content, { encoding: encoding as BufferEncoding }));

  let content = rf(jsFilePath, 'utf-8');

  // Вычислить относительный путь от JS к CSS
  const relativePath = relative(dirname(jsFilePath), cssFilePath).replace(/\\/g, '/');

  // Определить, это CJS или ESM файл
  const isCJS = jsFilePath.endsWith('.cjs');
  const importStatement = isCJS ? `require('./${relativePath}');` : `import './${relativePath}';`;

  // Проверить, есть ли уже импорт
  if (
    content.includes(importStatement.trim()) ||
    content.includes(`import "./${relativePath}"`) ||
    content.includes(`import '${relativePath}'`) ||
    content.includes(`require("./${relativePath}")`)
  ) {
    return false;
  }

  // Найти комментарий "empty css" и заменить его
  if (content.includes('/* empty css')) {
    // Удалить точку с запятой перед комментарием, если есть, и добавить перенос строки
    content = content.replace(/;\s*\/\* empty css\s+\*\//, `;\n${importStatement}`);
    content = content.replace(/\/\* empty css\s+\*\//, `\n${importStatement}`);
  } else if (isCJS) {
    // Для CJS: добавить require после "use strict" и Object.defineProperty
    const lines = content.split('\n');
    let insertIndex = 0;

    // Найти подходящее место для вставки (после "use strict" и defineProperty)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"use strict"') || lines[i].includes('Object.defineProperty')) {
        insertIndex = i + 1;
      } else if (
        lines[i].includes('const ') ||
        lines[i].includes('require(') ||
        lines[i].includes('function ')
      ) {
        break;
      }
    }

    lines.splice(insertIndex, 0, importStatement.trim());
    content = lines.join('\n');
  } else {
    // Для ESM: добавить import после других импортов
    const lines = content.split('\n');
    let insertIndex = 0;

    // Найти последний импорт
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i + 1;
      } else if (insertIndex > 0 && lines[i].trim() !== '') {
        break;
      }
    }

    lines.splice(insertIndex, 0, importStatement.trim());
    content = lines.join('\n');
  }

  wf(jsFilePath, content, 'utf-8');
  return true;
}

/**
 * Обработать все JS файлы в директории
 */
export function processDirectory(
  distDir: string,
  specialRules: Record<string, string> = {}
): ProcessDirectoryResult {
  const jsFiles = findJsFiles(distDir);
  let injectedCount = 0;
  const results: ProcessResult[] = [];

  for (const jsFile of jsFiles) {
    const relativePath = relative(distDir, jsFile).replace(/\\/g, '/');

    // Проверяем специальные правила
    let cssFile: string | null = null;
    for (const [pattern, cssPath] of Object.entries(specialRules)) {
      if (relativePath.includes(pattern)) {
        cssFile = join(distDir, cssPath);
        break;
      }
    }

    // Если нет специального правила, ищем CSS рядом
    if (!cssFile) {
      cssFile = findCssFile(jsFile);
    }

    if (cssFile) {
      try {
        statSync(cssFile); // проверяем существование
        const injected = injectCssImport(jsFile, cssFile);
        if (injected) {
          const result: ProcessResult = {
            jsFile: relativePath,
            cssFile: relative(distDir, cssFile).replace(/\\/g, '/'),
          };
          results.push(result);
          injectedCount++;
        }
      } catch {
        // CSS файл не существует
      }
    }
  }

  return { injectedCount, results };
}
