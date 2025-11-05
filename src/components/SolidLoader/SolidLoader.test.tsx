import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SolidLoader } from './SolidLoader';

describe('SolidLoader', () => {
  it('рендерит children', () => {
    render(<SolidLoader isLoading={false}>Hello</SolidLoader>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('показывает overlay когда isLoading=true', () => {
    render(<SolidLoader isLoading={true}>Hello</SolidLoader>);
    const overlay = screen.getByTestId('solid-loader-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('class');
  });

  it('прячет overlay когда isLoading=false', () => {
    render(<SolidLoader isLoading={false}>Hello</SolidLoader>);
    const overlay = screen.getByTestId('solid-loader-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('class');
  });
});