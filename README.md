# @8env-ui/components

UI библиотека компонентов для React приложений с полной поддержкой TypeScript и автоматическим tree-shaking.

## 📦 Использование в проекте

### Установка

Если библиотека опубликована в npm:

```bash
npm install @8env-ui/components
```

Или через yarn:

```bash
yarn add @8env-ui/components
```

### Использование локальной версии (для разработки)

В директории библиотеки выполните:

```bash
npm run build
npm link
```

Затем в вашем React проекте:

```bash
npm link @8env-ui/components
```

### Импорт компонентов

Библиотека использует **принудительный tree-shaking** - каждый компонент импортируется отдельно:

```tsx
// Импорт компонента Button
import { Button, ButtonProps } from '@8env-ui/components/button';
// Импорт стилей компонента
import '@8env-ui/components/button/styles';

function App() {
  return (
    <div>
      <Button label="Нажми меня" variant="primary" size="medium" />
    </div>
  );
}

export default App;
```

### TypeScript

Библиотека полностью поддерживает TypeScript и автоматически предоставляет типы:

```tsx
import { Button, ButtonProps } from '@8env-ui/components/button';
import '@8env-ui/components/button/styles';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Доступные компоненты

- **Button**: `@8env-ui/components/button`
  - Стили: `@8env-ui/components/button/styles`

> **Важно:** Корневой импорт `@8env-ui/components` намеренно отключен для обеспечения оптимального размера бандла. Вы должны импортировать каждый компонент отдельно.

## 🚀 Возможности для разработчиков

- ⚛️ React 19 с поддержкой TypeScript
- 📚 Storybook для разработки и документации компонентов
- 🧪 Jest и React Testing Library для unit-тестов
- 💅 Prettier для форматирования кода
- 🔍 ESLint для проверки качества кода
- 🪝 Husky и lint-staged для pre-commit hooks

## 📦 Установка зависимостей

```bash
npm install
```

### Сборка библиотеки

Для создания production сборки:

```bash
npm run build
```

Это создаст директорию `dist/` со скомпилированными файлами и автоматически скопирует CSS файлы.

## 🛠️ Разработка компонентов

### Запуск Storybook

Для разработки компонентов используйте Storybook:

```bash
npm run storybook
```

Storybook будет доступен по адресу http://localhost:6006

### Сборка Storybook

Для создания статической версии Storybook:

```bash
npm run build-storybook
```

## 🧪 Тестирование

### Запуск тестов

```bash
npm test
```

### Запуск тестов в watch режиме

```bash
npm run test:watch
```

### Проверка покрытия тестами

```bash
npm run test:coverage
```

## 💅 Форматирование и линтинг

### Форматирование кода

```bash
npm run format
```

### Проверка форматирования

```bash
npm run format:check
```

### Линтинг

```bash
npm run lint
```

### Автоматическое исправление ошибок линтинга

```bash
npm run lint:fix
```

## 📁 Структура проекта

```
8env-ui/
├── .husky/                 # Git hooks
├── .storybook/            # Конфигурация Storybook
├── src/
│   ├── components/        # Компоненты библиотеки
│   │   └── Button/
│   │       ├── Button.tsx          # Компонент
│   │       ├── Button.css          # Стили
│   │       ├── Button.test.tsx     # Тесты
│   │       ├── Button.stories.tsx  # Storybook story
│   │       └── index.ts            # Точка входа компонента
├── .eslintrc.cjs          # Конфигурация ESLint
├── .prettierrc            # Конфигурация Prettier
├── jest.config.js         # Конфигурация Jest
├── tsconfig.json          # Конфигурация TypeScript
└── package.json
```

## 🎨 Создание нового компонента

1. Создайте директорию для компонента в `src/components/`:

```bash
mkdir -p src/components/MyComponent
```

2. Создайте файлы компонента:
   - `MyComponent.tsx` - сам компонент
   - `MyComponent.css` - стили
   - `MyComponent.test.tsx` - тесты
   - `MyComponent.stories.tsx` - Storybook story
   - `index.ts` - точка входа компонента

3. Создайте `index.ts` в директории компонента:

```typescript
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

4. Добавьте экспорт в `package.json`:

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

## 📝 Пример компонента

```typescript
// MyComponent.tsx
import React from 'react';
import './MyComponent.css';

export interface MyComponentProps {
  text: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ text }) => {
  return <div className="my-component">{text}</div>;
};
```

## 🔧 Технологический стек

- **React** 19.2.0 - UI библиотека
- **TypeScript** 5.9.3 - Типизация
- **Storybook** 8.6.14 - Разработка и документация компонентов
- **Jest** 30.2.0 - Тестирование
- **React Testing Library** 16.3.0 - Тестирование React компонентов
- **ESLint** 9.39.0 - Проверка качества кода
- **Prettier** 3.6.2 - Форматирование кода
- **Husky** 9.1.7 - Git hooks
- **lint-staged** 16.2.6 - Запуск линтеров на staged файлах

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

При коммите автоматически запустятся:

- ESLint для проверки кода
- Prettier для форматирования
- Тесты (если настроено)

## 📄 Лицензия

ISC

## 👤 Автор

GitHub: [@8env-production](https://github.com/8env-production)
