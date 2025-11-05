import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextArea } from './TextArea';

describe('TextArea', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит textarea элемент', () => {
      render(<TextArea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('рендерит с label', () => {
      render(<TextArea label="Комментарий" />);
      expect(screen.getByLabelText('Комментарий')).toBeInTheDocument();
    });

    it('рендерит без label', () => {
      render(<TextArea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('применяет placeholder', () => {
      render(<TextArea placeholder="Type here..." />);
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });

    it('рендерит с начальным значением', () => {
      render(<TextArea value="Initial text" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial text');
    });
  });

  describe('Контролируемый компонент', () => {
    it('обновляет значение при onChange', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<TextArea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'New text');

      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('New text');
    });

    it('работает как контролируемый компонент', () => {
      const { rerender } = render(<TextArea value="Value 1" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Value 1');

      rerender(<TextArea value="Value 2" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Value 2');
    });

    it('синхронизирует внешнее значение с внутренним состоянием', () => {
      const { rerender } = render(<TextArea value="" />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('');

      rerender(<TextArea value="External update" />);
      expect(textarea).toHaveValue('External update');
    });
  });

  describe('Обработка событий', () => {
    it('вызывает onSubmit при Ctrl+Enter', () => {
      const handleSubmit = jest.fn();
      render(<TextArea onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onSubmit при обычном Enter', () => {
      const handleSubmit = jest.fn();
      render(<TextArea onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter' });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('не вызывает onSubmit при Ctrl без Enter', () => {
      const handleSubmit = jest.fn();
      render(<TextArea onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'a', ctrlKey: true });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('очищает значение после onSubmit если не контролируемый', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(<TextArea onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Some text');
      expect(textarea).toHaveValue('Some text');

      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

      expect(handleSubmit).toHaveBeenCalled();
      expect(textarea).toHaveValue('');
    });

    it('не очищает значение после onSubmit если контролируемый', async () => {
      const handleSubmit = jest.fn();
      const handleChange = jest.fn();

      render(<TextArea value="Controlled" onChange={handleChange} onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

      expect(handleSubmit).toHaveBeenCalled();
      expect(textarea).toHaveValue('Controlled');
    });
  });

  describe('Состояния', () => {
    it('отображается как disabled', () => {
      render(<TextArea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('отображается как readOnly', () => {
      render(<TextArea readOnly />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('поддерживает required атрибут', () => {
      render(<TextArea required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('поддерживает name атрибут', () => {
      render(<TextArea name="comment" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'comment');
    });

    it('поддерживает rows атрибут', () => {
      render(<TextArea rows={5} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    });

    it('поддерживает maxLength атрибут', () => {
      render(<TextArea maxLength={100} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '100');
    });
  });

  describe('Auto-resize функциональность', () => {
    it('применяет minHeight style по умолчанию', () => {
      render(<TextArea minHeight={150} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveStyle({ minHeight: '150px' });
    });

    it('не применяет minHeight style если autoResize отключен', () => {
      render(<TextArea autoResize={false} minHeight={150} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.style.minHeight).toBe('');
    });

    it('использует дефолтную minHeight 200px', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveStyle({ minHeight: '200px' });
    });
  });

  describe('CSS классы', () => {
    it('применяет корневой className', () => {
      const { container } = render(<TextArea className="custom-root" />);
      expect(container.firstChild).toHaveClass('custom-root');
    });

    it('применяет textareaClassName', () => {
      render(<TextArea textareaClassName="custom-textarea" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
    });

    it('применяет labelClassName', () => {
      render(<TextArea label="Label" labelClassName="custom-label" />);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');
    });

    it('применяет базовые CSS классы', () => {
      const { container } = render(<TextArea label="Test" />);
      // CSS модули трансформируют имена классов, просто проверяем наличие классов
      expect(container.firstChild).toHaveAttribute('class');
      expect(screen.getByRole('textbox')).toHaveAttribute('class');
      expect(screen.getByText('Test')).toHaveAttribute('class');
    });
  });

  describe('Accessibility', () => {
    it('связывает label с textarea через htmlFor/id', () => {
      render(<TextArea label="Description" />);
      const label = screen.getByText('Description');
      const textarea = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for');
      expect(textarea).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(textarea.getAttribute('id'));
    });

    it('генерирует уникальные id для разных textarea', () => {
      render(
        <>
          <TextArea label="First" name="first" />
          <TextArea label="Second" name="second" />
        </>
      );

      const textareas = screen.getAllByRole('textbox');
      expect(textareas[0].id).not.toBe(textareas[1].id);
    });

    it('имеет правильную роль textbox', () => {
      render(<TextArea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('правильно работает с aria-attributes', () => {
      render(<TextArea aria-label="Custom aria label" aria-describedby="description" />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-label', 'Custom aria label');
      expect(textarea).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('forwardRef', () => {
    it('передает ref на textarea элемент', () => {
      const ref = jest.fn();
      render(<TextArea ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('позволяет доступ к textarea через ref', () => {
      const textareaRef = { current: null as globalThis.HTMLTextAreaElement | null };

      render(<TextArea ref={textareaRef} />);

      expect(textareaRef.current).toBeInstanceOf(globalThis.HTMLTextAreaElement);
      expect(textareaRef.current?.tagName).toBe('TEXTAREA');
    });
  });

  describe('Пользовательский ввод', () => {
    it('принимает пользовательский ввод', async () => {
      const user = userEvent.setup();
      render(<TextArea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'User input text');

      expect(textarea).toHaveValue('User input text');
    });

    it('поддерживает многострочный ввод', async () => {
      const user = userEvent.setup();
      render(<TextArea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('ограничивает ввод при maxLength', async () => {
      const user = userEvent.setup();
      render(<TextArea maxLength={10} />);

      const textarea = screen.getByRole('textbox') as globalThis.HTMLTextAreaElement;
      await user.type(textarea, 'This is a very long text');

      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Комбинации свойств', () => {
    it('работает с label и placeholder одновременно', () => {
      render(<TextArea label="Comment" placeholder="Type your comment..." />);

      expect(screen.getByLabelText('Comment')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type your comment...')).toBeInTheDocument();
    });

    it('работает с disabled и value', () => {
      render(<TextArea disabled value="Disabled text" readOnly />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveValue('Disabled text');
    });

    it('работает с required и label', () => {
      render(<TextArea label="Required field" required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('работает со всеми props одновременно', () => {
      const handleChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <TextArea
          label="Complete"
          placeholder="Enter..."
          value="Text"
          onChange={handleChange}
          onSubmit={handleSubmit}
          name="complete"
          required
          minHeight={150}
          autoResize
          className="custom"
          textareaClassName="custom-input"
          labelClassName="custom-label"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('Text');
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('name', 'complete');
      expect(textarea).toHaveClass('custom-input');
    });
  });

  describe('Край случаи', () => {
    it('обрабатывает пустое значение', () => {
      render(<TextArea value="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('обрабатывает undefined value', () => {
      render(<TextArea value={undefined} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('обрабатывает очень длинный текст', () => {
      const longText = 'a'.repeat(10000);
      render(<TextArea value={longText} readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue(longText);
    });

    it('обрабатывает специальные символы', async () => {
      const user = userEvent.setup();
      render(<TextArea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '!@#$%^&*()');

      expect(textarea).toHaveValue('!@#$%^&*()');
    });

    it('обрабатывает unicode символы', async () => {
      const user = userEvent.setup();
      render(<TextArea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '🎉 Привет 世界');

      expect(textarea).toHaveValue('🎉 Привет 世界');
    });
  });
});
