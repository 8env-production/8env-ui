import type { Meta, StoryObj } from '@storybook/react';

import { Icon, IconProps } from './Icon';

const PlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    focusable="false"
    width="24"
    height="24"
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const ArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    focusable="false"
    width="24"
    height="24"
    {...props}
  >
    <path
      d="M5 12h10.17l-3.58-3.59L13 7l6 6-6 6-1.41-1.41L15.17 13H5z"
      fill="currentColor"
    />
  </svg>
);

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
      },
      options: ['s', 'm', 'l'],
      description: 'Размер иконки. По умолчанию `m`.',
    },
    children: {
      control: false,
      description: 'SVG-элемент, который будет отображён внутри.',
    },
    role: {
      control: 'text',
      description: 'ARIA-роль элемента, если иконка доступна для assistive technologies.',
    },
    'aria-label': {
      control: 'text',
      description: 'Текстовое описание иконки для скринридеров.',
    },
    'aria-hidden': {
      control: 'boolean',
      description:
        'Явно скрыть иконку от скринридеров. По умолчанию вычисляется автоматически.',
    },
  },
  args: {
    children: <PlaceholderIcon />,
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<IconProps>;

export const Playground: Story = {
  args: {
    size: 'm',
    'aria-label': 'Галочка в круге',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Icon {...args} size="s">
        <PlaceholderIcon />
      </Icon>
      <Icon {...args} size="m">
        <PlaceholderIcon />
      </Icon>
      <Icon {...args} size="l">
        <PlaceholderIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех доступных размеров.',
      },
    },
  },
};

export const CustomColor: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Icon {...args} style={{ color: 'var(--color-brand)' }}>
        <ArrowIcon />
      </Icon>
      <Icon {...args} style={{ color: 'var(--color-success)' }}>
        <ArrowIcon />
      </Icon>
      <Icon {...args} style={{ color: 'var(--color-danger)' }}>
        <ArrowIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Иконки наследуют цвет от контейнера, поэтому их легко стилизовать темой.',
      },
    },
  },
};

export const Decorative: Story = {
  args: {
    size: 'm',
    'aria-hidden': true,
    role: undefined,
    'aria-label': undefined,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <span>Открыть</span>
      <Icon {...args}>
        <ArrowIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'При отсутствии доступного имени иконка автоматически скрывается от скринридеров.',
      },
    },
  },
};

export const Accessible: Story = {
  args: {
    size: 'm',
    'aria-label': 'Стрелка вправо',
  },
  render: (args) => (
    <Icon {...args}>
      <ArrowIcon />
    </Icon>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Чтобы сделать иконку доступной, укажите `aria-label`, `aria-labelledby` или `title`.',
      },
    },
  },
};