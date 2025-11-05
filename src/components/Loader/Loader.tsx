import { forwardRef, type HTMLAttributes } from 'react';

import cn from 'classnames';

import styles from './Loader.module.scss';

export type LoaderSize = 's' | 'm' | 'l' | 'xl';
export type LoaderVariant = 'brand' | 'neutral' | 'contrast' | 'success' | 'danger';

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Размер индикатора
   *
   * @default 'm'
   */
  size?: LoaderSize;
  /**
   * Цветовая схема индикатора
   *
   * @default 'brand'
   */
  variant?: LoaderVariant;
  /**
   * Приостановить анимацию вращения
   *
   * @default false
   */
  paused?: boolean;
  /**
   * Текстовое описание для скринридеров.
   * Если указать пустую строку, описание не будет озвучено.
   *
   * @default 'Загрузка…'
   */
  label?: string;
}

/**
 * Универсальный компонент индикатора загрузки.
 *
 * @example
 * ```tsx
 * <Loader size="l" variant="success" />
 * ```
 */
export const Loader = forwardRef<HTMLDivElement, LoaderProps>((props, ref) => {
  const {
    size = 'm',
    variant = 'brand',
    paused = false,
    label = 'Загрузка…',
    className,
    role,
    'aria-live': ariaLive,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const shouldRenderLabel = Boolean(label?.trim());
  const renderHiddenLabel = shouldRenderLabel && !ariaLabel;

  return (
    <div
      ref={ref}
      role={role ?? 'status'}
      aria-live={ariaLive ?? 'polite'}
      aria-label={ariaLabel}
      className={cn(
        styles.root,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        { [styles.paused]: paused },
        className,
      )}
      {...rest}
    >
      {renderHiddenLabel ? (
        <span className={styles.visuallyHidden}>{label}</span>
      ) : null}
    </div>
  );
});

Loader.displayName = 'Loader';