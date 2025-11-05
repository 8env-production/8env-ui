import '@testing-library/jest-dom';
import type { CSSProperties } from 'react';
import { render, screen } from '@testing-library/react';

import { Logo } from './Logo';

describe('Logo', () => {
  it('рендерит как span по умолчанию', () => {
    const { container } = render(<Logo />);
    const element = container.querySelector('span');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-label', 'Логотип 8env');
    expect(element?.style.getPropertyValue('--logo-size')).toBe('2.5rem');
  });

  it('рендерит как ссылку при наличии href', () => {
    render(<Logo href="/home" ariaLabel="На главную" />);
    const link = screen.getByRole('link', { name: 'На главную' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  it('устанавливает rel="noopener noreferrer" при target="_blank"', () => {
    render(<Logo href="https://example.com" target="_blank" />);
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('поддерживает числовые размеры', () => {
    const { container } = render(<Logo size={64} />);
    const element = container.querySelector('span');

    expect(element?.style.getPropertyValue('--logo-size')).toBe('64px');
  });

  it('поддерживает кастомный CSS размер', () => {
    const { container } = render(<Logo size="5rem" />);
    const element = container.querySelector('span');

    expect(element?.style.getPropertyValue('--logo-size')).toBe('5rem');
  });

  it('учитывает кастомные классы и стили', () => {
    const customStyle = { color: 'red' } as CSSProperties;
    const { container } = render(<Logo className="custom-class" style={customStyle} size="3rem" />);
    const element = container.querySelector('span');

    expect(element).toHaveClass('custom-class');
    expect(element?.style.getPropertyValue('--logo-size')).toBe('3rem');
    expect(element?.style.color).toBe('red');
  });

  it('отключает бордер и тень при соответствующих пропсах', () => {
    const { container } = render(<Logo bordered={false} withShadow={false} />);
    const element = container.querySelector('span');

    expect(element?.getAttribute('data-has-border')).toBe('false');
    expect(element?.getAttribute('data-has-shadow')).toBe('false');
  });
});