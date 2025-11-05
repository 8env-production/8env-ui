import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { TextInput, TextInputProps } from './TextInput';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Метка для поля ввода',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder текст',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокировать поле',
    },
    readOnly: {
      control: 'boolean',
      description: 'Только для чтения',
    },
    required: {
      control: 'boolean',
      description: 'Обязательное поле',
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
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<TextInputProps>;

/**
 * Базовое использование TextInput
 */
export const Default: Story = {
  args: {
    label: 'Имя',
    placeholder: 'Введите ваше имя...',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * TextInput с заполненным значением
 */
export const WithValue: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

const ControlledComponent = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '400px' }}>
      <TextInput
        label="Контролируемое поле"
        placeholder="Начните печатать..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-color-secondary)',
        }}
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
      <div style={{ width: '400px' }}>
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
    value: 'Это поле доступно только для чтения',
    readOnly: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Обязательное поле
 */
export const Required: Story = {
  args: {
    label: 'Обязательное поле',
    placeholder: 'Это поле обязательно для заполнения',
    required: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
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
    placeholder: 'TextInput без метки',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с типом password
 */
export const Password: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с типом email
 */
export const Email: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    type: 'email',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с типом number
 */
export const Number: Story = {
  args: {
    label: 'Возраст',
    placeholder: '0',
    type: 'number',
    min: 0,
    max: 120,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Различные состояния
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '400px' }}>
      <TextInput label="Обычное поле" placeholder="Стандартное поле ввода" />

      <TextInput label="С текстом" value="Текст, который можно редактировать" />

      <TextInput label="Заблокированное" value="Нельзя изменить" disabled />

      <TextInput label="Только чтение" value="Можно читать, но не изменять" readOnly />

      <TextInput label="Обязательное" placeholder="Обязательное поле" required />

      <TextInput label="Email" placeholder="your@email.com" type="email" />

      <TextInput label="Пароль" placeholder="********" type="password" />

      <TextInput label="Число" placeholder="0" type="number" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех вариантов и состояний компонента TextInput',
      },
    },
  },
};

const FormWithValidationComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setPassword('');
    }, 2000);
  };

  return (
    <div style={{ width: '400px' }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <TextInput
          label="Email"
          placeholder="your@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextInput
          label="Пароль"
          placeholder="Минимум 6 символов"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            background: 'var(--color-brand)',
            color: 'var(--color-text-brand-background)',
            border: 'none',
            borderRadius: 'var(--border-radius-50)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Войти
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--color-danger)',
            color: 'white',
            borderRadius: 'var(--border-radius-50)',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

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
          ✓ Успешный вход!
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
        story: 'Пример формы входа с валидацией полей',
      },
    },
  },
};

const FormWithMultipleFieldsComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div style={{ width: '500px' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <TextInput
            label="Имя"
            placeholder="Иван"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            required
          />

          <TextInput
            label="Фамилия"
            placeholder="Иванов"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            required
          />
        </div>

        <TextInput
          label="Email"
          placeholder="your@email.com"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />

        <TextInput
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
        />

        <div
          style={{
            padding: '1rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-50)',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Предпросмотр данных:</div>
          <div>Имя: {formData.firstName || '—'}</div>
          <div>Фамилия: {formData.lastName || '—'}</div>
          <div>Email: {formData.email || '—'}</div>
          <div>Телефон: {formData.phone || '—'}</div>
        </div>
      </form>
    </div>
  );
};

/**
 * Форма с несколькими полями
 */
export const FormWithMultipleFields: Story = {
  render: () => <FormWithMultipleFieldsComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Пример формы с несколькими полями ввода',
      },
    },
  },
};
