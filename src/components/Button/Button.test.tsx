import { createRef } from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит кнопку с текстом', () => {
      render(<Button>Нажми меня</Button>);
      expect(screen.getByRole('button', { name: 'Нажми меня' })).toBeInTheDocument();
    });

    it('рендерит кнопку с различными view', () => {
      const { rerender } = render(<Button view="action">Action</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button view="success">Success</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button view="danger">Danger</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Взаимодействие', () => {
    it('вызывает onClick при клике', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Кликни</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onClick когда disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('отображается как disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Режим ссылки', () => {
    it('рендерит как ссылку когда передан href', () => {
      render(<Button href="/test">Link</Button>);
      const link = screen.getByRole('link', { name: 'Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('добавляет rel="noopener noreferrer" для target="_blank"', () => {
      render(
        <Button href="https://example.com" target="_blank">
          External Link
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('не добавляет rel для внутренних ссылок', () => {
      render(<Button href="/internal">Internal Link</Button>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('rel');
    });

    it('рендерит ссылку с различными view', () => {
      const { rerender } = render(
        <Button href="/test" view="action">
          Link
        </Button>
      );
      expect(screen.getByRole('link')).toBeInTheDocument();

      rerender(
        <Button href="/test" view="outlined">
          Link
        </Button>
      );
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Форвард ref', () => {
    it('передает ref для кнопки', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Button');
    });

    it('передает ref для ссылки', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Button ref={ref} href="/test">
          Link
        </Button>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current?.textContent).toBe('Link');
    });
  });

  describe('Дополнительные пропсы', () => {
    it('передает type для кнопки', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('устанавливает type="button" по умолчанию', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('передает aria атрибуты', () => {
      render(
        <Button aria-label="Close dialog" aria-pressed="true">
          Close
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('передает data атрибуты', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Модификаторы', () => {
    it('принимает модификаторы fullWidth', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('принимает модификаторы isIcon', () => {
      render(<Button isIcon>✕</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('принимает модификаторы withEllipsis', () => {
      render(<Button withEllipsis>Long text</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('принимает модификаторы textAlign', () => {
      render(<Button textAlign="left">Left</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('принимает модификаторы withoutAnimation', () => {
      render(<Button withoutAnimation>No animation</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('принимает модификаторы noPaddings', () => {
      render(<Button noPaddings>No paddings</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Комбинация свойств', () => {
    it('правильно работает с несколькими модификаторами', () => {
      render(
        <Button view="action" fullWidth withEllipsis disabled>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('работает как ссылка с модификаторами', () => {
      render(
        <Button href="/test" view="outlined" fullWidth>
          Link Button
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Все варианты view', () => {
    const views = [
      'action',
      'success',
      'flat',
      'flat-danger',
      'flat-action',
      'flat-success',
      'default',
      'danger',
      'outlined',
      'outlined-danger',
      'outlined-success',
    ] as const;

    views.forEach((view) => {
      it(`рендерит view="${view}"`, () => {
        render(<Button view={view}>{view}</Button>);
        expect(screen.getByRole('button', { name: view })).toBeInTheDocument();
      });
    });
  });
});
