import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Preview } from './Preview';

const meta: Meta<typeof Preview> = {
    title: 'Shared/Preview',
    component: Preview,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        url: {
            control: 'text',
            description: 'URL страницы для отображения в preview',
        },
        className: {
            control: 'text',
            description: 'Дополнительный CSS класс',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый пример с внешним сайтом
export const Default: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '600px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

// Пример с локальной страницей
export const LocalPage: Story = {
    args: {
        url: '/edit',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '600px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

// Пример с длинным URL
export const LongURL: Story = {
    args: {
        url: 'https://www.example.com/very/long/path/to/some/page/that/has/a/really/long/url/for/testing/purposes',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '600px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

// Маленький размер компонента
export const SmallSize: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '400px', height: '300px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

// Большой размер компонента
export const LargeSize: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '1200px', height: '800px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

// Светлая тема
export const LightTheme: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div
                className="theme_light"
                style={{
                    height: '600px',
                    padding: '20px',
                    background: '#f5f5f5',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

// Темная тема
export const DarkTheme: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div
                className="theme_dark"
                style={{
                    height: '600px',
                    padding: '20px',
                    background: '#1a1a1a',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

// Несколько превью рядом
export const MultiplePreviewsGrid: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                padding: '20px',
                height: '800px',
            }}
        >
            <Preview url="https://example.com" />
            <Preview url="https://google.com" />
            <Preview url="/edit" />
            <Preview url="/auth" />
        </div>
    ),
};

// Адаптивный пример
export const Responsive: Story = {
    args: {
        url: 'https://example.com',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    height: '600px',
                    margin: '0 auto',
                    padding: '20px',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

// Пример с кастомным классом
export const WithCustomClass: Story = {
    args: {
        url: 'https://example.com',
        className: 'custom-preview-class',
    },
    decorators: [
        (Story) => (
            <>
                <style>{`
                    .custom-preview-class {
                        border: 3px solid #007bff;
                        box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
                    }
                `}</style>
                <div style={{ height: '600px', padding: '20px' }}>
                    <Story />
                </div>
            </>
        ),
    ],
};
