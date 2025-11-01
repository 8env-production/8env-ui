# Контекст библиотеки @8env-ui/components

## Архитектура и принципы

### Основная концепция

Библиотека использует **принудительный tree-shaking** - каждый компонент импортируется отдельно, что обеспечивает минимальный размер бандла в конечном приложении.

### Ключевые решения

1. **Scoped package**: `@8env-ui/components`
   - Использует namespace организации для избежания конфликтов имён

2. **Отсутствие корневого экспорта**
   - ❌ Запрещено: `import { Button } from '@8env-ui/components'`
   - ✅ Обязательно: `import { Button } from '@8env-ui/components/button'`
   - Причина: Гарантирует, что в бандл попадёт только используемый код

3. **Раздельные точки входа для стилей**
   - Компонент: `@8env-ui/components/button`
   - Стили: `@8env-ui/components/button/styles`
   - Причина: Позволяет контролировать загрузку CSS

## Структура проекта

```
8env-ui/
├── src/
│   └── components/
│       └── Button/
│           ├── Button.tsx          # Компонент
│           ├── Button.module.scss  # Стили (CSS Modules)
│           ├── Button.test.tsx     # Тесты
│           ├── Button.stories.tsx  # Storybook stories
│           └── index.ts            # Точка входа компонента
├── dist/                           # Собранные файлы (после npm run build)
│   └── components/
│       └── Button/
│           ├── Button.js
│           ├── Button.d.ts
│           ├── Button.css
│           ├── index.js
│           └── index.d.ts
├── tsconfig.json                   # Базовая конфигурация TypeScript
├── tsconfig.build.json             # Конфигурация для сборки
├── package.json                    # Метаданные и скрипты
└── README.md                       # Документация
```

## Конфигурация сборки

### package.json - Ключевые поля

```json
{
  "name": "@8env-ui/components",
  "exports": {
    "./button": {
      "types": "./dist/components/Button/index.d.ts",
      "import": "./dist/components/Button/index.js",
      "require": "./dist/components/Button/index.js"
    },
    "./button/styles": "./dist/components/Button/Button.css"
  },
  "sideEffects": ["*.css"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

**Важные моменты:**

- `exports` - определяет доступные точки входа
- `sideEffects: ["*.css"]` - помогает bundler'ам понять, что CSS файлы имеют побочные эффекты
- `peerDependencies` - React не включается в бандл библиотеки

### tsconfig.build.json

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

**Ключевые параметры:**

- `rootDir: "./src"` - обеспечивает правильную структуру в dist/
- `moduleResolution: "node"` - необходимо для сборки библиотеки

## Скрипты сборки

### npm run build

```bash
vite build && tsc -p tsconfig.build.json --emitDeclarationOnly
```

1. **Vite build** - компилирует TypeScript в JavaScript и SCSS в CSS
   - Автоматически обрабатывает импорты стилей
   - Компилирует SCSS в CSS
   - Создает ES и CommonJS модули
   - Размещает CSS файлы рядом с компонентами
2. **TypeScript --emitDeclarationOnly** - генерирует только .d.ts файлы для типов

### Единая конфигурация CSS Modules

Конфигурация CSS Modules вынесена в отдельный файл `css-modules.config.ts` для единой точки истины:

```typescript
import type { CSSModulesOptions } from 'vite';

/**
 * Единая конфигурация CSS модулей для Vite и Storybook
 *
 * Формат имен классов: __8env-ui__[ComponentName]__[className]
 */
export const cssModulesConfig: CSSModulesOptions = {
  localsConvention: 'dashes',
  generateScopedName: '__8env-ui__[name]__[local]',
};
```

**Примеры генерируемых имен:**

- `.button` → `.__8env-ui__Button-module__button`
- `.button--primary` → `.__8env-ui__Button-module__button--primary`

### vite.config.ts

```typescript
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
          // Размещаем CSS файлы рядом с компонентами
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
```

**Ключевые особенности:**

- `preserveModules: true` - сохраняет структуру модулей
- `cssCodeSplit: true` - создает отдельные CSS файлы для каждого компонента
- `assetFileNames` - контролирует размещение CSS файлов
- **CSS Modules с префиксом `__8env-ui__`** - автоматическая генерация уникальных имен классов
- `localsConvention: 'dashes'` - поддержка kebab-case и camelCase имен
- SCSS автоматически компилируется в CSS
- Единая конфигурация импортируется из `css-modules.config.ts`

## Добавление нового компонента

### Шаг 1: Создать структуру файлов

```bash
mkdir -p src/components/MyComponent
```

Создать файлы:

- `MyComponent.tsx` - сам компонент
- `MyComponent.scss` - стили (SCSS)
- `MyComponent.test.tsx` - тесты
- `MyComponent.stories.tsx` - Storybook stories
- `index.ts` - точка входа

### Шаг 2: Создать index.ts

```typescript
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

### Шаг 3: Добавить exports в package.json

