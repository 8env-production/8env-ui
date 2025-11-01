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
│           ├── Button.css          # Стили
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
tsc -p tsconfig.build.json && npm run copy-styles
```

1. Компилирует TypeScript в JavaScript
2. Генерирует .d.ts файлы для TypeScript типов
3. Копирует CSS файлы с сохранением структуры

### Копирование стилей (macOS)

```bash
find src -name '*.css' -exec sh -c 'mkdir -p dist/$(dirname ${1#src/}) && cp $1 dist/${1#src/}' _ {} \;
```

Эта команда:

- Находит все CSS файлы в src/
- Создаёт соответствующие директории в dist/
- Копирует файлы с сохранением структуры директорий

## Добавление нового компонента

### Шаг 1: Создать структуру файлов

```bash
mkdir -p src/components/MyComponent
```

Создать файлы:

- `MyComponent.tsx` - сам компонент
- `MyComponent.css` - стили
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

### Шаг 4: Пересобрать библиотеку

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

### CSS не копируется

- Проверьте скрипт `copy-styles` в package.json
- Для macOS используется специальная команда (см. выше)

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
