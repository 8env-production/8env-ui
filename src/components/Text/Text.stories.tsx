import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Text, TextProps } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['title', 'body', 'secondary', 'caption', 'tiny'],
      description: 'Вариант текста (размер и стиль)',
    },
    color: {
      control: 'select',
      options: ['default', 'contrast', 'brand'],
      description: 'Цвет текста',
    },
    children: {
      control: 'text',
      description: 'Содержимое текста',
    },
    isUppercase: {
      control: 'boolean',
      description: 'Преобразовать в прописные буквы',
    },
    textOverflow: {
      control: 'select',
      options: ['', 'ellipsis'],
      description: 'Обрезать текст с многоточием',
    },
    withIcon: {
      control: 'boolean',
      description: 'Использовать flexbox layout для иконки',
    },
    isItalic: {
      control: 'boolean',
      description: 'Применить курсивный стиль',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<TextProps>;

/**
 * Заголовок - самый крупный вариант текста
 */
export const Title: Story = {
  args: {
    children: 'Это заголовок',
    variant: 'title',
  },
};

/**
 * Основной вариант текста - для основного содержимого
 */
export const Body: Story = {
  args: {
    children: 'Это обычный текст для основного содержимого страницы.',
    variant: 'body',
  },
};

/**
 * Вторичный текст - для менее важной информации
 */
export const Secondary: Story = {
  args: {
    children: 'Вторичный текст - для описаний и подзаголовков',
    variant: 'secondary',
  },
};

/**
 * Подпись - для меток и описаний
 */
export const Caption: Story = {
  args: {
    children: 'Это подпись',
    variant: 'caption',
  },
};

/**
 * Крошечный текст - для мельчайших деталей
 */
export const Tiny: Story = {
  args: {
    children: 'Крошечный текст',
    variant: 'tiny',
  },
};

/**
 * Текст с контрастным цветом
 */
export const ColorContrast: Story = {
  args: {
    children: 'Текст с контрастным цветом',
    variant: 'body',
    color: 'contrast',
  },
};

/**
 * Текст с брендовым цветом
 */
export const ColorBrand: Story = {
  args: {
    children: 'Текст с брендовым цветом',
    variant: 'body',
    color: 'brand',
  },
};

/**
 * Текст в прописных буквах
 */
export const Uppercase: Story = {
  args: {
    children: 'Текст в прописных буквах',
    variant: 'body',
    isUppercase: true,
  },
};

/**
 * Курсивный текст
 */
export const Italic: Story = {
  args: {
    children: 'Курсивный текст',
    variant: 'body',
    isItalic: true,
  },
};

/**
 * Текст с обрезкой многоточием
 */
export const WithEllipsis: Story = {
  args: {
    children: 'Этот текст будет обрезан, если контейнер будет слишком узким для его отображения',
    variant: 'body',
    textOverflow: 'ellipsis',
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
 * Текст с иконкой (используется flexbox layout)
 */
export const WithIcon: Story = {
  args: {
    children: '✓ Успешно выполнено',
    variant: 'body',
    withIcon: true,
  },
};

/**
 * Все варианты размеров в одном месте
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Text variant="title">Заголовок (title)</Text>
      <Text variant="body">Основной текст (body)</Text>
      <Text variant="secondary">Вторичный текст (secondary)</Text>
      <Text variant="caption">Подпись (caption)</Text>
      <Text variant="tiny">Крошечный текст (tiny)</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех доступных размеров текста',
      },
    },
  },
};

/**
 * Все варианты цветов
 */
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Text variant="body" color="default">
        Цвет по умолчанию (default)
      </Text>
      <Text variant="body" color="contrast">
        Контрастный цвет (contrast)
      </Text>
      <Text variant="body" color="brand">
        Брендовый цвет (brand)
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех доступных цветов текста',
      },
    },
  },
};

/**
 * Комбинация различных модификаторов
 */
export const Combinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Text variant="body" isUppercase>
        Текст в прописных буквах
      </Text>
      <Text variant="body" isItalic>
        Курсивный текст
      </Text>
      <Text variant="body" isUppercase isItalic color="brand">
        Комбинация: прописные + курсив + бренд
      </Text>
      <Text variant="body" withIcon>
        ✓ С иконкой
      </Text>
      <Text variant="title" color="contrast">
        Заголовок контрастного цвета
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Примеры комбинирования различных модификаторов',
      },
    },
  },
};

/**
 * Обрезка текста с многоточием в разных контейнерах
 */
export const EllipsisVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ width: '150px', marginBottom: '5px' }}>
          <Text variant="caption" color="default">
            Ширина 150px:
          </Text>
        </div>
        <div style={{ width: '150px' }}>
          <Text textOverflow="ellipsis" variant="body">
            Очень длинный текст, который будет обрезан
          </Text>
        </div>
      </div>
      <div>
        <div style={{ width: '250px', marginBottom: '5px' }}>
          <Text variant="caption" color="default">
            Ширина 250px:
          </Text>
        </div>
        <div style={{ width: '250px' }}>
          <Text textOverflow="ellipsis" variant="body">
            Очень длинный текст, который будет обрезан
          </Text>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация обрезки текста в разных контейнерах',
      },
    },
  },
};
