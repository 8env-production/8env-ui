import type { Meta, StoryObj } from '@storybook/react';

import { Logo, LogoProps } from './Logo';

const meta: Meta<LogoProps> = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер логотипа. Можно выбрать предустановленное значение или передать кастомное.',
    },
    bordered: {
      control: 'boolean',
      description: 'Отображать рамку вокруг логотипа.',
    },
    withShadow: {
      control: 'boolean',
      description: 'Отображать тень у логотипа.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Альтернативный текст для экранных читалок.',
    },
    href: {
      control: 'text',
      description: 'Если указать ссылку, логотип станет кликабельным.',
    },
    className: {
      control: false,
    },
    style: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<LogoProps>;

export const Default: Story = {
  args: {
    size: 'md',
    bordered: true,
    withShadow: true,
  },
};

export const WithoutBorder: Story = {
  args: {
    bordered: false,
    withShadow: true,
  },
};

export const WithoutShadow: Story = {
  args: {
    bordered: true,
    withShadow: false,
  },
};

export const LinkVariant: Story = {
  args: {
    href: 'https://8env.com',
    target: '_blank',
    ariaLabel: 'Перейти на сайт 8env',
  },
};

export const CustomSize: Story = {
  args: {
    size: '4rem',
    bordered: true,
    withShadow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Можно передать произвольное CSS-значение в проп size, например 4rem или 56px.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '24px',
        justifyItems: 'center',
      }}
    >
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={size} />
          <span style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-text-main)' }}>
            {size.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех стандартных размеров логотипа.',
      },
    },
  },
};