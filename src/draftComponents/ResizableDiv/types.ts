import { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * Типы для нативных пропсов div элемента
 */
export type NativeDivProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

/**
 * Конфигурация для ограничений размера
 */
export interface ResizeConstraints {
    /** Минимальная ширина в процентах */
    minWidth: number;
    /** Максимальная ширина в процентах */
    maxWidth: number;
}

/**
 * Данные о текущем состоянии изменения размера
 */
export interface ResizeState {
    /** Текущая ширина в процентах */
    width: number;
    /** Флаг активного изменения размера */
    isResizing: boolean;
    /** Начальная позиция X курсора */
    startX: number;
    /** Начальная ширина при старте изменения размера */
    startWidth: number;
}

/**
 * Колбэки для событий изменения размера
 */
export interface ResizeCallbacks {
    /** Вызывается при изменении ширины */
    onWidthChange?: (width: number) => void;
    /** Вызывается при начале изменения размера */
    onResizeStart?: (width: number) => void;
    /** Вызывается при завершении изменения размера */
    onResizeEnd?: (width: number) => void;
}

/**
 * Позиция ресайзера
 */
export type ResizerPosition = 'left' | 'right';

/**
 * Расширенные пропсы для ResizableDiv компонента
 */
export interface ResizableDivProps extends Omit<NativeDivProps, 'style'> {
    /** Начальная ширина в процентах (по умолчанию 30%) */
    initialWidth?: number;
    /** Минимальная ширина в процентах (по умолчанию 10%) */
    minWidth?: number;
    /** Максимальная ширина в процентах (по умолчанию 90%) */
    maxWidth?: number;
    /** Колбэк, вызываемый при изменении ширины */
    onWidthChange?: (width: number) => void;
    /** Колбэк, вызываемый при начале изменения размера */
    onResizeStart?: (width: number) => void;
    /** Колбэк, вызываемый при завершении изменения размера */
    onResizeEnd?: (width: number) => void;
    /** Дополнительные стили для контейнера */
    style?: React.CSSProperties;
    /** Отключить возможность изменения размера */
    disabled?: boolean;
    /** Шаг изменения размера при использовании клавиатуры (по умолчанию 1%) */
    keyboardStep?: number;
    /** Ключ для сохранения ширины в localStorage (если не указан, сохранение отключено) */
    persistenceKey?: string;
    /** Позиция ресайзера: 'left' или 'right' (по умолчанию 'right') */
    resizerPosition?: ResizerPosition;
}