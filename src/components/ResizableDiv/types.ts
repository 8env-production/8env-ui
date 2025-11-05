import type { CSSProperties, DetailedHTMLProps, HTMLAttributes, RefObject } from 'react';

/**
 * Native div props
 */
export type NativeDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface ResizeConstraints {
  /** Минимальная ширина в процентах */
  minWidth: number;
  /** Максимальная ширина в процентах */
  maxWidth: number;
}

export interface ResizeState {
  /** Текущая ширина в процентах */
  width: number;
  /** Флаг активного изменения размера */
  isResizing: boolean;
  /** Ref начальной позиции X курсора */
  startXRef: RefObject<number>;
  /** Ref начальной ширины при старте изменения размера */
  startWidthRef: RefObject<number>;
}

export interface ResizeCallbacks {
  onWidthChange?: (width: number) => void;
  onResizeStart?: (width: number) => void;
  onResizeEnd?: (width: number) => void;
}

export type ResizerPosition = 'left' | 'right';

export interface ResizableDivProps extends Omit<NativeDivProps, 'style'> {
  /** Начальная ширина в процентах (по умолчанию 30) */
  initialWidth?: number;
  /** Минимальная ширина в процентах (по умолчанию 10) */
  minWidth?: number;
  /** Максимальная ширина в процентах (по умолчанию 90) */
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  onResizeStart?: (width: number) => void;
  onResizeEnd?: (width: number) => void;
  /** Дополнительные стили для контейнера */
  style?: CSSProperties;
  disabled?: boolean;
  /** Шаг клавиатурного управления в процентах */
  keyboardStep?: number;
  /** Ключ для сохранения в localStorage */
  persistenceKey?: string;
  resizerPosition?: ResizerPosition;
}
