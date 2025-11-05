import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './Text.module.scss';

/**
 * Типы вариантов текста
 */
export type TextVariant = 'title' | 'body' | 'secondary' | 'caption' | 'tiny';

/**
 * Типы цветов текста
 */
export type TextColor = 'default' | 'contrast' | 'brand';

/**
 * Типы переполнения текста
 */
export type TextOverflow = 'ellipsis';

export interface TextProps extends PropsWithChildren {
  /**
   * Вариант текста (размер и стиль)
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Цвет текста
   * @default 'default'
   */
  color?: TextColor;

  /**
   * Преобразовать текст в прописные буквы
   */
  isUppercase?: boolean;

  /**
   * Обрезать текст с многоточием при переполнении
   */
  textOverflow?: TextOverflow;

  /**
   * Отображать с иконкой (использует flexbox layout)
   */
  withIcon?: boolean;

  /**
   * Применить курсивный стиль
   */
  isItalic?: boolean;
}

/**
 * Компонент Text для отображения текста с разными стилями и размерами
 *
 * @example
 * ```tsx
 * // Заголовок
 * <Text variant="title">Мой заголовок</Text>
 *
 * // Обычный текст с брендовым цветом
 * <Text color="brand">Важный текст</Text>
 *
 * // Текст с иконкой
 * <Text variant="caption" withIcon>
 *   <Icon name="check" />
 *   Выполнено
 * </Text>
 *
 * // Обрезанный текст
 * <Text textOverflow="ellipsis">Очень длинный текст...</Text>
 * ```
 */
export const Text: FC<TextProps> = ({
  variant = 'body',
  color = 'default',
  isUppercase,
  textOverflow,
  children,
  withIcon,
  isItalic,
}) => {
  const className = cn(styles.root, {
    [styles.title]: variant === 'title',
    [styles.body]: variant === 'body',
    [styles.secondary]: variant === 'secondary',
    [styles.tiny]: variant === 'tiny',
    [styles.caption]: variant === 'caption',
    [styles.uppercase]: isUppercase,
    [styles.ellipsis]: textOverflow === 'ellipsis',
    [styles[`color_${color}`]]: Boolean(color) && color !== 'default',
    [styles.withIcon]: withIcon,
    [styles.isItalic]: isItalic,
  });

  // Render as appropriate semantic HTML element
  switch (variant) {
    case 'title':
      return <h1 className={className}>{children}</h1>;
    case 'caption':
      return <h3 className={className}>{children}</h3>;
    case 'secondary':
      return <span className={className}>{children}</span>;
    case 'tiny':
      return <span className={className}>{children}</span>;
    default:
    case 'body':
      return <p className={className}>{children}</p>;
  }
};

Text.displayName = 'Text';