```json
{
  "exports": {
    "./my-component": {
      "types": "./dist/components/MyComponent/index.d.ts",
      "import": "./dist/components/MyComponent/index.js",
      "require": "./dist/components/MyComponent/index.js"
    },
    "./my-component/styles": "./dist/components/MyComponent/MyComponent.css"
  }
}
```

### Шаг 4: Добавить entry point в vite.config.ts

```typescript
entry: {
  'components/Button/index': resolve(__dirname, 'src/components/Button/index.ts'),
  'components/MyComponent/index': resolve(__dirname, 'src/components/MyComponent/index.ts'),
}
```

И обновить `assetFileNames` для правильного размещения CSS:

```typescript
assetFileNames: (assetInfo) => {
  if (assetInfo.name?.endsWith('.css')) {
    // Определяем путь на основе имени компонента
    return 'components/[name].css';
  }
  return '[name][extname]';
};
```

### Шаг 5: Пересобрать библиотеку

```bash
npm run build
```

## Использование в других проектах

### Локальная разработка

```bash
# В директории библиотеки
npm run build
npm link

# В проекте-потребителе
npm link @8env-ui/components
```

### Использование после публикации

```bash
npm install @8env-ui/components
```

### Импорт в код

```tsx
import { Button, ButtonProps } from '@8env-ui/components/button';
import '@8env-ui/components/button/styles';

function App() {
  return (
    <Button
      label="Кнопка"
      variant="primary"
      size="medium"
      onClick={() => console.log('Clicked!')}
    />
  );
}
```

## Технологический стек

- **React** 19.2.0 - UI библиотека
- **TypeScript** 5.9.3 - Типизация
- **Vite** 6.4.1 - Сборка и разработка
- **SCSS** 1.93.3 - Препроцессор стилей
- **Storybook** 8.6.14 - Разработка и документация
- **Jest** 30.2.0 - Тестирование
- **React Testing Library** 16.3.0 - Тестирование компонентов
- **ESLint** 9.39.0 - Проверка кода
- **Prettier** 3.6.2 - Форматирование
- **Husky** 9.1.7 - Git hooks
- **lint-staged** 16.2.6 - Pre-commit проверки

## Преимущества архитектуры

1. **Оптимальный размер бандла**
   - Только используемые компоненты попадают в финальный бандл
   - Автоматический tree-shaking на уровне компонентов

2. **Явный контроль зависимостей**
   - Разработчик явно указывает, какие компоненты использует
   - Легче отслеживать, что именно используется в проекте

3. **Гибкость со стилями**
   - Стили импортируются отдельно
   - Можно использовать компонент без стилей (для кастомизации)

4. **TypeScript поддержка**
   - Полная типизация всех компонентов
   - Автодополнение в IDE
   - Проверка типов на этапе разработки

## Важные файлы конфигурации

### .gitignore

- `dist/` - не коммитим собранные файлы
- `node_modules/` - не коммитим зависимости

### package.json - files

```json
{
  "files": ["dist", "README.md"]
}
```

При публикации в npm включаются только эти файлы/директории.

## Публикация в npm

```bash
# Убедитесь, что залогинены в npm
npm login

# Соберите библиотеку
npm run build

# Опубликуйте (первый раз с флагом --access public для scoped package)
npm publish --access public

# Последующие публикации
npm publish
```

## Версионирование

Следуйте [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): Новый функционал (обратно совместимый)
- **PATCH** (1.0.0 → 1.0.1): Исправления багов

```bash
# Обновить версию и опубликовать
npm version patch  # или minor, или major
npm publish
```

## Troubleshooting

### Ошибка при сборке: "Cannot find module"

- Убедитесь, что `rootDir` в tsconfig.build.json указывает на "./src"
- Проверьте, что все импорты корректны

### SCSS не компилируется в CSS

- Убедитесь, что в [`vite.config.ts`](../vite.config.ts) настроен препроцессор SCSS
- Проверьте, что установлен пакет `sass`
- Убедитесь, что `cssCodeSplit: true` для создания отдельных CSS файлов

### Стили не применяются в Storybook

- Убедитесь, что [`css-modules.config.ts`](../css-modules.config.ts) импортирован в [`.storybook/main.ts`](../.storybook/main.ts)
- Проверьте, что настройки CSS Modules идентичны в обоих конфигах
- Перезапустите Storybook после изменения конфигурации

### TypeScript типы не работают

- Убедитесь, что в exports указаны правильные пути к .d.ts файлам
- Проверьте, что `declaration: true` в tsconfig.build.json

### Tree-shaking не работает

- Убедитесь, что корневой экспорт удалён из package.json
- Проверьте, что `sideEffects` правильно настроен

## Будущие улучшения

1. Добавить автоматическую генерацию exports при добавлении компонентов
2. Настроить CI/CD для автоматической публикации
3. Добавить visual regression testing
4. Создать playground для тестирования компонентов
5. Добавить больше компонентов (Input, Select, Modal и т.д.)
