/**
 * Экспорт компонента ResizableDiv и связанных типов
 */

export { ResizableDiv } from './ResizableDiv';

// Экспорт типов
export type {
    ResizableDivProps,
    ResizeCallbacks,
    ResizeConstraints,
    ResizeState,
    NativeDivProps,
} from './types';

// Экспорт хуков для расширенного использования
export {
    useResizeState,
    useMouseEvents,
    useGlobalEventListeners,
} from './hooks';
