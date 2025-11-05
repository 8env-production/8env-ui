import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { injectCssImport } from './inject-css-imports.lib';

describe('inject-css-imports', () => {
  let tempDir: string;

  beforeEach(() => {
    // Создаём временную директорию для тестов
    tempDir = join(tmpdir(), `inject-css-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    // Удаляем временную директорию после тестов
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (_e) {
      // Игнорируем ошибки при удалении
    }
  });

  describe('injectCssImport', () => {
    describe('ESM files (.js)', () => {
      it('должен добавить импорт CSS после других импортов', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";
import styles from "./styles.js";

const Component = () => {};
export { Component };`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(jsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(true);
        expect(writeFile).toHaveBeenCalledTimes(1);
        expect(writeFile).toHaveBeenCalledWith(
          jsPath,
          expect.stringContaining(`import './component.css';`),
          'utf-8'
        );

        const writtenContent = writeFile.mock.calls[0][1] as string;
        const lines = writtenContent.split('\n');
        expect(lines[2]).toBe(`import './component.css';`);
      });

      it('должен заменить комментарий "empty css"', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";
/* empty css                   */
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './component.css';`);
        expect(writtenContent).not.toContain('/* empty css');
      });

      it('не должен добавлять дубликаты импортов', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";
import './component.css';
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(jsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(false);
        expect(writeFile).not.toHaveBeenCalled();
      });

      it('должен правильно вычислять относительный путь', () => {
        const jsPath = join(tempDir, 'components', 'Button', 'Button.js');
        const cssPath = join(tempDir, 'components', 'Button', 'Button.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './Button.css';`);
      });

      it('должен обрабатывать CSS в родительской директории', () => {
        const jsPath = join(tempDir, 'components', 'Button', 'Button.js');
        const cssPath = join(tempDir, 'styles', 'theme.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './../../styles/theme.css';`);
      });
    });

    describe('CommonJS files (.cjs)', () => {
      it('должен добавить require после "use strict"', () => {
        const cjsPath = join(tempDir, 'component.cjs');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");

const Component = () => {};
exports.Component = Component;`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(cjsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(true);
        expect(writeFile).toHaveBeenCalledTimes(1);

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`require('./component.css');`);

        const lines = writtenContent.split('\n');
        // require должен быть после Object.defineProperty
        const requireLine = lines.findIndex((line) => line.includes(`require('./component.css')`));
        const definePropertyLine = lines.findIndex((line) =>
          line.includes('Object.defineProperty')
        );
        expect(requireLine).toBeGreaterThan(definePropertyLine);
      });

      it('должен заменить комментарий "empty css" с точкой с запятой', () => {
        const cjsPath = join(tempDir, 'component.cjs');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
;/* empty css                   */
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(cjsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`require('./component.css');`);
        expect(writtenContent).not.toContain('/* empty css');
        // Проверяем, что нет лишней точки с запятой
        expect(writtenContent).toMatch(/;\s*require\('\.\/component\.css'\);/);
      });

      it('не должен добавлять дубликаты require', () => {
        const cjsPath = join(tempDir, 'component.cjs');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `"use strict";
require('./component.css');
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(cjsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(false);
        expect(writeFile).not.toHaveBeenCalled();
      });

      it('должен использовать require вместо import', () => {
        const cjsPath = join(tempDir, 'component.cjs');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `"use strict";
const Component = () => {};`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(cjsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`require('./component.css');`);
        expect(writtenContent).not.toContain('import');
      });
    });

    describe('Edge cases', () => {
      it('должен обрабатывать файлы без импортов', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `const Component = () => {};
export { Component };`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './component.css';`);
      });

      it('должен обрабатывать пустые файлы', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = '';

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './component.css';`);
      });

      it('должен обрабатывать файлы только с комментариями', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `// This is a comment
/* empty css */
// Another comment`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        expect(writtenContent).toContain(`import './component.css';`);
        expect(writtenContent).not.toContain('/* empty css */');
      });

      it('должен корректно обрабатывать Windows-пути', () => {
        const jsPath = join(tempDir, 'components', 'Button', 'Button.js');
        const cssPath = join(tempDir, 'components', 'Button', 'Button.css');

        const originalContent = `import { jsx } from "react/jsx-runtime";`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        injectCssImport(jsPath, cssPath, { readFile, writeFile });

        const writtenContent = writeFile.mock.calls[0][1] as string;
        // Проверяем, что используются forward slashes
        expect(writtenContent).toContain(`import './Button.css';`);
        expect(writtenContent).not.toContain('\\');
      });
    });

    describe('Import detection', () => {
      it('должен обнаруживать импорт с двойными кавычками', () => {
        const jsPath = join(tempDir, 'component.js');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `import "./component.css";`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(jsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(false);
        expect(writeFile).not.toHaveBeenCalled();
      });

      it('должен обнаруживать require с двойными кавычками', () => {
        const cjsPath = join(tempDir, 'component.cjs');
        const cssPath = join(tempDir, 'component.css');

        const originalContent = `require("./component.css");`;

        const readFile = jest.fn(() => originalContent);
        const writeFile = jest.fn();

        const result = injectCssImport(cjsPath, cssPath, { readFile, writeFile });

        expect(result).toBe(false);
        expect(writeFile).not.toHaveBeenCalled();
      });
    });
  });
});
