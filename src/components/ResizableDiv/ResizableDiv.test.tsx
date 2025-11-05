import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { ResizableDiv } from './ResizableDiv';

describe('ResizableDiv', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders children and applies initial width', () => {
    render(<ResizableDiv initialWidth={30}>Content</ResizableDiv>);
    const container = screen.getByTestId('resizable-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle('min-width: 30%');
    expect(container).toHaveStyle('max-width: 30%');
    const content = screen.getByTestId('resizable-content');
    expect(content).toBeInTheDocument();
  });

  it('keyboard arrow adjusts width and calls onWidthChange', () => {
    const onWidthChange = jest.fn();
    render(<ResizableDiv initialWidth={30} onWidthChange={onWidthChange} />);
    const resizer = screen.getByTestId('resizer-right');
    resizer.focus();
    fireEvent.keyDown(resizer, { key: 'ArrowRight' });
    expect(onWidthChange).toHaveBeenCalled();
    const container = screen.getByTestId('resizable-container');
    expect(container.style.minWidth).toBe('31%');
  });

  it('mousedown then mousemove updates width (mouse interaction)', () => {
    const onWidthChange = jest.fn();
    const wrapper = document.createElement('div');
    wrapper.style.width = '1000px';
    document.body.appendChild(wrapper);

    // render into wrapper so parentElement has known size
    const { unmount } = render(<ResizableDiv initialWidth={30} onWidthChange={onWidthChange} />, { container: wrapper });

    const container = screen.getByTestId('resizable-container');
    const parent = container.parentElement as HTMLElement;
    parent.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 100,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    const resizer = screen.getByTestId('resizer-right');
    fireEvent.mouseDown(resizer, { clientX: 100 });

    // move to 200 -> delta 100px => 10% change
    fireEvent.mouseMove(document, { clientX: 200 });

    // Expect callback with 40 (30 + 10)
    expect(onWidthChange).toHaveBeenCalledWith(40);

    // cleanup
    unmount();
    document.body.removeChild(wrapper);
  });

  it('does not start resizing when disabled', () => {
    const onResizeStart = jest.fn();
    render(<ResizableDiv disabled onResizeStart={onResizeStart} />);
    const resizer = screen.getByTestId('resizer-right');
    fireEvent.mouseDown(resizer, { clientX: 50 });
    expect(onResizeStart).not.toHaveBeenCalled();
  });
});