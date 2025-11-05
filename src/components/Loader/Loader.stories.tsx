import type { Meta, StoryObj } from '@storybook/react';

import { Loader, type LoaderProps } from './Loader';

const meta = {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['s', 'm', 'l', 'xl'],
      description: 'Размер индикатора',
    },
    variant: {
      control: 'radio',
      options: ['brand', 'neutral', 'contrast', 'success', 'danger'],
      description: 'Цветовая схема индикатора',
    },
    paused: {
      control: 'boolean',
      description: 'Приостановить анимацию',
    },
    label: {
      control: 'text',
      description: 'Текстовое описание для скринридеров',
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: 'm',
    variant: 'brand',
    paused: false,
    label: 'Загрузка…',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {(['s', 'm', 'l', 'xl'] satisfies LoaderProps['size'][]).map((size) => (
        <Loader key={size} {...args} size={size} aria-label={`Размер ${size}`} />
      ))}
    </div>
  ),
  args: {
    variant: 'brand',
  },
  parameters: {
    docs: {
      description: {
        story: 'Набор всех доступных размеров индикатора.',
      },
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {(['brand', 'neutral', 'contrast', 'success', 'danger'] satisfies LoaderProps['variant'][]).map(
        (variant) => (
          <div
            key={variant}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
          >
            <Loader {...args} variant={variant} aria-label={`Вариант ${variant}`} />
            <span style={{ fontSize: '0.875rem' }}>{variant}</span>
          </div>
        ),
      )}
    </div>
  ),
  args: {
    size: 'm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Сравнение всех цветовых вариантов индикатора.',
      },
    },
  },
};

export const Paused: Story = {
  args: {
    size: 'l',
    variant: 'neutral',
    paused: true,
    label: 'Загрузка в ожидании',
  },
  parameters: {
    docs: {
      description: {
        story: 'Индикатор с приостановленной анимацией.',
      },
    },
  },
};

export const CustomLabel: Story = {
  args: {
    size: 'm',
    variant: 'success',
    label: 'Данные успешно загружены',
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример пользовательского описания для скринридеров.',
      },
    },
  },
};