# CSS Modules в @8env-ui/components

## Зачем CSS Modules?

CSS Modules решают проблему конфликтов стилей, автоматически генерируя уникальные имена классов. Вместо глобальных `.button`, `.card`, получаются уникальные `.__8env-ui__Button-module__button`.

## Преимущества

- ✅ Нет конфликтов с глобальными стилями
- ✅ Не требуется ручное добавление префиксов
- ✅ Автоматическая изоляция стилей
- ✅ Поддержка TypeScript из коробки
- ✅ Работает как в development, так и в production

## Создание компонента с CSS Modules

### 1. Создайте файл стилей с расширением `.module.scss`

```scss
// src/components/Card/Card.module.scss
.card {
  padding: 20px;
  border-radius: 8px;
  background: white;

  &--elevated {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
}
```

### 2. Импортируйте стили в компоненте

```tsx
// src/components/Card/Card.tsx
import React from 'react';

import styles from './Card.module.scss';

export interface CardProps {
  title: string;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, elevated = false }) => {
  return (
    <div className={`${styles.card} ${elevated ? styles['card--elevated'] : ''}`}>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
};
```

## Правила именования классов

### В SCSS используйте kebab-case:

```scss
.my-component {
  // стили
}

.my-component--variant {
  // модификатор
}

.my-component__element {
  // элемент
}
```

### В TypeScript доступны два способа:

```tsx
// 1. Kebab-case с квадратными скобками
styles['my-component'];
styles['my-component--variant'];

// 2. CamelCase через точку (если имя без дефисов)
styles.myComponent;
styles.myComponentVariant;
```

Благодаря настройке `localsConvention: 'dashes'` оба варианта работают!

## Динамические классы

```tsx
// Рекомендуемый способ
const Button = ({ variant, size }) => {
  return (
    <button className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]}`}>
      Click me
    </button>
  );
};

// Или используйте библиотеку classnames
import classNames from 'classnames';

const Button = ({ variant, size, disabled }) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        { [styles.disabled]: disabled }
      )}
    >
      Click me
    </button>
  );
};
```

## TypeScript типы

Типы для CSS Modules уже настроены в `src/types/css-modules.d.ts`. Все `.module.scss` файлы автоматически получают типизацию.

## Конфигурация

Конфигурация CSS Modules вынесена в единый файл [`css-modules.config.ts`](../css-modules.config.ts), который используется и для сборки, и для Storybook:

### css-modules.config.ts

```typescript
import type { CSSModulesOptions } from 'vite';

/**
 * Единая конфигурация CSS модулей для Vite и Storybook
 *
 * Формат имен классов: __8env-ui__[ComponentName]__[className]
 */
export const cssModulesConfig: CSSModulesOptions = {
  localsConvention: 'dashes', // Поддержка kebab-case и camelCase
  generateScopedName: '__8env-ui__[name]__[local]',
};
```

**Формат имен классов:** `__8env-ui__[ComponentName]__[className]`

**Примеры генерируемых классов:**

- `.button` → `.__8env-ui__Button-module__button`
- `.button--primary` → `.__8env-ui__Button-module__button--primary`
- `.card__header` → `.__8env-ui__Card-module__card__header`

Префикс `__8env-ui__` обеспечивает уникальность и предотвращает конфликты с другими библиотеками.

### vite.config.ts

```typescript
import { cssModulesConfig } from './css-modules.config';

export default defineConfig({
  css: {
    modules: cssModulesConfig,
  },
});
```

### .storybook/main.ts

```typescript
import { cssModulesConfig } from '../css-modules.config';

async viteFinal(config) {
  return mergeConfig(config, {
    css: {
      modules: cssModulesConfig,
    },
  });
}
```

**Преимущества единой конфигурации:**

- ✅ Один источник истины для настроек CSS Modules
- ✅ Гарантированная идентичность в development и production
- ✅ Легче поддерживать и обновлять
- ✅ Нет дублирования кода между Vite и Storybook

## Пример полного компонента

```tsx
// Card.module.scss
.card {
  padding: 20px;
  border: 1px solid #e0e0e0;

  &--primary {
    border-color: #007bff;
  }

  &--large {
    padding: 30px;
  }
}

.header {
  margin-bottom: 16px;
}

// Card.tsx
import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  variant?: 'default' | 'primary';
  size?: 'medium' | 'large';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'medium',
  children,
}) => {
  const variantClass = variant !== 'default' ? styles[`card--${variant}`] : '';
  const sizeClass = size !== 'medium' ? styles[`card--${size}`] : '';

  return (
    <div className={`${styles.card} ${variantClass} ${sizeClass}`.trim()}>
      <div className={styles.header}>Header</div>
      {children}
    </div>
  );
};
```

## Частые ошибки

### ❌ Забыли .module в имени файла

```tsx
import styles from './Button.scss';

// Неправильно!
```

### ✅ Правильно

```tsx
import styles from './Button.module.scss';

// Правильно!
```

### ❌ Используете глобальные классы

```tsx
<button className="button button--primary"> // Неправильно!
```

### ✅ Правильно

```tsx
<button className={`${styles.button} ${styles['button--primary']}`}> // Правильно!
```

## Отладка

### Проверить сгенерированные имена классов

В браузере откройте DevTools и посмотрите на классы элементов. Они должны выглядеть как:

```
__8env-ui__Button-module__button
__8env-ui__Button-module__button--primary
__8env-ui__Card-module__card
```

Префикс `__8env-ui__` обеспечивает уникальность и предотвращает конфликты с другими библиотеками.

### Если стили не применяются

1. Проверьте, что файл называется `.module.scss`
2. Убедитесь, что импорт правильный: `import styles from './Component.module.scss'`
3. Проверьте, что используете `styles.className` или `styles['class-name']`
4. Перезапустите dev-сервер или Storybook

## Миграция существующих компонентов

1. Переименуйте `Component.scss` → `Component.module.scss`
2. Обновите импорт: `import './Component.scss'` → `import styles from './Component.module.scss'`
3. Замените классы: `className="button"` → `className={styles.button}`
4. Пересоберите проект: `npm run build`
5. Проверьте в Storybook: `npm run storybook`
