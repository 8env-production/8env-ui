import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { TextArea, TextAreaProps } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Метка для textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder текст',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокировать textarea',
    },
    readOnly: {
      control: 'boolean',
      description: 'Только для чтения',
    },
    autoResize: {
      control: 'boolean',
      description: 'Автоматическое изменение высоты',
    },
    minHeight: {
      control: 'number',
      description: 'Минимальная высота в пикселях',
    },
    name: {
      control: 'text',
      description: 'Имя поля',
    },
    value: {
      control: 'text',
      description: 'Значение (контролируемый компонент)',
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<TextAreaProps>;

/**
 * Базовое использование TextArea
 */
export const Default: Story = {
  args: {
    label: 'Комментарий',
    placeholder: 'Введите ваш комментарий...',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * TextArea с заполненным значением
 */
export const WithValue: Story = {
  args: {
    label: 'Описание',
    value:
      'Это пример текста в textarea. Компонент автоматически подстраивает высоту под содержимое.',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * TextArea с длинным текстом
 */
export const WithLongText: Story = {
  args: {
    label: 'Развернутое описание',
    value: `Это пример длинного текста в textarea.

Компонент автоматически подстраивает высоту под содержимое, добавляя необходимое пространство.

Вы можете добавлять много строк текста, и textarea будет расти вместе с вашим контентом.

Это очень удобно для пользовательского опыта, так как не нужно прокручивать текст внутри небольшого окна.`,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

const ControlledComponent = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '500px' }}>
      <TextArea
        label="Контролируемое поле"
        placeholder="Начните печатать..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div
        style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}
      >
        Количество символов: {value.length}
      </div>
    </div>
  );
};

/**
 * Контролируемый компонент с состоянием
 */
export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Пример контролируемого компонента с отображением количества введенных символов',
      },
    },
  },
};

const WithSubmitComponent = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (value.trim()) {
      setMessages([...messages, value]);
      setValue('');
    }
  };

  return (
    <div style={{ width: '500px' }}>
      <TextArea
        label="Сообщение"
        placeholder="Введите сообщение и нажмите Ctrl+Enter для отправки"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSubmit={handleSubmit}
        minHeight={100}
      />
      {messages.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Отправленные сообщения:
          </div>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                background: 'var(--color-surface)',
                borderRadius: 'var(--border-radius-50)',
                fontSize: '0.875rem',
              }}
            >
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * TextArea с обработчиком отправки (Ctrl+Enter)
 */
export const WithSubmit: Story = {
  render: () => <WithSubmitComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Пример с обработкой отправки по Ctrl+Enter. Попробуйте ввести текст и нажать Ctrl+Enter',
      },
    },
  },
};

/**
 * Заблокированное поле
 */
export const Disabled: Story = {
  args: {
    label: 'Заблокированное поле',
    value: 'Это поле недоступно для редактирования',
    disabled: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле только для чтения
 */
export const ReadOnly: Story = {
  args: {
    label: 'Только для чтения',
    value: 'Это поле доступно только для чтения, но не заблокировано',
    readOnly: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Без автоматического изменения размера
 */
export const WithoutAutoResize: Story = {
  args: {
    label: 'Фиксированная высота',
    placeholder: 'Это поле не изменяет высоту автоматически',
    autoResize: false,
    minHeight: 150,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * С минимальной высотой
 */
export const CustomMinHeight: Story = {
  args: {
    label: 'Большая минимальная высота',
    placeholder: 'Это поле имеет минимальную высоту 300px',
    minHeight: 300,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Без метки
 */
export const WithoutLabel: Story = {
  args: {
    placeholder: 'TextArea без метки',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * С обязательным полем
 */
export const Required: Story = {
  args: {
    label: 'Обязательное поле',
    placeholder: 'Это поле обязательно для заполнения',
    required: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Различные размеры и состояния
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '600px' }}>
      <TextArea label="Обычное поле" placeholder="Стандартное textarea" />

      <TextArea
        label="С текстом"
        value="Текст, который можно редактировать"
        placeholder="Placeholder"
      />

      <TextArea label="Заблокированное" value="Нельзя изменить" disabled />

      <TextArea label="Только чтение" value="Можно читать, но не изменять" readOnly />

      <TextArea label="Маленькая высота" placeholder="Минимальная высота 100px" minHeight={100} />

      <TextArea
        label="Без изменения размера"
        placeholder="Фиксированная высота"
        autoResize={false}
        minHeight={120}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех вариантов и состояний компонента TextArea',
      },
    },
  },
};

const FormWithValidationComponent = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (e.target.value.length < 10) {
      setError('Минимум 10 символов');
    } else if (e.target.value.length > 200) {
      setError('Максимум 200 символов');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (!error && value.length >= 10) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setValue('');
      }, 2000);
    }
  };

  return (
    <div style={{ width: '500px' }}>
      <TextArea
        label="Отзыв (10-200 символов)"
        placeholder="Введите ваш отзыв..."
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
        minHeight={120}
      />
      <div
        style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: error ? 'var(--color-danger)' : 'var(--text-color-secondary)' }}>
          {error || `${value.length}/200`}
        </span>
        <span style={{ color: 'var(--text-color-secondary)' }}>Ctrl+Enter для отправки</span>
      </div>
      {submitted && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--color-success)',
            color: 'white',
            borderRadius: 'var(--border-radius-50)',
            textAlign: 'center',
          }}
        >
          ✓ Отзыв успешно отправлен!
        </div>
      )}
    </div>
  );
};

/**
 * Форма с валидацией
 */
export const FormWithValidation: Story = {
  render: () => <FormWithValidationComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Пример формы с валидацией длины текста и обратной связью',
      },
    },
  },
};
