import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType, CSSProperties } from 'react';

import { Navigation, type NavigationProps } from './Navigation';
import { Button } from '../Button/Button';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Вертикальная боковая панель навигации с настраиваемым логотипом, списком элементов и нижним акцентным блоком.',
      },
    },
  },
  argTypes: {
    className: {
      control: false,
      description: 'Дополнительный CSS класс для корневого элемента',
    },
    style: {
      control: false,
      description: 'Inline-стили корневого элемента',
    },
    logo: {
      control: false,
      description: 'Произвольный React-элемент для отображения в верхней части',
    },
    topItems: {
      control: false,
      description: 'Список элементов верхнего блока (ReactNode или массив ReactNode)',
    },
    bottomItems: {
      control: false,
      description: 'Список элементов нижнего блока (ReactNode или массив ReactNode)',
    },
    accent: {
      control: false,
      description: 'Переопределение SVG акцента в нижней части',
    },
    accentProps: {
      control: false,
      description: 'Пропсы, которые будут переданы стандартному SVG акценту',
    },
    ariaLabel: {
      control: 'text',
      description: 'Подпись для навигации (атрибут aria-label)',
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Navigation>;

const mockLogo = (
  <div
    style={{
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      backgroundColor: 'var(--color-brand)',
      color: 'var(--color-text-brand-background)',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      letterSpacing: '0.05em',
    }}
  >
    8E
  </div>
);

const sharedTopItems = [
  <Button key="dashboard" view="flat" isIcon aria-label="dashboard">
    🏠
  </Button>,
  <Button key="analytics" view="flat" isIcon aria-label="analytics">
    📊
  </Button>,
  <Button key="settings" view="flat" isIcon aria-label="settings">
    ⚙️
  </Button>,
];

const sharedBottomItems = [
  <Button key="create" view="action" isIcon aria-label="create">
    ＋
  </Button>,
  <div
    key="profile"
    style={{
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      background:
        'linear-gradient(135deg, var(--color-brand-alpha-30), var(--color-brand-alpha-80))',
      color: 'var(--color-text-brand-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
    }}
  >
    JD
  </div>,
];

const WithWrapper = (StoryComponent: ComponentType<NavigationProps>) => (
  <div
    style={{
      minHeight: '24rem',
      display: 'flex',
      background:
        'linear-gradient(90deg, var(--color-background-secondary) 0%, var(--color-background) 100%)',
    }}
  >
    <StoryComponent />
    <div
      style={{
        flex: 1,
        padding: '2rem',
        borderLeft: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-main)',
      }}
    >
      Контент приложения
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => WithWrapper(() => <Navigation {...args} />),
  args: {
    logo: mockLogo,
    topItems: sharedTopItems,
    bottomItems: sharedBottomItems,
    ariaLabel: 'Основная навигация',
  },
};

export const WithoutLogo: Story = {
  render: (args) => WithWrapper(() => <Navigation {...args} />),
  args: {
    topItems: sharedTopItems.slice(0, 2),
    bottomItems: sharedBottomItems,
    ariaLabel: 'Навигация без логотипа',
  },
  parameters: {
    docs: {
      description: {
        story: 'Вариант без логотипа. Компонент корректно адаптируется к отсутствию верхнего блока.',
      },
    },
  },
};

export const CustomAccent: Story = {
  render: (args) => WithWrapper(() => <Navigation {...args} />),
  args: {
    logo: mockLogo,
    topItems: sharedTopItems,
    bottomItems: sharedBottomItems,
    accent: (
      <div
        style={{
          width: '100%',
          padding: '0.75rem 0',
          background:
            'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-alpha-70) 100%)',
          boxShadow: '0 4px 12px var(--color-brand-alpha-30)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'var(--color-text-brand-background)',
            color: 'var(--color-brand)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          + Новый проект
        </span>
      </div>
    ),
    ariaLabel: 'Навигация с кастомным акцентом',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Пример переопределения нижнего акцентного блока произвольным контентом. Используйте проп `accent` для полной кастомизации.',
      },
    },
  },
};

export const Compact: Story = {
  render: (args) => WithWrapper(() => <Navigation {...args} />),
  args: {
    logo: mockLogo,
    topItems: [
      <Button key="home" view="flat" isIcon aria-label="home">
        🏠
      </Button>,
      <Button key="chat" view="flat" isIcon aria-label="chat">
        💬
      </Button>,
    ],
    bottomItems: [
      <Button key="help" view="flat" isIcon aria-label="help">
        ❔
      </Button>,
    ],
    ariaLabel: 'Компактная навигация',
    style: {
      '--navigation-top-gap': '0.5rem',
      '--navigation-bottom-gap': '0.5rem',
      '--navigation-width': '2.75rem',
    } as CSSProperties,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Показывает как можно изменить размеры и отступы навигации при помощи CSS переменных.',
      },
    },
  },
};