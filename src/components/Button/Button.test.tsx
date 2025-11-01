import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  it('рендерит кнопку с текстом', () => {
    render(<Button label="Нажми меня" />);
    expect(screen.getByRole('button', { name: 'Нажми меня' })).toBeInTheDocument();
  });

  it('применяет правильные CSS классы для варианта primary', () => {
    render(<Button label="Primary" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary');
  });

  it('применяет правильные CSS классы для размера medium', () => {
    render(<Button label="Medium" size="medium" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--medium');
  });

  it('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button label="Кликни" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onClick когда disabled', () => {
    const handleClick = jest.fn();
    render(<Button label="Disabled" disabled onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('отображается как disabled', () => {
    render(<Button label="Disabled" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
