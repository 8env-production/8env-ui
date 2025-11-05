import type { StoryObj } from '@storybook/react';

import { Button, ButtonProps } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    view: {
      control: 'select',
      options: [
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
      ],
      description: 'Вариант отображения кнопки',
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center'],
      description: 'Выравнивание текста',
    },
    children: {
      control: 'text',
      description: 'Содержимое кнопки',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Растянуть на всю ширину',
    },
    isIcon: {
      control: 'boolean',
      description: 'Отображать как иконку',
    },
    withEllipsis: {
      control: 'boolean',
      description: 'Обрезать текст с многоточием',
    },
    withoutAnimation: {
      control: 'boolean',
      description: 'Отключить анимацию',
    },
    noPaddings: {
      control: 'boolean',
      description: 'Убрать отступы',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокировать кнопку',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

/**
 * Кнопка по умолчанию с базовым стилем
 */
export const Default: Story = {
  args: {
    children: 'Button',
    view: 'default',
  },
};

/**
 * Основная кнопка для важных действий
 */
export const Action: Story = {
  args: {
    children: 'Action Button',
    view: 'action',
  },
};

/**
 * Кнопка для успешных действий
 */
export const Success: Story = {
  args: {
    children: 'Success Button',
    view: 'success',
  },
};

/**
 * Кнопка для опасных/деструктивных действий
 */
export const Danger: Story = {
  args: {
    children: 'Danger Button',
    view: 'danger',
  },
};

/**
 * Плоская кнопка без фона
 */
export const Flat: Story = {
  args: {
    children: 'Flat Button',
    view: 'flat',
  },
};

/**
 * Плоская кнопка с цветом action
 */
export const FlatAction: Story = {
  args: {
    children: 'Flat Action Button',
    view: 'flat-action',
  },
};

/**
 * Плоская кнопка с цветом success
 */
export const FlatSuccess: Story = {
  args: {
    children: 'Flat Success Button',
    view: 'flat-success',
  },
};

/**
 * Плоская кнопка с цветом danger
 */
export const FlatDanger: Story = {
  args: {
    children: 'Flat Danger Button',
    view: 'flat-danger',
  },
};

/**
 * Кнопка с обводкой
 */
export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    view: 'outlined',
  },
};

/**
 * Кнопка с обводкой success
 */
export const OutlinedSuccess: Story = {
  args: {
    children: 'Outlined Success',
    view: 'outlined-success',
  },
};

/**
 * Кнопка с обводкой danger
 */
export const OutlinedDanger: Story = {
  args: {
    children: 'Outlined Danger',
    view: 'outlined-danger',
  },
};

/**
 * Кнопка на всю ширину контейнера
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    view: 'action',
    fullWidth: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Заблокированная кнопка
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    view: 'action',
    disabled: true,
  },
};

/**
 * Кнопка-ссылка с внутренней навигацией
 */
export const WithHref: Story = {
  args: {
    children: 'Navigate to /edit',
    view: 'action',
    href: '/edit',
  },
};

/**
 * Кнопка-ссылка, открывающаяся в новой вкладке
 */
export const WithHrefBlank: Story = {
  args: {
    children: 'Open in new tab',
    view: 'outlined',
    href: 'https://example.com',
    target: '_blank',
  },
};

/**
 * Кнопка с выравниванием текста слева
 */
export const TextAlignLeft: Story = {
  args: {
    children: 'Left aligned text',
    view: 'default',
    textAlign: 'left',
    fullWidth: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Кнопка с обрезанным текстом
 */
export const WithEllipsis: Story = {
  args: {
    children: 'This is a very long button text that should be truncated',
    view: 'action',
    withEllipsis: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Кнопка без анимации
 */
export const WithoutAnimation: Story = {
  args: {
    children: 'No animation',
    view: 'action',
    withoutAnimation: true,
  },
};

/**
 * Кнопка-иконка (квадратная)
 */
export const IconButton: Story = {
  args: {
    children: '✕',
    view: 'flat',
    isIcon: true,
  },
};

/**
 * Все варианты кнопок в одном месте
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '250px',
      }}
    >
      <Button view="default">Default</Button>
      <Button view="action">Action</Button>
      <Button view="success">Success</Button>
      <Button view="danger">Danger</Button>
      <Button view="outlined">Outlined</Button>
      <Button view="outlined-success">Outlined Success</Button>
      <Button view="outlined-danger">Outlined Danger</Button>
      <Button view="flat">Flat</Button>
      <Button view="flat-action">Flat Action</Button>
      <Button view="flat-success">Flat Success</Button>
      <Button view="flat-danger">Flat Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех доступных вариантов кнопок',
      },
    },
  },
};

/**
 * Комбинация различных состояний
 */
export const StatesCombination: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button view="action">Normal</Button>
        <Button view="action" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button view="outlined">Normal</Button>
        <Button view="outlined" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button view="flat">Normal</Button>
        <Button view="flat" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Сравнение нормального и заблокированного состояний',
      },
    },
  },
};
