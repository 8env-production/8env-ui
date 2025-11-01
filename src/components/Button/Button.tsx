import React from 'react';
import './Button.css';

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
      className={`button button--${variant} button--${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
