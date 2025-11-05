import React, { forwardRef, useCallback, useId, useRef } from 'react';
import styles from './ResizableDiv.module.css';
import { useGlobalEventListeners, useMouseEvents, useResizeState } from './hooks';
import type { ResizableDivProps } from './types';

// Простая иконка вертикального эллипсиса (3 точки)
const DotsVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
);

// Утилита для объединения нескольких рефов в один обработчик
function useMergedRef<T>(...refs: Array<React.Ref<T> | undefined>) {
    return useCallback(
        (node: T | null) => {
            refs.forEach((ref) => {
                if (!ref) return;
                if (typeof ref === 'function') {
                    try {
                        (ref as (instance: T | null) => void)(node);
                    } catch {
                        /* ignore */
                    }
                } else {
                    try {
                        (ref as React.MutableRefObject<T | null>).current = node;
                    } catch {
                        /* ignore */
                    }
                }
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        refs
    );
}

const ResizableDiv = forwardRef<HTMLDivElement, ResizableDivProps>(
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
        const root = useRef<HTMLDivElement | null>(null);
        const combinedRef = useMergedRef<HTMLDivElement>(ref, root);

        const id = `resizable-${useId()}`;

        const resizeState = useResizeState(
            initialWidth,
            { minWidth, maxWidth },
            { onWidthChange, onResizeStart, onResizeEnd },
            keyboardStep,
            persistenceKey
        );

        const mouseEvents = useMouseEvents(resizeState, root, resizerPosition);
        useGlobalEventListeners(mouseEvents);

        const handleMouseDown = (event: React.MouseEvent) => {
            if (disabled) return;
            resizeState.startResize(event.clientX, resizeState.width);
            event.preventDefault();
            event.stopPropagation();
        };

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (disabled) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
                resizeState.adjustWidthByKeyboard(direction);
            }
        };

        const containerStyle: React.CSSProperties = {
            ...style,
            minWidth: `${resizeState.width}%`,
            maxWidth: `${resizeState.width}%`,
        };

        const containerClass = `${styles.resizable} ${
            resizerPosition === 'left' ? styles.leftResizer : styles.rightResizer
        }`;

        const resizerClass = `${styles.resizer} ${
            resizerPosition === 'left' ? styles.resizerLeft : styles.resizerRight
        }`;

        return (
            <div
                id={id}
                ref={combinedRef}
                className={containerClass}
                style={containerStyle}
                data-testid="resizable-container"
            >
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
                        <DotsVerticalIcon className={styles.resizerIcon} aria-hidden="true" />
                    </div>
                )}

                <div
                    className={`${styles.content} ${className || ''}`}
                    {...props}
                    data-testid="resizable-content"
                />

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
                        <DotsVerticalIcon className={styles.resizerIcon} aria-hidden="true" />
                    </div>
                )}
            </div>
        );
    }
);

ResizableDiv.displayName = 'ResizableDiv';

export { ResizableDiv };
export default ResizableDiv;