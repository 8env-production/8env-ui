import { useCallback, useEffect, useRef, useState } from 'react';

import { ResizeCallbacks, ResizeConstraints } from './types';

/**
 * Хук для работы с localStorage для сохранения ширины элемента
 *
 * @param {string} key - Ключ для сохранения в localStorage
 * @param {number} defaultValue - Значение по умолчанию
 * @returns {[number, (value: number) => void]} Кортеж с текущим значением и функцией для его обновления
 */
const useLocalStorageWidth = (
    key: string,
    defaultValue: number
): [number, (value: number) => void] => {
    // Всегда начинаем с defaultValue для избежания hydration mismatch
    const [storedValue, setStoredValue] = useState<number>(defaultValue);

    // Загружаем значение из localStorage только после гидратации
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const item = window.localStorage.getItem(key);
                if (item) {
                    const parsedValue = parseFloat(item);
                    if (!isNaN(parsedValue)) {
                        setStoredValue(parsedValue);
                    }
                }
            }
        } catch (error) {
            console.warn(
                `ResizableDiv: не удалось загрузить ширину из localStorage для ключа "${key}"`,
                error
            );
        }
    }, [key]);

    const setValue = useCallback(
        (value: number) => {
            try {
                setStoredValue(value);
                
                // Проверяем, что мы находимся в браузере (не на сервере)
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, value.toString());
                }
            } catch (error) {
                console.warn(
                    `ResizableDiv: не удалось сохранить ширину в localStorage для ключа "${key}"`,
                    error
                );
            }
        },
        [key]
    );

    return [storedValue, setValue];
};

/**
 * Хук для управления состоянием изменения размера элемента
 *
 * Этот хук отвечает за:
 * - Хранение текущей ширины элемента в процентах
 * - Отслеживание процесса изменения размера (начало, процесс, завершение)
 * - Применение ограничений на минимальную и максимальную ширину
 * - Вызов колбэков при различных событиях изменения размера
 * - Управление изменением размера с помощью клавиатуры
 * - Сохранение ширины в localStorage (опционально)
 *
 * @param {number} initialWidth - Начальная ширина элемента в процентах (например, 30 для 30%)
 * @param {ResizeConstraints} constraints - Объект с ограничениями размера
 * @param {number} constraints.minWidth - Минимальная ширина в процентах
 * @param {number} constraints.maxWidth - Максимальная ширина в процентах
 * @param {ResizeCallbacks} [callbacks={}] - Объект с колбэками для различных событий
 * @param {function} [callbacks.onWidthChange] - Вызывается при каждом изменении ширины
 * @param {function} [callbacks.onResizeStart] - Вызывается в начале изменения размера
 * @param {function} [callbacks.onResizeEnd] - Вызывается при завершении изменения размера
 * @param {number} [keyboardStep=1] - Шаг изменения размера при использовании клавиш (в процентах)
 * @param {string} [persistenceKey] - Ключ для сохранения ширины в localStorage (если не указан, сохранение отключено)
 *
 * @returns {Object} Объект с состоянием и методами управления изменением размера
 * @returns {number} returns.width - Текущая ширина элемента в процентах
 * @returns {boolean} returns.isResizing - Флаг, показывающий происходит ли сейчас изменение размера
 * @returns {number} returns.startX - Начальная позиция курсора по оси X при начале изменения размера
 * @returns {number} returns.startWidth - Начальная ширина элемента при начале изменения размера
 * @returns {function} returns.updateWidth - Функция для обновления ширины с применением ограничений
 * @returns {function} returns.startResize - Функция для начала процесса изменения размера
 * @returns {function} returns.stopResize - Функция для завершения процесса изменения размера
 * @returns {function} returns.adjustWidthByKeyboard - Функция для изменения ширины с помощью клавиатуры
 *
 * @example
 * const resizeState = useResizeState(
 *   30, // начальная ширина 30%
 *   { minWidth: 10, maxWidth: 90 }, // ограничения
 *   {
 *     onWidthChange: (width) => console.log('Новая ширина:', width),
 *     onResizeStart: () => console.log('Начало изменения размера'),
 *     onResizeEnd: () => console.log('Конец изменения размера')
 *   },
 *   2, // шаг клавиатуры 2%
 *   'sidebar-width' // ключ для сохранения в localStorage
 * );
 */
