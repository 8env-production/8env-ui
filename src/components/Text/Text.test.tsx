import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Text } from './Text';

describe('Text', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит текст с content', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('рендерит с default вариантом как p элемент', () => {
      render(<Text>Body text</Text>);
      expect(screen.getByText('Body text').tagName).toBe('P');
    });

    it('рендерит title вариант как h1 элемент', () => {
      render(<Text variant="title">Title</Text>);
      expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
    });

    it('рендерит caption вариант как h3 элемент', () => {
      render(<Text variant="caption">Caption</Text>);
      expect(screen.getByRole('heading', { level: 3, name: 'Caption' })).toBeInTheDocument();
    });

    it('рендерит secondary вариант как span элемент', () => {
      render(<Text variant="secondary">Secondary</Text>);
      expect(screen.getByText('Secondary').tagName).toBe('SPAN');
    });

    it('рендерит tiny вариант как span элемент', () => {
      render(<Text variant="tiny">Tiny</Text>);
      expect(screen.getByText('Tiny').tagName).toBe('SPAN');
    });

    it('рендерит body вариант как p элемент', () => {
      render(<Text variant="body">Body</Text>);
      expect(screen.getByText('Body').tagName).toBe('P');
    });
  });

  describe('Варианты размеров (variant)', () => {
    const variants = ['title', 'body', 'secondary', 'caption', 'tiny'] as const;

    variants.forEach((variant) => {
      it(`рендерит variant="${variant}"`, () => {
        render(<Text variant={variant}>{variant}</Text>);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });
    });
  });

  describe('Цвета (color)', () => {
    it('рендерит с default цветом', () => {
      const { container } = render(<Text color="default">Text</Text>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('рендерит с contrast цветом', () => {
      const { container } = render(<Text color="contrast">Text</Text>);
      expect(container.firstChild).toHaveClass('color_contrast');
    });

    it('рендерит с brand цветом', () => {
      const { container } = render(<Text color="brand">Text</Text>);
      expect(container.firstChild).toHaveClass('color_brand');
    });

    it('не добавляет color класс для default', () => {
      const { container } = render(<Text color="default">Text</Text>);
      expect(container.firstChild).not.toHaveClass('color_default');
    });
  });

  describe('Модификаторы', () => {
    it('применяет uppercase модификатор', () => {
      const { container } = render(<Text isUppercase>Text</Text>);
      expect(container.firstChild).toHaveClass('uppercase');
    });

    it('применяет ellipsis модификатор', () => {
      const { container } = render(<Text textOverflow="ellipsis">Text</Text>);
      expect(container.firstChild).toHaveClass('ellipsis');
    });

    it('применяет withIcon модификатор', () => {
      const { container } = render(<Text withIcon>✓ Text</Text>);
      expect(container.firstChild).toHaveClass('withIcon');
    });

    it('применяет italic модификатор', () => {
      const { container } = render(<Text isItalic>Text</Text>);
      expect(container.firstChild).toHaveClass('isItalic');
    });

    it('не применяет ellipsis если textOverflow не указан', () => {
      const { container } = render(<Text>Text</Text>);
      expect(container.firstChild).not.toHaveClass('ellipsis');
    });

    it('не применяет uppercase если isUppercase не указан', () => {
      const { container } = render(<Text>Text</Text>);
      expect(container.firstChild).not.toHaveClass('uppercase');
    });
  });

  describe('Комбинирование свойств', () => {
    it('применяет несколько модификаторов одновременно', () => {
      const { container } = render(
        <Text variant="title" color="brand" isUppercase isItalic>
          Title
        </Text>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('uppercase', 'isItalic', 'color_brand', 'title');
    });

    it('комбинирует ellipsis с другими свойствами', () => {
      const { container } = render(
        <Text variant="body" textOverflow="ellipsis" color="contrast">
          Long text
        </Text>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('ellipsis', 'color_contrast', 'body');
    });

    it('комбинирует все модификаторы', () => {
      const { container } = render(
        <Text variant="body" color="brand" isUppercase textOverflow="ellipsis" withIcon isItalic>
          Complete
        </Text>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('uppercase', 'ellipsis', 'color_brand', 'withIcon', 'isItalic');
    });
  });

  describe('Children', () => {
    it('рендерит строку как children', () => {
      render(<Text>Simple text</Text>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('рендерит numbers как children', () => {
      render(<Text>{42}</Text>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('рендерит JSX элементы как children', () => {
      render(
        <Text>
          <span>Nested</span> content
        </Text>
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText(/content/)).toBeInTheDocument();
    });

    it('рендерит icon с текстом', () => {
      render(
        <Text withIcon>
          <span>✓</span> Success
        </Text>
      );
      expect(screen.getByText(/Success/)).toBeInTheDocument();
    });
  });

  describe('Default props', () => {
    it('использует variant="body" по умолчанию', () => {
      render(<Text>Default</Text>);
      const element = screen.getByText('Default');
      expect(element.tagName).toBe('P');
    });

    it('использует color="default" по умолчанию', () => {
      const { container } = render(<Text>Text</Text>);
      expect(container.firstChild).not.toHaveClass('color_default');
      expect(container.firstChild).not.toHaveClass('color_contrast');
      expect(container.firstChild).not.toHaveClass('color_brand');
    });

    it('не применяет модификаторы по умолчанию', () => {
      const { container } = render(<Text>Text</Text>);
      const element = container.firstChild as HTMLElement;
      expect(element).not.toHaveClass('uppercase');
      expect(element).not.toHaveClass('ellipsis');
      expect(element).not.toHaveClass('withIcon');
      expect(element).not.toHaveClass('isItalic');
    });
  });

  describe('CSS классы', () => {
    it('всегда содержит root класс', () => {
      const { container } = render(<Text>Text</Text>);
      expect(container.firstChild).toHaveClass('root');
    });

    it('содержит варианты класс', () => {
      const { container } = render(<Text variant="title">Text</Text>);
      expect(container.firstChild).toHaveClass('title');
    });

    it('применяет правильный класс для каждого варианта', () => {
      const variants = ['title', 'body', 'secondary', 'caption', 'tiny'] as const;

      variants.forEach((variant) => {
        const { container } = render(<Text variant={variant}>Text</Text>);
        expect(container.firstChild).toHaveClass(variant);
      });
    });

    it('применяет правильные классы для всех цветов', () => {
      const colors = ['default', 'contrast', 'brand'] as const;

      colors.forEach((color) => {
        const { container } = render(<Text color={color}>Text</Text>);
        const element = container.firstChild as HTMLElement;

        if (color === 'default') {
          expect(element.className).not.toMatch(/color_/);
        } else {
          expect(element).toHaveClass(`color_${color}`);
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('рендерит семантически правильный HTML', () => {
      render(
        <>
          <Text variant="title">Page Title</Text>
          <Text variant="body">Main content</Text>
          <Text variant="caption">Caption text</Text>
        </>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page Title');
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Caption text');
    });

    it('поддерживает aria атрибуты через children', () => {
      render(
        <Text>
          <span aria-label="Important">Content</span>
        </Text>
      );

      expect(screen.getByLabelText('Important')).toBeInTheDocument();
    });
  });

  describe('Все варианты вместе', () => {
    it('отображает все варианты без ошибок', () => {
      const variants = ['title', 'body', 'secondary', 'caption', 'tiny'] as const;
      const colors = ['default', 'contrast', 'brand'] as const;

      const { container } = render(
        <>
          {variants.map((variant) =>
            colors.map((color) => (
              <Text key={`${variant}-${color}`} variant={variant} color={color}>
                {variant} - {color}
              </Text>
            ))
          )}
        </>
      );

      expect(container).toBeInTheDocument();
      variants.forEach((variant) => {
        colors.forEach((color) => {
          expect(screen.getByText(`${variant} - ${color}`)).toBeInTheDocument();
        });
      });
    });
  });
});
