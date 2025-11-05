import {
  ChangeEventHandler,
  DetailedHTMLProps,
  KeyboardEventHandler,
  ReactNode,
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
} from 'react';

import cn from 'classnames';

import styles from './TextArea.module.scss';

type NativeTextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export interface TextAreaProps extends Omit<NativeTextAreaProps, 'id' | 'className' | 'onKeyDown'> {
  /**
   * Метка для textarea
   */
  label?: ReactNode;
  /**
   * Колбэк при отправке (Ctrl+Enter)
   */
  onSubmit?: () => void;
  /**
   * Дополнительный className для корневого контейнера
   */
  className?: string;
  /**
   * Дополнительный className для textarea элемента
   */
  textareaClassName?: string;
  /**
   * Дополнительный className для label
   */
  labelClassName?: string;
  /**
   * Автоматическое изменение высоты по содержимому
   * @default true
   */
  autoResize?: boolean;
  /**
   * Минимальная высота в пикселях
   * @default 200
   */
  minHeight?: number;
}

/**
 * Компонент TextArea для многострочного ввода текста
 *
 * @example
 * ```tsx
 * // Базовое использование
 * <TextArea label="Комментарий" placeholder="Введите текст..." />
 *
 * // С контролируемым значением
 * <TextArea
 *   label="Описание"
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 *
 * // С отправкой по Ctrl+Enter
 * <TextArea
 *   label="Сообщение"
 *   onSubmit={handleSubmit}
 *   placeholder="Ctrl+Enter для отправки"
 * />
 *
 * // Без автоматического изменения размера
 * <TextArea label="Фиксированная высота" autoResize={false} />
 * ```
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const {
    label,
    onSubmit,
    onChange,
    className,
    textareaClassName,
    labelClassName,
    autoResize = true,
    minHeight = 200,
    value,
    ...restProps
  } = props;

  const id = `textarea-${useId()}-${props.name || 'field'}`;
  const isControlled = value !== undefined;

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      if (onSubmit && event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        onSubmit();
        
        // Очищаем значение в неконтролируемом режиме
        if (!isControlled && event.currentTarget) {
          event.currentTarget.value = '';
        }
      }
    },
    [onSubmit, isControlled]
  );

  const onChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onChange?.(event);
    },
    [onChange]
  );

  // Автоматическое изменение высоты
  useEffect(() => {
    if (!autoResize) return;

    const element = document.getElementById(id) as HTMLTextAreaElement | null;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Math.max(element.scrollHeight + 16, minHeight)}px`;
  }, [id, value, autoResize, minHeight]);

  const rootClassName = cn(styles.root, className);
  const textareaClasses = cn(styles.input, textareaClassName);
  const labelClasses = cn(styles.label, labelClassName);

  return (
    <div className={rootClassName}>
      {label && (
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        {...restProps}
        id={id}
        value={value}
        className={textareaClasses}
        onKeyDown={onKeyDown}
        onChange={onChangeHandler}
        style={{
          minHeight: autoResize ? `${minHeight}px` : undefined,
          ...restProps.style,
        }}
      />
    </div>
  );
});

TextArea.displayName = 'TextArea';
