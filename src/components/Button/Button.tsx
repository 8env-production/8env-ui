import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
} from 'react';

import cn from 'classnames';

import styles from './Button.module.scss';

type NativeButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type NativeAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export type ButtonView =
  | 'action'
  | 'success'
  | 'flat'
  | 'flat-danger'
  | 'flat-action'
  | 'flat-success'
  | 'default'
  | 'danger'
  | 'outlined'
  | 'outlined-danger'
  | 'outlined-success';

export interface ButtonBaseProps {
  /**
   * Вариант отображения кнопки
   */
  view?: ButtonView;
  /**
   * Отображать как иконку (квадратная форма)
   */
  isIcon?: boolean;
  /**
   * Растянуть на всю ширину контейнера
   */
  fullWidth?: boolean;
  /**
   * Обрезать текст с многоточием при переполнении
   */
  withEllipsis?: boolean;
  /**
   * Выравнивание текста
   */
  textAlign?: 'left' | 'center';
  /**
   * Отключить анимацию при клике
   */
  withoutAnimation?: boolean;
  /**
   * Убрать внутренние отступы
   */
  noPaddings?: boolean;
  /**
   * Содержимое кнопки
   */
  children: React.ReactNode;
}

export type ButtonAsButtonProps = ButtonBaseProps &
  Omit<NativeButtonProps, 'className'> & {
    /**
     * URL для навигации (если указан, кнопка станет ссылкой)
     */
    href?: never;
    /**
     * Target для ссылки
     */
    target?: never;
  };

export type ButtonAsLinkProps = ButtonBaseProps &
  Omit<NativeAnchorProps, 'className'> & {
    /**
     * URL для навигации (кнопка станет ссылкой)
     */
    href: string;
    /**
     * Target для ссылки
     */
    target?: '_blank' | '_self' | '_parent' | '_top';
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * Универсальный компонент кнопки
 * 
 * @example
 * ```tsx
 * // Обычная кнопка
 * <Button view="action" onClick={() => console.log('clicked')}>
 *   Нажми меня
 * </Button>
 * 
 * // Кнопка-ссылка
 * <Button view="outlined" href="/about">
 *   О нас
 * </Button>
 * 
 * // Кнопка-иконка
 * <Button view="flat" isIcon>
 *   <Icon name="close" />
 * </Button>
 * ```
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    children,
    view = 'default',
    fullWidth,
    isIcon,
    withEllipsis,
    textAlign,
    withoutAnimation,
    noPaddings,
    ...restProps
  } = props;

  const classNames = cn(styles.root, {
    [styles.action]: view === 'action',
    [styles.success]: view === 'success',
    [styles.flat]: view === 'flat',
    [styles.flatDanger]: view === 'flat-danger',
    [styles.flatAction]: view === 'flat-action',
    [styles.flatSuccess]: view === 'flat-success',
    [styles.default]: view === 'default',
    [styles.danger]: view === 'danger',
    [styles.outlined]: view === 'outlined',
    [styles.outlinedDanger]: view === 'outlined-danger',
    [styles.outlinedSuccess]: view === 'outlined-success',
    [styles.iconButton]: isIcon,
    [styles.fullWidth]: fullWidth,
    [styles.withEllipsis]: withEllipsis,
    [styles[`textAlign_${textAlign}`]]: textAlign,
    [styles.withoutAnimation]: withoutAnimation,
    [styles.noPaddings]: noPaddings,
  });

  // Если передан href, рендерим как ссылку
  if ('href' in props && props.href) {
    const { href, target, ...anchorProps } = restProps as Omit<
      ButtonAsLinkProps,
      keyof ButtonBaseProps
    >;

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classNames}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  // Иначе рендерим как кнопку
  const buttonProps = restProps as Omit<
    ButtonAsButtonProps,
    keyof ButtonBaseProps
  >;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={classNames}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
