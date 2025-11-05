import { createRef } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Icon } from './Icon';

describe('Icon', () => {
  it('рендерит содержимое', () => {
    render(
      <Icon>
        <svg data-testid="icon" />
      </Icon>,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('по умолчанию применяет размер m', () => {
    render(
      <Icon>
        <svg role="img" aria-label="Icon" />
      </Icon>,
    );

    const wrapper = screen.getByRole('img').parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveAttribute('data-size', 'm');
  });

  it('применяет модификатор размера', () => {
    render(
      <Icon size="l">
        <svg role="img" aria-label="Icon" />
      </Icon>,
    );

    const wrapper = screen.getByRole('img').parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveAttribute('data-size', 'l');
  });

  it('делает иконку доступной при наличии aria-label', () => {
    render(
      <Icon aria-label="Уведомление">
        <svg />
      </Icon>,
    );

    const element = screen.getByRole('img', { name: 'Уведомление' });
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-hidden', 'false');
  });

  it('скрывает иконку от assistive technologies без доступного имени', () => {
    render(
      <Icon data-testid="icon-wrapper">
        <svg />
      </Icon>,
    );

    const wrapper = screen.getByTestId('icon-wrapper');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).not.toHaveAttribute('role');
  });

  it('передает ref', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Icon ref={ref} aria-label="Ref icon">
        <svg />
      </Icon>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('добавляет пользовательский className', () => {
    render(
      <Icon className="custom-class" aria-label="Custom class">
        <svg />
      </Icon>,
    );

    const element = screen.getByRole('img', { name: 'Custom class' });
    expect(element).toHaveClass('custom-class');
  });
});