import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SolidLoader } from './SolidLoader';

describe('SolidLoader', () => {
  it('рендерит children', () => {
    render(<SolidLoader isLoading={false}>Hello</SolidLoader>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('показывает overlay когда isLoading=true', () => {
    const { container } = render(<SolidLoader isLoading={true}>Hello</SolidLoader>);
    const overlay = container.querySelector('.loader');
    expect(overlay).toBeInTheDocument();
    expect(overlay).not.toHaveClass('hidden');
  });

  it('прячет overlay когда isLoading=false', () => {
    const { container } = render(<SolidLoader isLoading={false}>Hello</SolidLoader>);
    const overlay = container.querySelector('.loader');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('hidden');
  });
});