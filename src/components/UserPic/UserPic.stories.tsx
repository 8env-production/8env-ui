import type { Meta, StoryObj } from '@storybook/react';

import { UserPic, UserPicProps } from './UserPic';

const meta = {
  title: 'Components/UserPic',
  component: UserPic,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imgUrl: {
      control: 'text',
      description: 'URL изображения пользователя',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Размер аватара',
    },
    alt: {
      control: 'text',
      description: 'Альтернативный текст для accessibility',
    },
    href: {
      control: 'text',
      description: 'URL для навигации (если указан, компонент станет ссылкой)',
    },
    target: {
      control: 'select',
      options: ['_blank', '_self', '_parent', '_top'],
      description: 'Target для ссылки',
    },
  },
} satisfies Meta<typeof UserPic>;

export default meta;
type Story = StoryObj<UserPicProps>;

const SAMPLE_AVATAR_URL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop';

/**
 * Стандартный аватар пользователя среднего размера
 */
export const Default: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
  },
};

/**
 * Маленький аватар
 */
export const Small: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: 'sm',
  },
};

/**
 * Средний аватар (по умолчанию)
 */
export const Medium: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: 'md',
  },
};

/**
 * Большой аватар
 */
export const Large: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: 'lg',
  },
};

/**
 * Очень большой аватар
 */
export const ExtraLarge: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: 'xl',
  },
};

/**
 * Аватар с пользовательским размером (число в пикселях)
 */
export const CustomSize: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: 64,
  },
};

/**
 * Аватар с пользовательским размером (CSS значение)
 */
export const CustomSizeCSS: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    size: '5rem',
  },
};

/**
 * Аватар-ссылка на профиль
 */
export const AsLink: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    href: '/profile',
    alt: 'Перейти в профиль',
  },
};

/**
 * Аватар-ссылка, открывающаяся в новой вкладке
 */
export const AsExternalLink: Story = {
  args: {
    imgUrl: SAMPLE_AVATAR_URL,
    href: 'https://example.com/profile',
    target: '_blank',
    alt: 'Открыть профиль в новой вкладке',
  },
};

/**
 * Все размеры в одном месте
 */
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="sm" />
        <span>Small (1.5rem)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="md" />
        <span>Medium (2rem)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="lg" />
        <span>Large (2.5rem)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="xl" />
        <span>Extra Large (3rem)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех предустановленных размеров аватара',
      },
    },
  },
};

/**
 * Аватары с различными изображениями
 */
export const DifferentAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <UserPic
        imgUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        size="lg"
      />
      <UserPic
        imgUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        size="lg"
      />
      <UserPic
        imgUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
        size="lg"
      />
      <UserPic
        imgUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        size="lg"
      />
      <UserPic
        imgUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
        size="lg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Примеры аватаров с различными изображениями',
      },
    },
  },
};

/**
 * Интерактивные состояния для аватара-ссылки
 */
export const InteractiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Обычный аватар (не кликабельный):
        </p>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="lg" />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Аватар-ссылка (кликабельный с hover эффектом):
        </p>
        <UserPic imgUrl={SAMPLE_AVATAR_URL} size="lg" href="/profile" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Сравнение обычного аватара и аватара-ссылки. Наведите курсор, чтобы увидеть интерактивные эффекты.',
      },
    },
  },
};

/**
 * Использование в навигации
 */
export const InNavigation: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem',
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-50)',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>Мой профиль</span>
      <UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" alt="Мой профиль" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Пример использования аватара в навигационной панели',
      },
    },
  },
};
