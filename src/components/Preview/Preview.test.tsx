import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { Preview } from './Preview';

describe('Preview', () => {
  it('рендерит iframe с переданным url', () => {
    render(<Preview url="https://example.com" />);
    const iframe = screen.getByTitle('Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://example.com');
  });

  it('показывает кнопки управления и вызывает обработчики при клике', () => {
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const onOpen = jest.fn();

    render(<Preview url="about:blank" onClose={onClose} onEdit={onEdit} onOpen={onOpen} />);

    const closeBtn = screen.getByLabelText('Close preview');
    const editBtn = screen.getByLabelText('Edit preview');
    const openBtn = screen.getByLabelText('Open preview');

    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(openBtn);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('при нажатии на кнопку Refresh iframe пересоздаётся', () => {
    render(<Preview url="https://example.com" />);
    const iframeBefore = screen.getByTitle('Preview');
    fireEvent.click(screen.getByLabelText('Refresh'));
    const iframeAfter = screen.getByTitle('Preview');
    expect(iframeAfter).not.toBe(iframeBefore);
  });

  it('отображает url в адресной строке', () => {
    render(<Preview url="/edit" />);
    expect(screen.getByText('/edit')).toBeInTheDocument();
  });
});
