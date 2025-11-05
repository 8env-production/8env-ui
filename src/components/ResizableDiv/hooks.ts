import { useCallback, useEffect, useRef, useState } from 'react';

import { ResizeCallbacks, ResizeConstraints } from './types';

const useLocalStorageWidth = (
  key: string,
  defaultValue: number
): [number, (value: number) => void] => {
  const [storedValue, setStoredValue] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = parseFloat(item);
          if (!isNaN(parsed)) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.warn(`ResizableDiv: failed to read width from localStorage for key "${key}"`, error);
    }
    return defaultValue;
  });

  const setValue = useCallback(
    (value: number) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value.toString());
        }
      } catch (error) {
        console.warn(`ResizableDiv: failed to save width to localStorage for key "${key}"`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

export const useResizeState = (
  initialWidth: number,
  constraints: ResizeConstraints,
  callbacks: ResizeCallbacks = {},
  keyboardStep: number = 1,
  persistenceKey?: string
) => {
  const [persistedWidth, setPersistedWidth] = useLocalStorageWidth(
    persistenceKey || 'temp-key',
    initialWidth
  );

  const [width, setWidth] = useState(persistedWidth);

  const [resizing, setResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(initialWidth);

  const { onWidthChange, onResizeStart, onResizeEnd } = callbacks;
  const { minWidth, maxWidth } = constraints;

  const updateWidth = useCallback(
    (newWidth: number) => {
      const clamped = Math.max(minWidth, Math.min(maxWidth, newWidth));
      const rounded = Math.round(clamped * 100) / 100;

      setWidth((prev) => {
        if (rounded !== prev) {
          if (persistenceKey) {
            setPersistedWidth(rounded);
          }
          onWidthChange?.(rounded);
          return rounded;
        }
        return prev;
      });

      return rounded;
    },
    [minWidth, maxWidth, onWidthChange, persistenceKey, setPersistedWidth]
  );

  const startResize = useCallback(
    (clientX: number, currentWidth: number) => {
      setResizing(true);
      startX.current = clientX;
      startWidth.current = currentWidth;

      if (typeof document !== 'undefined') {
        document.body.classList.add('disable-user-select');
      }

      onResizeStart?.(currentWidth);
    },
    [onResizeStart]
  );

  const stopResize = useCallback(() => {
    if (resizing) {
      setResizing(false);
      if (typeof document !== 'undefined') {
        document.body.classList.remove('disable-user-select');
      }
      onResizeEnd?.(width);
    }
  }, [resizing, onResizeEnd, width]);

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
    startXRef: startX,
    startWidthRef: startWidth,
    updateWidth,
    startResize,
    stopResize,
    adjustWidthByKeyboard,
  };
};

export const useMouseEvents = (
  resizeState: ReturnType<typeof useResizeState>,
  rootRef: React.RefObject<HTMLDivElement | null>,
  resizerPosition: 'left' | 'right' = 'right'
) => {
  const { updateWidth, stopResize, startXRef, startWidthRef } = resizeState;

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizeState.isResizing || !rootRef.current) return;

      try {
        const parent = rootRef.current.parentElement;
        if (!parent) {
          console.warn('ResizableDiv: parent element not found');
          return;
        }

        const rect = parent.getBoundingClientRect();
        const deltaX = event.clientX - startXRef.current;
        const deltaPercent = (deltaX / rect.width) * 100;

        const adjustedDelta = resizerPosition === 'left' ? -deltaPercent : deltaPercent;
        const newWidth = startWidthRef.current + adjustedDelta;

        updateWidth(newWidth);
      } catch (err) {
        console.error('ResizableDiv: error while resizing', err);
        stopResize();
      }
    },
    [
      resizeState.isResizing,
      rootRef,
      startXRef,
      startWidthRef,
      updateWidth,
      stopResize,
      resizerPosition,
    ]
  );

  const handleMouseUp = useCallback(() => {
    stopResize();
  }, [stopResize]);

  return { handleMouseMove, handleMouseUp };
};

export const useGlobalEventListeners = (mouseEvents: ReturnType<typeof useMouseEvents>) => {
  const { handleMouseMove, handleMouseUp } = mouseEvents;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('disable-user-select');
    };
  }, [handleMouseMove, handleMouseUp]);
};
