import { createRef } from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит input элемент', () => {
      render(<TextInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('рендерит с label', () => {
      render(<TextInput label="Имя" />);
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    it('рендерит без label', () => {
      render(<TextInput placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('применяет placeholder', () => {
      render(<TextInput placeholder="Type here..." />);
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });

    it('рендерит с начальным значением', () => {
      render(<TextInput value="Initial text" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial text');
    });

    it('рендерит с type="text" по умолчанию', () => {
      render(<TextInput />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });
  });

  describe('Контролируемый компонент', () => {
    it('обновляет значение при onChange', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<TextInput onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'New text');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('New text');
    });

    it('работает как контролируемый компонент', () => {
      const { rerender } = render(<TextInput value="Value 1" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Value 1');

      rerender(<TextInput value="Value 2" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Value 2');
    });

    it('синхронизирует внешнее значение с внутренним состоянием', () => {
      const { rerender } = render(<TextInput value="" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveValue('');

      rerender(<TextInput value="External update" />);
      expect(input).toHaveValue('External update');
    });
  });

  describe('Взаимодействие', () => {
    it('вызывает onChange при вводе', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<TextInput onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('вызывает onFocus при фокусе', () => {
      const handleFocus = jest.fn();
      render(<TextInput onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('вызывает onBlur при потере фокуса', () => {
      const handleBlur = jest.fn();
      render(<TextInput onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('вызывает onKeyDown при нажатии клавиши', () => {
      const handleKeyDown = jest.fn();
      render(<TextInput onKeyDown={handleKeyDown} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Состояния', () => {
    it('отображается как disabled', () => {
      render(<TextInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('не принимает ввод когда disabled', async () => {
      const user = userEvent.setup();
      render(<TextInput disabled />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'Test');

      expect(input.value).toBe('');
    });

    it('отображается как readOnly', () => {
      render(<TextInput readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('поддерживает required атрибут', () => {
      render(<TextInput required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('поддерживает name атрибут', () => {
      render(<TextInput name="username" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
    });

    it('поддерживает maxLength атрибут', () => {
      render(<TextInput maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10');
    });

    it('поддерживает minLength атрибут', () => {
      render(<TextInput minLength={3} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '3');
    });
  });

  describe('Различные типы input', () => {
    it('рендерит input с type="password"', () => {
      const { container } = render(<TextInput type="password" />);
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });

    it('рендерит input с type="email"', () => {
      render(<TextInput type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('рендерит input с type="number"', () => {
      render(<TextInput type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('рендерит input с type="tel"', () => {
      render(<TextInput type="tel" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });

    it('рендерит input с type="url"', () => {
      render(<TextInput type="url" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'url');
    });

    it('рендерит input с type="search"', () => {
      render(<TextInput type="search" />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });

  describe('CSS классы', () => {
    it('применяет корневой className', () => {
      const { container } = render(<TextInput className="custom-root" />);
      expect(container.firstChild).toHaveClass('custom-root');
    });

    it('применяет inputClassName', () => {
      render(<TextInput inputClassName="custom-input" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });

    it('применяет labelClassName', () => {
      render(<TextInput label="Label" labelClassName="custom-label" />);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');
    });

    it('применяет базовые CSS классы', () => {
      const { container } = render(<TextInput label="Test" />);
      expect(container.firstChild).toHaveAttribute('class');
      expect(screen.getByRole('textbox')).toHaveAttribute('class');
      expect(screen.getByText('Test')).toHaveAttribute('class');
    });
  });

  describe('Accessibility', () => {
    it('связывает label с input через htmlFor/id', () => {
      render(<TextInput label="Username" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('генерирует уникальные id для разных input', () => {
      render(
        <>
          <TextInput label="First" name="first" />
          <TextInput label="Second" name="second" />
        </>
      );

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0].id).not.toBe(inputs[1].id);
    });

    it('имеет правильную роль textbox', () => {
      render(<TextInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('правильно работает с aria-attributes', () => {
      render(<TextInput aria-label="Custom aria label" aria-describedby="description" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('aria-label', 'Custom aria label');
      expect(input).toHaveAttribute('aria-describedby', 'description');
    });

    it('поддерживает aria-invalid', () => {
      render(<TextInput aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('поддерживает aria-required', () => {
      render(<TextInput aria-required="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('forwardRef', () => {
    it('передает ref на input элемент', () => {
      const ref = jest.fn();
      render(<TextInput ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it('позволяет доступ к input через ref', () => {
      const inputRef = createRef<HTMLInputElement>();
      render(<TextInput ref={inputRef} />);

      expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
      expect(inputRef.current?.tagName).toBe('INPUT');
    });

    it('позволяет вызывать методы input через ref', () => {
      const inputRef = createRef<HTMLInputElement>();
      render(<TextInput ref={inputRef} />);

      inputRef.current?.focus();
      expect(document.activeElement).toBe(inputRef.current);
    });
  });

  describe('Пользовательский ввод', () => {
    it('принимает пользовательский ввод', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'User input text');

      expect(input).toHaveValue('User input text');
    });

    it('ограничивает ввод при maxLength', async () => {
      const user = userEvent.setup();
      render(<TextInput maxLength={5} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'This is a very long text');

      expect(input.value.length).toBeLessThanOrEqual(5);
    });

    it('поддерживает вставку текста', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('Pasted text');

      expect(input).toHaveValue('Pasted text');
    });

    it('поддерживает очистку значения', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Some text');
      expect(input).toHaveValue('Some text');

      await user.clear(input);
      expect(input).toHaveValue('');
    });
  });

  describe('Комбинации свойств', () => {
    it('работает с label и placeholder одновременно', () => {
      render(<TextInput label="Name" placeholder="Enter your name..." />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your name...')).toBeInTheDocument();
    });

    it('работает с disabled и value', () => {
      render(<TextInput disabled value="Disabled text" readOnly />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveValue('Disabled text');
    });

    it('работает с required и label', () => {
      render(<TextInput label="Required field" required />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('работает со всеми props одновременно', () => {
      const handleChange = jest.fn();
      const handleFocus = jest.fn();

      render(
        <TextInput
          label="Complete"
          placeholder="Enter..."
          value="Text"
          onChange={handleChange}
          onFocus={handleFocus}
          name="complete"
          type="email"
          required
          maxLength={100}
          className="custom"
          inputClassName="custom-input"
          labelClassName="custom-label"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Text');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('name', 'complete');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('maxlength', '100');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Крайние случаи', () => {
    it('обрабатывает пустое значение', () => {
      render(<TextInput value="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('обрабатывает undefined value', () => {
      render(<TextInput value={undefined} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('обрабатывает очень длинный текст', () => {
      const longText = 'a'.repeat(1000);
      render(<TextInput value={longText} readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue(longText);
    });

    it('обрабатывает специальные символы', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, '!@#$%^&*()');

      expect(input).toHaveValue('!@#$%^&*()');
    });

    it('обрабатывает unicode символы', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, '🎉 Привет 世界');

      expect(input).toHaveValue('🎉 Привет 世界');
    });

    it('обрабатывает пробелы', async () => {
      const user = userEvent.setup();
      render(<TextInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, '   spaces   ');

      expect(input).toHaveValue('   spaces   ');
    });
  });

  describe('Числовые input', () => {
    it('поддерживает min/max для type="number"', () => {
      render(<TextInput type="number" min={0} max={100} />);
      const input = screen.getByRole('spinbutton');

      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('поддерживает step для type="number"', () => {
      render(<TextInput type="number" step={0.1} />);
      const input = screen.getByRole('spinbutton');

      expect(input).toHaveAttribute('step', '0.1');
    });
  });

  describe('Паттерны и валидация', () => {
    it('поддерживает pattern атрибут', () => {
      render(<TextInput pattern="[0-9]*" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]*');
    });

    it('поддерживает autocomplete атрибут', () => {
      render(<TextInput autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
    });

    it('поддерживает inputMode атрибут', () => {
      render(<TextInput inputMode="numeric" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'numeric');
    });
  });
});
