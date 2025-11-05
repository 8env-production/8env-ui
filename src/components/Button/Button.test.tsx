import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('рендерит кнопку с текстом', () => {
    render(<Button label="Нажми меня" />);
    expect(screen.getByRole('button', { name: 'Нажми меня' })).toBeInTheDocument();
  });

  it('рендерит кнопку с вариантом primary', () => {
    render(<Button label="Primary" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('рендерит кнопку с размером medium', () => {
    render(<Button label="Medium" size="medium" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
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