export const useResizeState = (
    initialWidth: number,
    constraints: ResizeConstraints,
    callbacks: ResizeCallbacks = {},
    keyboardStep: number = 1,
    persistenceKey?: string
) => {
    // Всегда вызываем хук, но используем результат только при наличии persistenceKey
    const [persistedWidth, setPersistedWidth] = useLocalStorageWidth(
        persistenceKey || 'temp-key',
        initialWidth
    );

    // Используем persistedWidth только если есть persistenceKey, иначе initialWidth
    const [width, setWidth] = useState(initialWidth);

    // Синхронизируем width с persistedWidth когда он загружается из localStorage
    useEffect(() => {
        if (persistenceKey && persistedWidth !== initialWidth) {
            setWidth(persistedWidth);
        }
    }, [persistedWidth, persistenceKey, initialWidth]);
    const [resizing, setResizing] = useState(false);
    const startX = useRef(0);
    const startWidth = useRef(initialWidth);

    const { onWidthChange, onResizeStart, onResizeEnd } = callbacks;
    const { minWidth, maxWidth } = constraints;

    /**
     * Обновляет ширину элемента с применением ограничений
     *
     * Функция принимает новое значение ширины, применяет к нему ограничения
     * (минимальная и максимальная ширина), округляет до 2 знаков после запятой
     * и обновляет состояние только если значение действительно изменилось.
     * Если включено сохранение в localStorage, также сохраняет новое значение.
     *
     * @param {number} newWidth - Новая ширина в процентах
     * @returns {number} Итоговая ширина после применения ограничений и округления
     */
    const updateWidth = useCallback(
        (newWidth: number) => {
            const clampedWidth = Math.max(
                minWidth,
                Math.min(maxWidth, newWidth)
            );
            const roundedWidth = Math.round(clampedWidth * 100) / 100;

            if (roundedWidth !== width) {
                setWidth(roundedWidth);

                // Сохраняем в localStorage если включено
                if (persistenceKey) {
                    setPersistedWidth(roundedWidth);
                }

                onWidthChange?.(roundedWidth);
            }

            return roundedWidth;
        },
        [
            width,
            minWidth,
            maxWidth,
            onWidthChange,
            persistenceKey,
            setPersistedWidth,
        ]
    );

    /**
     * Начинает процесс изменения размера элемента
     *
     * Функция инициализирует процесс изменения размера:
     * - Устанавливает флаг активного изменения размера
     * - Запоминает начальную позицию курсора и ширину элемента
     * - Добавляет CSS класс для отключения выделения текста на странице
     * - Вызывает колбэк onResizeStart если он передан
     *
     * @param {number} clientX - Позиция курсора по оси X в момент начала изменения размера
     * @param {number} currentWidth - Текущая ширина элемента в процентах
     */
    const startResize = useCallback(
        (clientX: number, currentWidth: number) => {
            setResizing(true);
            startX.current = clientX;
            startWidth.current = currentWidth;
            console.log('>>> ping');

            if (typeof document !== 'undefined') {
                document.body.classList.add('disable-user-select');
            }
            onResizeStart?.(currentWidth);
        },
        [onResizeStart]
    );

    /**
     * Завершает процесс изменения размера элемента
     *
     * Функция завершает процесс изменения размера:
     * - Сбрасывает флаг активного изменения размера
     * - Удаляет CSS класс для восстановления выделения текста на странице
     * - Вызывает колбэк onResizeEnd с финальной шириной элемента
     *
     * Функция безопасна для множественных вызовов - она проверяет,
     * что изменение размера действительно активно перед выполнением действий.
     */
    const stopResize = useCallback(() => {
        if (resizing) {
            setResizing(false);
            if (typeof document !== 'undefined') {
                document.body.classList.remove('disable-user-select');
            }
            onResizeEnd?.(width);
        }
    }, [width, onResizeEnd]);

    /**
     * Изменяет ширину элемента с помощью клавиатуры
     *
     * Функция позволяет изменять ширину элемента с помощью клавиш:
     * - 'left' уменьшает ширину на значение keyboardStep
     * - 'right' увеличивает ширину на значение keyboardStep
     *
     * Изменение происходит с применением всех ограничений (min/max ширина).
     *
     * @param {'left' | 'right'} direction - Направление изменения размера
     *   - 'left' - уменьшить ширину (влево)
     *   - 'right' - увеличить ширину (вправо)
     *
     * @example
     * // Уменьшить ширину на keyboardStep процентов
     * adjustWidthByKeyboard('left');
     *
     * // Увеличить ширину на keyboardStep процентов
     * adjustWidthByKeyboard('right');
     */
    const adjustWidthByKeyboard = useCallback(
        (direction: 'left' | 'right') => {
            const delta = direction === 'left' ? -keyboardStep : keyboardStep;
            updateWidth(width + delta);
        },
        [width, keyboardStep, updateWidth]
    );

    return {
        width,
        isResizing: resizing,
        startX: startX.current,
        startWidth: startWidth.current,
        updateWidth,
        startResize,
        stopResize,
        adjustWidthByKeyboard,
    };
};

