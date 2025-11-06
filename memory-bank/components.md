# Документация по компонентам UI библиотеки

Эта документация описывает доступные компоненты UI библиотеки. Каждый компонент включает описание, ключевые props (с типами, значениями по умолчанию и описаниями) и пример использования. Формат оптимизирован для быстрого парсинга ИИ-агентами: props представлены в табличном виде для ясности.

## Button

**Описание:** Универсальный компонент кнопки, поддерживает режимы button и link (если указан href). Варианты стилей: action, success, flat и т.д.

**Props:**

| Prop                             | Type                                                                        | Default   | Description                                              |
| -------------------------------- | --------------------------------------------------------------------------- | --------- | -------------------------------------------------------- |
| view                             | `ButtonView` ('action' \| 'success' \| 'flat' \| ... \| 'outlined-success') | 'default' | Вариант отображения кнопки                               |
| isIcon                           | boolean                                                                     | false     | Отображать как иконку (квадратная форма)                 |
| fullWidth                        | boolean                                                                     | false     | Растянуть на всю ширину контейнера                       |
| withEllipsis                     | boolean                                                                     | false     | Обрезать текст с многоточием при переполнении            |
| textAlign                        | 'left' \| 'center'                                                          | -         | Выравнивание текста                                      |
| withoutAnimation                 | boolean                                                                     | false     | Отключить анимацию при клике                             |
| noPaddings                       | boolean                                                                     | false     | Убрать внутренние отступы                                |
| children                         | React.ReactNode                                                             | -         | Содержимое кнопки                                        |
| href                             | string                                                                      | -         | URL для навигации (если указан, кнопка станет ссылкой)   |
| target                           | '\_blank' \| '\_self' \| ...                                                | -         | Target для ссылки                                        |
| ... (native button/anchor props) | -                                                                           | -         | Стандартные props для button или anchor, кроме className |

**Пример:**

```tsx
<Button view="action" onClick={() => console.log('clicked')}>Нажми меня</Button>
<Button view="outlined" href="/about">О нас</Button>
<Button view="flat" isIcon><Icon name="close" /></Button>
```

## Icon

**Описание:** Контейнер для иконок с поддержкой размеров и accessibility.

**Props:**

| Prop                                  | Type                           | Default | Description                         |
| ------------------------------------- | ------------------------------ | ------- | ----------------------------------- |
| size                                  | `IconSize` ('s' \| 'm' \| 'l') | 'm'     | Размер иконки                       |
| children                              | ReactNode                      | -       | Содержимое (SVG или другой элемент) |
| ... (HTMLAttributes<HTMLSpanElement>) | -                              | -       | Стандартные HTML-атрибуты для span  |

**Пример:**

```tsx
<Icon size="m">
  <svg viewBox="0 0 24 24">...</svg>
</Icon>
```

## Loader

**Описание:** Индикатор загрузки с анимацией вращения, поддержкой размеров и цветов.

**Props:**

| Prop                                 | Type                                                      | Default     | Description                         |
| ------------------------------------ | --------------------------------------------------------- | ----------- | ----------------------------------- |
| size                                 | `LoaderSize` ('s' \| 'm' \| 'l' \| 'xl')                  | 'm'         | Размер индикатора                   |
| variant                              | `LoaderVariant` ('brand' \| 'neutral' \| ... \| 'danger') | 'brand'     | Цветовая схема                      |
| paused                               | boolean                                                   | false       | Приостановить анимацию              |
| label                                | string                                                    | 'Загрузка…' | Текстовое описание для скринридеров |
| ... (HTMLAttributes<HTMLDivElement>) | -                                                         | -           | Стандартные HTML-атрибуты           |

**Пример:**

```tsx
<Loader size="l" variant="success" />
```

## Logo

**Описание:** Корпоративный логотип 8env, может быть ссылкой или статичным элементом.

**Props:**

| Prop                           | Type                                                 | Default        | Description                                     |
| ------------------------------ | ---------------------------------------------------- | -------------- | ----------------------------------------------- |
| size                           | `LogoSize` ('xs' \| ... \| 'xl') \| number \| string | 'md'           | Размер логотипа                                 |
| bordered                       | boolean                                              | true           | Добавляет скругление                            |
| withShadow                     | boolean                                              | true           | Управляет отображением тени                     |
| ariaLabel                      | string                                               | 'Логотип 8env' | Текст для вспомогательных технологий            |
| href                           | string                                               | -              | URL для навигации (если указан, станет ссылкой) |
| ... (native anchor/span props) | -                                                    | -              | Стандартные props для a или span                |

**Пример:**

```tsx
<Logo size="lg" href="/" />
<Logo size="md" />  // Статичный
```

## Modal

**Описание:** Модальное окно с оверлеем, фокус-траппингом и поддержкой размеров.

