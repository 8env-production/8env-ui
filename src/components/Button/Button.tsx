import React from 'react';

import styles from './Button.module.scss';

export interface ButtonProps {
  /**
   * Текст кнопки
   */
  label: string;
  /**
   * Вариант отображения кнопки
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * Размер кнопки
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Кнопка заблокирована
   */
  disabled?: boolean;
  /**
   * Обработчик клика
   */
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
