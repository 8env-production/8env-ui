import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

import cn from 'classnames';

import styles from './UserPic.module.scss';

const SIZE_MAP = {
  sm: '1.5rem',
  md: '2rem',
  lg: '2.5rem',
  xl: '3rem',
} as const;

export type UserPicSize = keyof typeof SIZE_MAP;

type NativeAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type NativeDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface UserPicBaseProps {
  /**
   * URL изображения пользователя
   */
  imgUrl: string;
  /**
   * Размер аватара
   * @default 'md'
   */
  size?: UserPicSize | number | string;
  /**
   * Альтернативный текст для accessibility
   * @default 'Аватар пользователя'
   */
  alt?: string;
  /**
   * Дополнительный CSS-класс
   */
  className?: string;
}

export type UserPicAsLinkProps = UserPicBaseProps &
  Omit<NativeAnchorProps, keyof UserPicBaseProps | 'children'> & {
    /**
     * URL для навигации (если указан, компонент станет ссылкой)
     */
    href: string;
    /**
     * Target для ссылки
     */
    target?: '_blank' | '_self' | '_parent' | '_top';
  };

export type UserPicAsDivProps = UserPicBaseProps &
  Omit<NativeDivProps, keyof UserPicBaseProps | 'children' | 'href'> & {
    /**
     * URL для навигации
     */
    href?: never;
    /**
     * Target для ссылки
     */
    target?: never;
  };

export type UserPicProps = UserPicAsLinkProps | UserPicAsDivProps;

const resolveSize = (size: UserPicBaseProps['size']): string => {
  if (typeof size === 'number') {
    return `${size}px`;
  }

  if (typeof size === 'string' && size in SIZE_MAP) {
    return SIZE_MAP[size as UserPicSize];
  }

  return (size as string | undefined) ?? SIZE_MAP.md;
};

/**
 * Компонент для отображения аватара пользователя.
 * Может работать как ссылка или статичный элемент.
 *
 * @example
 * ```tsx
 * // Статичный аватар
 * <UserPic imgUrl="https://example.com/avatar.jpg" />
 *
 * // Аватар-ссылка
 * <UserPic
 *   imgUrl="https://example.com/avatar.jpg"
 *   href="/profile"
 * />
 *
 * // Аватар с кастомным размером
 * <UserPic
 *   imgUrl="https://example.com/avatar.jpg"
 *   size="lg"
 * />
 * ```
 */
export const UserPic = forwardRef<HTMLAnchorElement | HTMLDivElement, UserPicProps>(
  (props, ref) => {
    const { imgUrl, size = 'md', alt = 'Аватар пользователя', className, ...restProps } = props;

    const resolvedSize = resolveSize(size);
    const isLink = 'href' in props && Boolean(props.href);

    const classNames = cn(styles.root, className);

    const style = {
      backgroundImage: `url("${imgUrl}")`,
      '--user-pic-size': resolvedSize,
    } as React.CSSProperties;

    const commonProps = {
      className: classNames,
      style,
      'aria-label': alt,
    };

    if (isLink) {
      const { href, target, rel, ...anchorProps } = restProps as Omit<
        UserPicAsLinkProps,
        keyof UserPicBaseProps
      >;
      const relValue = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={relValue}
          {...commonProps}
          {...anchorProps}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="img"
        {...commonProps}
        {...(restProps as Omit<UserPicAsDivProps, keyof UserPicBaseProps>)}
      />
    );
  }
);

UserPic.displayName = 'UserPic';
