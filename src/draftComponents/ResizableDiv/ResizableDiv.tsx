import React, { FC, forwardRef, useId, useRef } from 'react';

import { EllipsisVertical } from '@gravity-ui/icons';

import { useMergedRef } from 'next/dist/client/use-merged-ref';

import styles from './ResizableDiv.module.css';

import {
    useGlobalEventListeners,
    useMouseEvents,
    useResizeState,
} from './hooks';
import { ResizableDivProps } from './types';

/**
 * Компонент ResizableDiv - контейнер с возможностью изменения ширины
 *
 * Позволяет пользователю изменять ширину контейнера путем перетаскивания
 * специального элемента управления (resizer) на левой или правой границе.
 *
 * Основные возможности:
 * - Изменение размера мышью (drag & drop)
 * - Клавиатурное управление (стрелки влево/вправо)
 * - Выбор позиции ресайзера (слева или справа)
 * - Настраиваемые ограничения размера
 * - Колбэки для отслеживания изменений
 * - Сохранение ширины в localStorage
 * - Поддержка accessibility
 * - Адаптивный дизайн
 *
 * @example
 * ```tsx
 * // Базовое использование с правым ресайзером
 * <ResizableDiv
 *   initialWidth={25}
 *   minWidth={15}
 *   maxWidth={85}
 *   resizerPosition="right"
 *   onWidthChange={(width) => console.log('New width:', width)}
 * >
 *   <div>Содержимое панели</div>
 * </ResizableDiv>
 *
 * // С левым ресайзером и сохранением в localStorage
 * <ResizableDiv
 *   initialWidth={30}
 *   minWidth={20}
 *   maxWidth={80}
 *   resizerPosition="left"
 *   persistenceKey="sidebar-width"
 * >
 *   <div>Содержимое сайдбара</div>
 * </ResizableDiv>
 * ```
 *
 * @param props - Пропсы компонента
 * @param ref - Реф для доступа к DOM элементу
 */
const ResizableDiv: FC<ResizableDivProps> = forwardRef<
    HTMLDivElement,
    ResizableDivProps
>(
    (
        {
            className,
            initialWidth = 30,
            minWidth = 10,
            maxWidth = 90,
            onWidthChange,
            onResizeStart,
            onResizeEnd,
            style,
            disabled = false,
            keyboardStep = 1,
            persistenceKey,
            resizerPosition = 'right',
            ...props
        },
        ref
    ) => {
        // Реф для корневого элемента
        const root = useRef<HTMLDivElement>(null);
        const combinedRootRef = useMergedRef(ref, root);

        // Уникальный ID для элемента
        const id = `js-resizable-${useId()}`;

        // Состояние и логика изменения размера
        const resizeState = useResizeState(
            initialWidth,
            { minWidth, maxWidth },
            { onWidthChange, onResizeStart, onResizeEnd },
            keyboardStep,
            persistenceKey
        );

        // Обработчики событий мыши
        const mouseEvents = useMouseEvents(resizeState, root, resizerPosition);

        // Глобальные обработчики событий
        useGlobalEventListeners(mouseEvents);

        /**
         * Обработчик начала изменения размера мышью
         */
        const handleMouseDown = (event: React.MouseEvent) => {
            if (disabled) return;

            resizeState.startResize(event.clientX, resizeState.width);

            // Предотвращаем всплытие события
            event.preventDefault();
            event.stopPropagation();
        };

        /**
         * Обработчик клавиатурного управления
         */
        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (disabled) return;

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
                resizeState.adjustWidthByKeyboard(direction);
            }
        };

        // Объединяем пользовательские стили с вычисленными
        const containerStyle: React.CSSProperties = {
            ...style,
            minWidth: `${resizeState.width}%`,
            maxWidth: `${resizeState.width}%`,
        };

        // Определяем CSS классы в зависимости от позиции ресайзера
        const containerClass = `${styles.resizable} ${
            resizerPosition === 'left'
                ? styles.leftResizer
                : styles.rightResizer
        }`;

        const resizerClass = `${styles.resizer} ${
            resizerPosition === 'left'
                ? styles.resizerLeft
                : styles.resizerRight
        }`;

        return (
            <div
                id={id}
                ref={combinedRootRef}
                className={containerClass}
                style={containerStyle}
                data-testid="resizable-container"
            >
                {/* Левый ресайзер */}
                {resizerPosition === 'left' && (
                    <div
                        className={resizerClass}
                        onMouseDown={handleMouseDown}
                        role="separator"
                        aria-label="Изменить ширину панели"
                        aria-valuemin={minWidth}
                        aria-valuemax={maxWidth}
                        aria-valuenow={resizeState.width}
                        aria-orientation="vertical"
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={handleKeyDown}
                        data-testid="resizer-left"
                        data-disabled={disabled}
                        style={{
                            cursor: disabled ? 'not-allowed' : 'col-resize',
                            opacity: disabled ? 0.5 : 1,
                            pointerEvents: disabled ? 'none' : 'auto',
                        }}
                    >
                        <EllipsisVertical
                            className={styles.resizerIcon}
                            aria-hidden="true"
                        />
                    </div>
                )}

                {/* Контент компонента */}
                <div
                    className={`${styles.content} ${className || ''}`}
                    {...props}
                    data-testid="resizable-content"
                />

                {/* Правый ресайзер */}
                {resizerPosition === 'right' && (
                    <div
                        className={resizerClass}
                        onMouseDown={handleMouseDown}
                        role="separator"
                        aria-label="Изменить ширину панели"
                        aria-valuemin={minWidth}
                        aria-valuemax={maxWidth}
                        aria-valuenow={resizeState.width}
                        aria-orientation="vertical"
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={handleKeyDown}
                        data-testid="resizer-right"
                        data-disabled={disabled}
                        style={{
                            cursor: disabled ? 'not-allowed' : 'col-resize',
                            opacity: disabled ? 0.5 : 1,
                            pointerEvents: disabled ? 'none' : 'auto',
                        }}
                    >
                        <EllipsisVertical
                            className={styles.resizerIcon}
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>
        );
    }
);

// Устанавливаем displayName для лучшей отладки
ResizableDiv.displayName = 'ResizableDiv';

export { ResizableDiv };
