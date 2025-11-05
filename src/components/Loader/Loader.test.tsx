import { createRef } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Loader } from './Loader';

describe('Loader', () => {
  it('рендерит индикатор со значениями по умолчанию', () => {
    render(<Loader />);

    const loader = screen.getByRole('status');

    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-live', 'polite');

    const hiddenLabel = loader.querySelector('span');
    expect(hiddenLabel).toBeInTheDocument();
    expect(hiddenLabel).toHaveTextContent('Загрузка…');
  });

  it.each([
    ['s', 'size_s'],
    ['m', 'size_m'],
    ['l', 'size_l'],
    ['xl', 'size_xl'],
  ] as const)('поддерживает размер %s', (size, _className) => {
    render(<Loader size={size} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.each([
    ['brand', 'variant_brand'],
    ['neutral', 'variant_neutral'],
    ['contrast', 'variant_contrast'],
    ['success', 'variant_success'],
    ['danger', 'variant_danger'],
  ] as const)('поддерживает вариант %s', (variant, _className) => {
    render(<Loader variant={variant} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('добавляет класс paused при паузе анимации', () => {
    render(<Loader paused />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('рендерит кастомный скрытый label', () => {
    render(<Loader label="Обновление данных" />);
    expect(screen.getByText('Обновление данных')).toBeInTheDocument();
  });

  it('использует aria-label и не рендерит скрытый label, если передан aria-label', () => {
    render(<Loader aria-label="Загрузка профиля" label="Не должен отображаться" />);
    const loader = screen.getByRole('status', { name: 'Загрузка профиля' });
    expect(loader).not.toHaveTextContent('Не должен отображаться');
    expect(screen.queryByText('Не должен отображаться')).not.toBeInTheDocument();
  });

  it('форвардит ref на DOM-элемент', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Loader ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('применяет пользовательские html-атрибуты', () => {
    render(<Loader data-testid="loader" aria-live="assertive" role="alert" />);
    const loader = screen.getByTestId('loader');
    expect(loader).toHaveAttribute('aria-live', 'assertive');
    expect(loader).toHaveAttribute('role', 'alert');
  });
});
