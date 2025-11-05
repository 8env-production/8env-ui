import {
  AnchorHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  ForwardedRef,
  HTMLAttributes,
  forwardRef,
  useId,
} from 'react';

import cn from 'classnames';

import styles from './Logo.module.scss';

const SIZE_MAP = {
  xs: '1.5rem',
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
  xl: '3.5rem',
} as const;

export type LogoSize = keyof typeof SIZE_MAP;

export interface LogoBaseProps {
  /**
   * Размер логотипа. Можно передать ключ предустановленного размера или любое CSS-значение.
   * @default 'md'
   */
  size?: LogoSize | number | string;
  /**
   * Добавляет скругление контейнеру логотипа.
   * @default true
   */
  bordered?: boolean;
  /**
   * Управляет отображением тени.
   * @default true
   */
  withShadow?: boolean;
  /**
   * Текст для вспомогательных технологий.
   * @default 'Логотип 8env'
   */
  ariaLabel?: string;
  /**
   * Дополнительный CSS-класс.
   */
  className?: string;
  /**
   * Инлайновые стили контейнера.
   */
  style?: CSSProperties;
}

type NativeAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type NativeSpanProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

export type LogoAsLinkProps = LogoBaseProps &
  Omit<NativeAnchorProps, keyof LogoBaseProps | 'children'> & {
    href: string;
  };

export type LogoAsSpanProps = LogoBaseProps &
  Omit<NativeSpanProps, keyof LogoBaseProps | 'children' | 'href'> & {
    href?: undefined;
  };

export type LogoProps = LogoAsLinkProps | LogoAsSpanProps;

const resolveSize = (size: LogoBaseProps['size']): string => {
  if (typeof size === 'number') {
    return `${size}px`;
  }

  if (typeof size === 'string' && size in SIZE_MAP) {
    return SIZE_MAP[size as LogoSize];
  }

  return (size as string | undefined) ?? SIZE_MAP.md;
};

/**
 * Корпоративный логотип 8env.
 * Поддерживает как декоративный режим, так и работу ссылкой.
 */
export const Logo = forwardRef<HTMLAnchorElement | HTMLSpanElement, LogoProps>(
  (props, ref) => {
    const {
      size = 'md',
      bordered = true,
      withShadow = true,
      ariaLabel = 'Логотип 8env',
      className,
      style,
      ...rest
    } = props;

    const gradientId = useId();
    const resolvedSize = resolveSize(size);
    const isLink = 'href' in props && Boolean(props.href);

    const mergedClassName = cn(
      styles.root,
      {
        [styles.withBorder]: bordered,
        [styles.withShadow]: withShadow,
        [styles.interactive]: isLink,
      },
      className
    );

    const mergedStyle = {
      ...style,
      '--logo-size': resolvedSize,
    } as CSSProperties;

    const dataAttributes = {
      'data-has-border': bordered ? 'true' : 'false',
      'data-has-shadow': withShadow ? 'true' : 'false',
    } as const;

    const mark = (
      <svg
        className={styles.icon}
        viewBox="0 0 512 512"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="256"
            y1="0"
            x2="256"
            y2="512"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--color-brand-400)" />
            <stop offset="1" stopColor="var(--color-brand-700)" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="128" fill={`url(#${gradientId})`} />
        <path
          className={styles.symbol}
          d="M207.875 317H153.25L142.5 355H105.5L165.125 173H197L255.5 355H218.5L207.875 317ZM161.875 287.125H199.625L181 220.125L161.875 287.125ZM279.875 173H385.125V201.375H349.625V326.75H385.125V355H279.875V326.75H314.5V201.375H279.875V173Z"
          fill="currentColor"
        />
      </svg>
    );

    if (isLink) {
      const { href, target, rel, ...anchorProps } = rest as LogoAsLinkProps;
      const relValue =
        rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);

      return (
        <a
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={relValue}
          className={mergedClassName}
          style={mergedStyle}
          aria-label={ariaLabel}
          {...dataAttributes}
          {...anchorProps}
        >
          {mark}
        </a>
      );
    }

    return (
      <span
        ref={ref as ForwardedRef<HTMLSpanElement>}
        className={mergedClassName}
        style={mergedStyle}
        role="img"
        aria-label={ariaLabel}
        {...dataAttributes}
        {...(rest as LogoAsSpanProps)}
      >
        {mark}
      </span>
    );
  }
);

Logo.displayName = 'Logo';