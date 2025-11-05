import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

import cn from 'classnames';

import styles from './TextInput.module.scss';

type NativeInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface TextInputProps extends Omit<NativeInputProps, 'id' | 'className'> {
  /**
   * Метка для поля ввода
   */
  label?: ReactNode;
  /**
   * Дополнительный className для корневого контейнера
   */
  className?: string;
  /**
   * Дополнительный className для input элемента
   */
  inputClassName?: string;
  /**
   * Дополнительный className для label
   */
  labelClassName?: string;
}

/**
 * Компонент TextInput для однострочного ввода текста
 *
 * @example
 * ```tsx
 * // Базовое использование
 * <TextInput label="Имя" placeholder="Введите имя..." />
 *
 * // С контролируемым значением
 * <TextInput
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // Обязательное поле
 * <TextInput
 *   label="Пароль"
 *   type="password"
 *   required
 * />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    label,
    className,
    inputClassName,
    labelClassName,
    name,
    type = 'text',
    ...restProps
  } = props;

  const id = `textinput-${useId()}-${name || 'field'}`;

  const rootClassName = cn(styles.root, className);
  const inputClasses = cn(styles.input, inputClassName);
  const labelClasses = cn(styles.label, labelClassName);

  return (
    <div className={rootClassName}>
      {label && (
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
      )}

      <input ref={ref} {...restProps} id={id} name={name} type={type} className={inputClasses} />
    </div>
  );
});

TextInput.displayName = 'TextInput';
