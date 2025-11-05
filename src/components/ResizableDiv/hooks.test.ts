import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useResizeState, useMouseEvents, useGlobalEventListeners } from './hooks';

describe('useResizeState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updateWidth clamps to min/max and calls onWidthChange', () => {
    const onWidthChange = jest.fn();
    const { result } = renderHook(() =>
      useResizeState(30, { minWidth: 10, maxWidth: 90 }, { onWidthChange }, 1)
    );

    act(() => {
      const val1 = result.current.updateWidth(5);
      expect(val1).toBe(10);
    });

    expect(onWidthChange).toHaveBeenCalledWith(10);

    act(() => {
      result.current.updateWidth(95);
    });

    expect(onWidthChange).toHaveBeenCalledWith(90);
  });

  it('startResize & stopResize toggle isResizing and call callbacks', () => {
    const onResizeStart = jest.fn();
    const onResizeEnd = jest.fn();
    const { result } = renderHook(() =>
      useResizeState(30, { minWidth: 10, maxWidth: 90 }, { onResizeStart, onResizeEnd }, 1)
    );

    act(() => result.current.startResize(100, 30));
    expect(result.current.isResizing).toBe(true);
    expect(onResizeStart).toHaveBeenCalledWith(30);

    act(() => result.current.stopResize());
    expect(result.current.isResizing).toBe(false);
    expect(onResizeEnd).toHaveBeenCalledWith(result.current.width);
  });

  it('adjustWidthByKeyboard changes width by keyboardStep', () => {
    const onWidthChange = jest.fn();
    const { result } = renderHook(() =>
      useResizeState(30, { minWidth: 10, maxWidth: 90 }, { onWidthChange }, 2)
    );

    act(() => result.current.adjustWidthByKeyboard('right'));
    expect(onWidthChange).toHaveBeenCalled();
    expect(result.current.width).toBeGreaterThan(30);
  });

  it('persists width to localStorage when persistenceKey is provided', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() =>
      useResizeState(30, { minWidth: 10, maxWidth: 90 }, {}, 1, 'my-key')
    );

    act(() => result.current.updateWidth(40));
    expect(setItemSpy).toHaveBeenCalledWith('my-key', '40');
    setItemSpy.mockRestore();
  });

  it('loads persisted width from localStorage', async () => {
    localStorage.setItem('persist-key', '45');
    const { result } = renderHook(() =>
      useResizeState(30, { minWidth: 10, maxWidth: 90 }, {}, 1, 'persist-key')
    );

    await waitFor(() => {
      expect(result.current.width).toBe(45);
    });
  });
});

describe('useMouseEvents', () => {
  it('handleMouseMove computes new width and calls updateWidth', () => {
    const updateWidth = jest.fn();
    const stopResize = jest.fn();

    const resizeState = {
      isResizing: true,
      startWidth: 30,
      startX: 100,
      updateWidth,
      stopResize,
    } as any;

    const parent = document.createElement('div');
    parent.getBoundingClientRect = jest.fn(() => ({ width: 1000 } as any));
    const root = document.createElement('div');
    parent.appendChild(root);
    document.body.appendChild(parent);

    const rootRef = { current: root };

    const { result } = renderHook(() => useMouseEvents(resizeState, rootRef as any, 'right'));

    act(() => {
      result.current.handleMouseMove({ clientX: 200 } as MouseEvent);
    });

    expect(updateWidth).toHaveBeenCalledWith(40);

    document.body.removeChild(parent);
  });
});

describe('useGlobalEventListeners', () => {
  it('attaches and detaches document listeners', () => {
    const mv = jest.fn();
    const mu = jest.fn();

    const { unmount } = renderHook(() =>
      useGlobalEventListeners({ handleMouseMove: mv, handleMouseUp: mu } as any)
    );

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });

    expect(mv).toHaveBeenCalled();
    expect(mu).toHaveBeenCalled();

    mv.mockClear();
    mu.mockClear();

    unmount();

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });

    expect(mv).not.toHaveBeenCalled();
    expect(mu).not.toHaveBeenCalled();
  });
});