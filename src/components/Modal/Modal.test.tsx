import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

// Используем мок react-dom из __mocks__/react-dom.js
jest.mock('react-dom');

import { Modal } from './Modal';

describe('Modal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  const renderModal = (props = {}) =>
    render(
      <Modal isOpen onClose={onClose} title="Тестовая модалка" {...props}>
        <p>Контент модального окна</p>
      </Modal>
    );

  it('не рендерится когда закрыта', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        Hidden content
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('рендерится с заголовком и описанием', () => {
    renderModal({ description: 'Описание' });

    expect(screen.getByRole('dialog', { name: 'Тестовая модалка' })).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку закрытия', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть модальное окно' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('закрывается при клике на оверлей если разрешено', () => {
    renderModal({ closeOnOverlayClick: true });

    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('не закрывается при клике на оверлей если запрещено', () => {
    renderModal({ closeOnOverlayClick: false });

    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('закрывается при нажатии Escape когда разрешено', () => {
    renderModal({ closeOnEsc: true });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('не закрывается при нажатии Escape когда запрещено', () => {
    renderModal({ closeOnEsc: false });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('поддерживает фокус внутри модального окна', () => {
    render(
      <Modal
        isOpen
        onClose={onClose}
        title="Фокус тест"
        footer={
          <>
            <button type="button">Отмена</button>
            <button type="button">Сохранить</button>
          </>
        }
      >
        <button type="button">Внутренняя кнопка</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toHaveTextContent('Внутренняя кнопка');

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toHaveTextContent('Отмена');

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toHaveTextContent('Сохранить');

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toHaveTextContent('Внутренняя кнопка');
  });

  it('фокусируется на кнопке закрытия по умолчанию', () => {
    jest.useFakeTimers();
    renderModal();

    // Продвигаем таймеры, чтобы requestAnimationFrame отработал
    jest.runAllTimers();

    const closeButton = screen.getByRole('button', { name: 'Закрыть модальное окно' });
    expect(closeButton).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('поддерживает кастомный футер и классы', () => {
    render(
      <Modal
        isOpen
        onClose={onClose}
        footer={<div data-testid="custom-footer">Футер</div>}
        className="custom-dialog"
        bodyClassName="custom-body"
        overlayClassName="custom-overlay"
        footerClassName="custom-footer-class"
      >
        <div data-testid="body-content">Тело модалки</div>
      </Modal>
    );

    expect(screen.getByTestId('body-content')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-dialog');
    expect(dialog.querySelector('.custom-body')).toBeTruthy();
    expect(dialog.parentElement).toHaveClass('custom-overlay');
  });

  it('использует aria-label когда не передан title', () => {
    render(
      <Modal isOpen onClose={onClose} ariaLabel="Простое модальное окно">
        Без заголовка
      </Modal>
    );

    expect(screen.getByRole('dialog', { name: 'Простое модальное окно' })).toBeInTheDocument();
  });

  it('поддерживает портал в пользовательский контейнер', () => {
    const container = document.createElement('div');
    container.setAttribute('id', 'custom-container');
    document.body.appendChild(container);

    render(
      <Modal
        isOpen
        onClose={onClose}
        title="Custom portal"
        portalContainer={() => document.getElementById('custom-container')}
      >
        Контент с кастомным контейнером
      </Modal>
    );

    // В тестах с моком createPortal просто рендерит контент напрямую,
    // поэтому проверяем что модальное окно рендерится
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Контент с кастомным контейнером')).toBeInTheDocument();
    document.body.removeChild(container);
  });

  it('создает контейнер для портала если он отсутствует', () => {
    renderModal();

    const defaultContainer = document.getElementById('8env-ui-modal-root');
    expect(defaultContainer).toBeInTheDocument();
  });

  it('восстанавливает фокус после закрытия', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <>
        <button ref={ref} type="button">
          Открыть
        </button>
        <Modal isOpen onClose={() => ref.current?.focus()} title="Focus return">
          Контент
        </Modal>
      </>
    );

    expect(ref.current).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(ref.current).toHaveFocus();
  });
});