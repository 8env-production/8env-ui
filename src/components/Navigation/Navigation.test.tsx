import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Navigation } from './Navigation';

const createItems = (items: string[], prefix: string): ReactNode[] =>
  items.map((item, index) => (
    <span key={`${prefix}-${index}`} data-testid={`${prefix}-${index}`}>
      {item}
    </span>
  ));

describe('Navigation', () => {
  it('рендерит навигацию с логотипом и элементами', () => {
    const logoText = 'Логотип';
    const topItems = createItems(['Главная', 'Аналитика'], 'top');
    const bottomItems = createItems(['Настройки'], 'bottom');

    render(
      <Navigation
        logo={<div>{logoText}</div>}
        topItems={topItems}
        bottomItems={bottomItems}
        ariaLabel="Основная навигация"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Основная навигация' });
    expect(nav).toBeInTheDocument();

    expect(screen.getByText(logoText)).toBeInTheDocument();
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
  });

  it('использует кастомный акцент при передаче accent', () => {
    const bottomItems = createItems(['Footer'], 'bottom');

    render(
      <Navigation
        accent={
          <div data-testid="custom-accent">
            <span>Акцент</span>
          </div>
        }
        accentTestId="accent-svg"
        bottomItems={bottomItems}
      />,
    );

    expect(screen.getByTestId('custom-accent')).toBeInTheDocument();
    // Оригинальный SVG акцент не должен отображаться
    expect(screen.queryByTestId('accent-svg')).not.toBeInTheDocument();
  });

  it('применяет accentProps к стандартному акценту', () => {
    const bottomItems = createItems(['Footer'], 'bottom');
    render(<Navigation bottomItems={bottomItems} accentTestId="accent-svg" />);

    const svg = screen.getByTestId('accent-svg');
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('поддерживает кастомные className и style', () => {
    const { container } = render(
      <Navigation className="custom-navigation" style={{ width: '5rem' }} />,
    );

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-navigation');
    expect(nav).toHaveStyle({ width: '5rem' });
  });

  it('рендерит произвольное количество элементов в блоках', () => {
    const topItems = createItems(['Item 1', 'Item 2', 'Item 3'], 'top');
    const bottomItems = createItems(['Footer 1', 'Footer 2'], 'bottom');

    render(<Navigation topItems={topItems} bottomItems={bottomItems} />);

    expect(screen.getAllByTestId(/top-/)).toHaveLength(3);
    expect(screen.getAllByTestId(/bottom-/)).toHaveLength(2);
  });
});