/**
 * Хук для обработки событий мыши при изменении размера элемента
 *
 * Этот хук создает обработчики событий мыши для интерактивного изменения размера:
 * - Отслеживает движение мыши и пересчитывает ширину элемента
 * - Обрабатывает отпускание кнопки мыши для завершения изменения размера
 * - Работает с процентными значениями относительно родительского элемента
 * - Включает обработку ошибок для безопасной работы
 *
 * @param {Object} resizeState - Объект состояния изменения размера из useResizeState
 * @param {function} resizeState.updateWidth - Функция для обновления ширины
 * @param {function} resizeState.stopResize - Функция для завершения изменения размера
 * @param {boolean} resizeState.isResizing - Флаг активного изменения размера
 * @param {number} resizeState.startX - Начальная позиция курсора по X
 * @param {React.RefObject<HTMLDivElement | null>} rootRef - Реф на корневой элемент компонента
 *
 * @returns {Object} Объект с обработчиками событий мыши
 * @returns {function} returns.handleMouseMove - Обработчик движения мыши
 * @returns {function} returns.handleMouseUp - Обработчик отпускания кнопки мыши
 *
 * @example
 * const rootRef = useRef<HTMLDivElement>(null);
 * const resizeState = useResizeState(30, { minWidth: 10, maxWidth: 90 });
 * const mouseEvents = useMouseEvents(resizeState, rootRef);
 */
export const useMouseEvents = (
    resizeState: ReturnType<typeof useResizeState>,
    rootRef: React.RefObject<HTMLDivElement | null>,
    resizerPosition: 'left' | 'right' = 'right'
) => {
    const { updateWidth, stopResize, startX } = resizeState;

    /**
     * Обрабатывает движение мыши во время изменения размера
     *
     * Функция вычисляет новую ширину элемента на основе движения мыши:
     * 1. Проверяет, что изменение размера активно и элемент существует
     * 2. Получает размеры родительского элемента
     * 3. Вычисляет смещение курсора относительно начальной позиции
     * 4. Преобразует смещение в проценты относительно родительского элемента
     * 5. Добавляет смещение к начальной ширине и обновляет через updateWidth
     *
     * Включает обработку ошибок - если что-то пойдет не так,
     * изменение размера будет автоматически завершено.
     *
     * @param {MouseEvent} event - Событие движения мыши
     */
    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            // console.log('>>> ping', {
            //     isResizing: resizeState.isResizing,
            //     current: rootRef.current,
            // });

            if (!resizeState.isResizing || !rootRef.current) {
                return;
            }

            try {
                const parentElement = rootRef.current.parentElement;

                if (!parentElement) {
                    console.warn(
                        'ResizableDiv: родительский элемент не найден'
                    );
                    return;
                }

                const parentRect = parentElement.getBoundingClientRect();
                const deltaX = event.clientX - startX;
                const deltaPercent = (deltaX / parentRect.width) * 100;

                // Для левого ресайзера инвертируем направление изменения
                const adjustedDeltaPercent =
                    resizerPosition === 'left' ? -deltaPercent : deltaPercent;
                const newWidthPercent =
                    resizeState.startWidth + adjustedDeltaPercent;

                updateWidth(newWidthPercent);
            } catch (error) {
                console.error(
                    'ResizableDiv: ошибка при изменении размера',
                    error
                );
                stopResize();
            }
        },
        [
            resizeState.isResizing,
            resizeState.startWidth,
            rootRef,
            startX,
            updateWidth,
            stopResize,
            resizerPosition,
        ]
    );

    /**
     * Обрабатывает отпускание кнопки мыши
     *
     * Простая функция-обертка, которая завершает процесс изменения размера
     * при отпускании любой кнопки мыши. Вызывает stopResize для корректного
     * завершения процесса изменения размера.
     */
    const handleMouseUp = useCallback(() => {
        stopResize();
    }, [stopResize]);

    return {
        handleMouseMove,
        handleMouseUp,
    };
};

/**
 * Хук для управления глобальными обработчиками событий мыши
 *
 * Этот хук отвечает за подключение и отключение глобальных обработчиков событий:
 * - Добавляет обработчики mousemove и mouseup на document при монтировании
 * - Удаляет обработчики при размонтировании компонента
 * - Очищает CSS классы при размонтировании для предотвращения утечек
 *
 * Глобальные обработчики нужны для того, чтобы изменение размера работало
 * даже когда курсор выходит за пределы элемента во время перетаскивания.
 *
 * @param {Object} mouseEvents - Объект с обработчиками событий мыши из useMouseEvents
 * @param {function} mouseEvents.handleMouseMove - Обработчик движения мыши
 * @param {function} mouseEvents.handleMouseUp - Обработчик отпускания кнопки мыши
 *
 * @example
 * const mouseEvents = useMouseEvents(resizeState, rootRef);
 * useGlobalEventListeners(mouseEvents); // Автоматически подключает глобальные обработчики
 */
export const useGlobalEventListeners = (
    mouseEvents: ReturnType<typeof useMouseEvents>
) => {
    const { handleMouseMove, handleMouseUp } = mouseEvents;

    useEffect(() => {
        // Проверяем, что мы находимся в браузере
        if (typeof document === 'undefined') {
            return;
        }

        document.addEventListener('mousemove', handleMouseMove, {
            passive: false,
        });
        document.addEventListener('mouseup', handleMouseUp, { passive: true });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.classList.remove('disable-user-select');
        };
    }, [handleMouseMove, handleMouseUp]);
};