**Props:**

| Prop                     | Type                                  | Default                  | Description                  |
| ------------------------ | ------------------------------------- | ------------------------ | ---------------------------- |
| isOpen                   | boolean                               | -                        | Открыто ли модальное окно    |
| onClose                  | () => void                            | -                        | Колбэк закрытия              |
| title                    | ReactNode                             | -                        | Заголовок                    |
| description              | ReactNode                             | -                        | Подзаголовок                 |
| footer                   | ReactNode                             | -                        | Подвал (кнопки)              |
| header                   | ReactNode                             | -                        | Кастомный хедер              |
| size                     | `ModalSize` ('auto' \| ... \| 'full') | 'auto'                   | Размер модального окна       |
| closeOnOverlayClick      | boolean                               | true                     | Закрытие по клику на оверлей |
| closeOnEsc               | boolean                               | true                     | Закрытие по Escape           |
| disableBodyScroll        | boolean                               | true                     | Блокировать прокрутку body   |
| hideCloseButton          | boolean                               | false                    | Скрыть кнопку закрытия       |
| closeButtonLabel         | string                                | 'Закрыть модальное окно' | Метка для кнопки закрытия    |
| children                 | ReactNode                             | -                        | Содержимое body              |
| ... (className variants) | string                                | -                        | Дополнительные классы        |

**Пример:**

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Заголовок">
  Содержимое модала
</Modal>
```

## Navigation

**Описание:** Боковая навигация с секциями для логотипа, верхних/нижних элементов и акцента.

**Props:**

| Prop                 | Type                    | Default | Description               |
| -------------------- | ----------------------- | ------- | ------------------------- |
| logo                 | ReactNode               | -       | Логотип                   |
| topItems             | ReactNode[]             | -       | Верхние элементы (массив) |
| bottomItems          | ReactNode[]             | -       | Нижние элементы (массив)  |
| accent               | ReactNode               | -       | Кастомный акцент (SVG)    |
| accentProps          | SVGProps<SVGSVGElement> | -       | Props для акцента         |
| ariaLabel            | string                  | -       | ARIA-метка                |
| ... (HTMLAttributes) | -                       | -       | Стандартные props для nav |

**Пример:**

```tsx
<Navigation
  logo={<Logo />}
  topItems={[<Button key="1">Item1</Button>]}
  bottomItems={<UserPic imgUrl="..." />}
/>
```

## Preview

**Описание:** Компонент предпросмотра с iframe, кнопками управления (close, edit, open) и адресной строкой.

**Props:**

| Prop      | Type       | Default | Description           |
| --------- | ---------- | ------- | --------------------- |
| url       | string     | -       | URL для предпросмотра |
| onClose   | () => void | -       | Колбэк закрытия       |
| onEdit    | () => void | -       | Колбэк редактирования |
| onOpen    | () => void | -       | Колбэк открытия       |
| className | string     | -       | Дополнительный класс  |

**Пример:**

```tsx
<Preview url="https://example.com" onClose={handleClose} onEdit={handleEdit} />
```

## ResizableDiv

**Описание:** Изменяемый по ширине div с ресайзером (мышь/клавиатура), поддержкой persistence.

**Props:**

| Prop                 | Type                    | Default | Description                   |
| -------------------- | ----------------------- | ------- | ----------------------------- |
| initialWidth         | number                  | 30      | Начальная ширина (%)          |
| minWidth             | number                  | 10      | Минимальная ширина (%)        |
| maxWidth             | number                  | 90      | Максимальная ширина (%)       |
| onWidthChange        | (width: number) => void | -       | Колбэк изменения ширины       |
| onResizeStart        | () => void              | -       | Колбэк начала ресайза         |
| onResizeEnd          | () => void              | -       | Колбэк конца ресайза          |
| disabled             | boolean                 | false   | Отключить ресайз              |
| keyboardStep         | number                  | 1       | Шаг изменения по клавишам (%) |
| persistenceKey       | string                  | -       | Ключ для localStorage         |
| resizerPosition      | 'left' \| 'right'       | 'right' | Позиция ресайзера             |
| children             | ReactNode               | -       | Содержимое                    |
| ... (HTMLAttributes) | -                       | -       | Стандартные props для div     |

**Пример:**

```tsx
<ResizableDiv initialWidth={25} onWidthChange={handleChange}>
  Содержимое
</ResizableDiv>
```

## SolidLoader

**Описание:** Оверлей с Loader поверх содержимого при загрузке.

**Props:**

| Prop      | Type      | Default | Description          |
| --------- | --------- | ------- | -------------------- |
| isLoading | boolean   | -       | Показывать loader    |
| children  | ReactNode | -       | Содержимое           |
| className | string    | -       | Дополнительный класс |

**Пример:**

```tsx
<SolidLoader isLoading={loading}>
  <div>Содержимое</div>
