# ResizableDiv Component

Компонент `ResizableDiv` предоставляет контейнер с возможностью изменения ширины путем перетаскивания элемента управления на правой границе.

## Основные возможности

- ✅ Изменение размера мышью (drag & drop)
- ✅ Клавиатурное управление (стрелки влево/вправо)
- ✅ Настраиваемые ограничения размера
- ✅ Колбэки для отслеживания изменений
- ✅ Поддержка accessibility (ARIA)
- ✅ Адаптивный дизайн
- ✅ TypeScript поддержка
- ✅ Возможность отключения

## Установка и импорт

```tsx
import { ResizableDiv } from '@/shared/components/ResizableDiv';
// или
import ResizableDiv from '@/shared/components/ResizableDiv';
```

## Базовое использование

```tsx
import React from 'react';

import { ResizableDiv } from '@/shared/components/ResizableDiv';

const MyComponent = () => {
    return (
        <ResizableDiv>
            <div>Содержимое панели</div>
        </ResizableDiv>
    );
};
```

## Расширенное использование

```tsx
import React, { useState } from 'react';

import { ResizableDiv } from '@/shared/components/ResizableDiv';

const AdvancedExample = () => {
    const [width, setWidth] = useState(30);

    return (
        <ResizableDiv
            initialWidth={25}
            minWidth={15}
            maxWidth={85}
            keyboardStep={2}
            onWidthChange={(newWidth) => {
                setWidth(newWidth);
                console.log('Новая ширина:', newWidth);
            }}
            onResizeStart={(width) => {
                console.log('Начало изменения размера:', width);
            }}
            onResizeEnd={(width) => {
                console.log('Завершение изменения размера:', width);
            }}
            style={{ backgroundColor: '#f5f5f5' }}
        >
            <div>
                <h3>Панель настроек</h3>
                <p>Текущая ширина: {width}%</p>
            </div>
        </ResizableDiv>
    );
};
```

## API

### Props

| Prop            | Тип                       | По умолчанию | Описание                                           |
| --------------- | ------------------------- | ------------ | -------------------------------------------------- |
| `initialWidth`  | `number`                  | `30`         | Начальная ширина в процентах                       |
| `minWidth`      | `number`                  | `10`         | Минимальная ширина в процентах                     |
| `maxWidth`      | `number`                  | `90`         | Максимальная ширина в процентах                    |
| `keyboardStep`  | `number`                  | `1`          | Шаг изменения размера при использовании клавиатуры |
| `disabled`      | `boolean`                 | `false`      | Отключить возможность изменения размера            |
| `onWidthChange` | `(width: number) => void` | -            | Колбэк при изменении ширины                        |
| `onResizeStart` | `(width: number) => void` | -            | Колбэк при начале изменения размера                |
| `onResizeEnd`   | `(width: number) => void` | -            | Колбэк при завершении изменения размера            |
| `style`         | `React.CSSProperties`     | -            | Дополнительные стили для контейнера                |
| `className`     | `string`                  | -            | CSS класс для содержимого                          |

### Управление

#### Мышью

- Наведите курсор на правую границу панели
- Нажмите и удерживайте левую кнопку мыши
- Перетащите для изменения ширины
- Отпустите кнопку мыши для завершения

#### Клавиатурой

- Установите фокус на элемент управления (Tab)
- Используйте стрелки влево/вправо для изменения ширины
- Размер шага настраивается через prop `keyboardStep`

## Accessibility

Компонент полностью поддерживает стандарты доступности:

- `role="separator"` - определяет элемент как разделитель
- `aria-label` - описание назначения элемента
- `aria-valuemin/max/now` - текущие значения и ограничения
- `aria-orientation="vertical"` - ориентация элемента управления
- `tabIndex` - поддержка клавиатурной навигации

## Стилизация

Компонент использует CSS модули. Основные классы:

- `.resizable` - основной контейнер
- `.resizer` - элемент управления изменением размера
- `.resizerIcon` - иконка элемента управления

### Кастомизация через CSS переменные

```css
:root {
    --color-brand: #007bff;
    --color-brand-light: rgba(0, 123, 255, 0.1);
    --color-brand-focus: rgba(0, 123, 255, 0.3);
    --border-main-color: #dee2e6;
}
```

## Хуки

Компонент предоставляет несколько хуков для расширенного использования:

### `useResizeState`

```tsx
import { useResizeState } from '@/shared/components/ResizableDiv';

const { width, updateWidth, startResize, stopResize } = useResizeState(
    30, // начальная ширина
    { minWidth: 10, maxWidth: 90 }, // ограничения
    { onWidthChange: (w) => console.log(w) }, // колбэки
    1 // шаг клавиатуры
);
```

### `useMouseEvents`

```tsx
import { useMouseEvents } from '@/shared/components/ResizableDiv';

const mouseEvents = useMouseEvents(resizeState, rootRef);
```

## Примеры использования

### Боковая панель

```tsx
const Sidebar = () => (
    <ResizableDiv
        initialWidth={20}
        minWidth={15}
        maxWidth={40}
        className="sidebar"
    >
        <nav>
            <ul>
                <li>Пункт меню 1</li>
                <li>Пункт меню 2</li>
            </ul>
        </nav>
    </ResizableDiv>
);
```

### Панель инструментов

```tsx
const ToolPanel = () => (
    <ResizableDiv
        initialWidth={25}
        minWidth={20}
        maxWidth={50}
        onWidthChange={(width) => {
            localStorage.setItem('toolPanelWidth', width.toString());
        }}
    >
        <div className="tools">
            <button>Инструмент 1</button>
            <button>Инструмент 2</button>
        </div>
    </ResizableDiv>
);
```

## Исправленные баги

В процессе доработки были исправлены следующие критические баги:

1. **Неправильный расчет процентов** - исправлена логика вычисления ширины относительно родительского элемента
2. **Утечка памяти** - добавлена правильная очистка event listeners
3. **Некорректные границы** - исправлена логика применения ограничений minWidth/maxWidth
4. **Отсутствие обработки ошибок** - добавлены try-catch блоки и проверки существования элементов
5. **Проблемы с типизацией** - улучшена типизация всех компонентов

## Производительность

- Используются `useCallback` для предотвращения лишних ререндеров
- Event listeners добавляются только один раз при монтировании
- Состояние обновляется только при реальном изменении значений
- Применяется debouncing для плавности анимаций