</SolidLoader>
```

## Tabs

**Описание:** Вкладки с поддержкой controlled/uncontrolled режимов, вариантами стилей.

**Props (для Tabs):**

| Prop         | Type                                | Default   | Description                       |
| ------------ | ----------------------------------- | --------- | --------------------------------- |
| defaultValue | string                              | ''        | Начальное значение (uncontrolled) |
| value        | string                              | -         | Текущее значение (controlled)     |
| onChange     | (value: string) => void             | -         | Колбэк изменения                  |
| variant      | 'default' \| 'pills' \| 'underline' | 'default' | Стиль вкладок                     |
| size         | 'small' \| 'medium' \| 'large'      | 'medium'  | Размер                            |
| fullWidth    | boolean                             | false     | Полная ширина                     |
| children     | ReactNode                           | -         | Tab элементы                      |

**Props (для Tab):**

| Prop     | Type      | Default | Description       |
| -------- | --------- | ------- | ----------------- |
| label    | string    | -       | Метка вкладки     |
| value    | string    | -       | Значение вкладки  |
| disabled | boolean   | false   | Отключить вкладку |
| children | ReactNode | -       | Содержимое панели |

**Пример:**

```tsx
<Tabs defaultValue="tab1" onChange={handleChange}>
  <Tab label="Tab 1" value="tab1">
    Содержимое 1
  </Tab>
  <Tab label="Tab 2" value="tab2">
    Содержимое 2
  </Tab>
</Tabs>
```

## Text

**Описание:** Компонент для текста с вариантами стилей, цветов и overflow.

**Props:**

| Prop         | Type                                               | Default   | Description      |
| ------------ | -------------------------------------------------- | --------- | ---------------- |
| variant      | `TextVariant` ('title' \| 'body' \| ... \| 'tiny') | 'body'    | Вариант текста   |
| color        | `TextColor` ('default' \| 'contrast' \| 'brand')   | 'default' | Цвет текста      |
| isUppercase  | boolean                                            | false     | Прописные буквы  |
| textOverflow | `TextOverflow` ('ellipsis')                        | -         | Обрезание текста |
| withIcon     | boolean                                            | false     | С иконкой (flex) |
| isItalic     | boolean                                            | false     | Курсив           |
| children     | ReactNode                                          | -         | Текст            |

**Пример:**

```tsx
<Text variant="title" color="brand">Заголовок</Text>
<Text variant="caption" withIcon><Icon /> Текст</Text>
```

## TextArea

**Описание:** Многострочное поле ввода с авторесайзом, поддержкой Ctrl+Enter.

**Props:**

| Prop                        | Type       | Default | Description                                                  |
| --------------------------- | ---------- | ------- | ------------------------------------------------------------ |
| label                       | ReactNode  | -       | Метка                                                        |
| onSubmit                    | () => void | -       | Колбэк отправки (Ctrl+Enter)                                 |
| autoResize                  | boolean    | true    | Автоизменение высоты                                         |
| minHeight                   | number     | 200     | Минимальная высота (px)                                      |
| ... (native textarea props) | -          | -       | Стандартные props для textarea, кроме id/className/onKeyDown |

**Пример:**

```tsx
<TextArea label="Комментарий" onSubmit={handleSubmit} placeholder="Текст..." />
```

## TextInput

**Описание:** Однострочное поле ввода с меткой.

**Props:**

| Prop                     | Type      | Default | Description                                     |
| ------------------------ | --------- | ------- | ----------------------------------------------- |
| label                    | ReactNode | -       | Метка                                           |
| ... (native input props) | -         | -       | Стандартные props для input, кроме id/className |

**Пример:**

```tsx
<TextInput label="Имя" placeholder="Введите имя" type="text" />
```

## UserPic

**Описание:** Аватар пользователя, может быть ссылкой.

**Props:**

| Prop                          | Type                                                    | Default               | Description                       |
| ----------------------------- | ------------------------------------------------------- | --------------------- | --------------------------------- |
| imgUrl                        | string                                                  | -                     | URL изображения                   |
| size                          | `UserPicSize` ('sm' \| ... \| 'xl') \| number \| string | 'md'                  | Размер                            |
| alt                           | string                                                  | 'Аватар пользователя' | Альтернативный текст              |
| href                          | string                                                  | -                     | URL (если указан, станет ссылкой) |
| ... (native anchor/div props) | -                                                       | -                     | Стандартные props для a или div   |

**Пример:**

```tsx
<UserPic imgUrl="https://example.com/avatar.jpg" size="lg" href="/profile" />
<UserPic imgUrl="https://example.com/avatar.jpg" />  // Статичный
```
