import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ResizableDiv } from '../ResizableDiv';

import { WithCallbacksComponent } from './WithCallbacks';
import { WithLeftResizerComponent } from './WithLeftResizer';

const rightDecorators: Meta<typeof ResizableDiv>['decorators'] = [
    (Story) => (
        <div
            style={{
                height: '100vh',
                display: 'flex',
            }}
        >
            <Story />
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    backgroundColor: 'var(--background-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-color-secondary)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Основная область</h3>
                    <p style={{ margin: 0 }}>
                        Эта область автоматически подстраивается под размер
                        левой панели
                    </p>
                </div>
            </div>
        </div>
    ),
];

const meta: Meta<typeof ResizableDiv> = {
    title: 'Shared/ResizableDiv',
    component: ResizableDiv,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Компонент ResizableDiv предоставляет контейнер с возможностью изменения ширины путем перетаскивания элемента управления на левой или правой границе. Поддерживает мышь, клавиатуру и accessibility.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        initialWidth: {
            description: 'Начальная ширина в процентах',
            control: { type: 'range', min: 10, max: 90, step: 1 },
        },
        minWidth: {
            description: 'Минимальная ширина в процентах',
            control: { type: 'range', min: 5, max: 50, step: 1 },
        },
        maxWidth: {
            description: 'Максимальная ширина в процентах',
            control: { type: 'range', min: 50, max: 95, step: 1 },
        },
        keyboardStep: {
            description: 'Шаг изменения размера при использовании клавиатуры',
            control: { type: 'range', min: 0.5, max: 5, step: 0.5 },
        },
        resizerPosition: {
            description: 'Позиция ресайзера: слева или справа',
            control: { type: 'select' },
            options: ['left', 'right'],
        },
        disabled: {
            description: 'Отключить возможность изменения размера',
            control: 'boolean',
        },
        onWidthChange: { action: 'widthChange' },
        onResizeStart: { action: 'resizeStart' },
        onResizeEnd: { action: 'resizeEnd' },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Базовая история
export const Default: Story = {
    args: {
        initialWidth: 30,
        minWidth: 15,
        maxWidth: 85,
        keyboardStep: 1,
        disabled: false,
    },
    render: (args) => {
        const [currentWidth, setCurrentWidth] = useState(
            args.initialWidth || 30
        );

        return (
            <ResizableDiv
                {...args}
                onWidthChange={(width) => {
                    setCurrentWidth(width);
                    args.onWidthChange?.(width);
                }}
                onResizeStart={args.onResizeStart}
                onResizeEnd={args.onResizeEnd}
                style={{
                    backgroundColor: 'var(--background-main)',
                    borderRight: '1px solid var(--border-main-color)',
                    boxShadow: '2px 0 4px var(--shadow-color)',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <h2
                        style={{
                            margin: '0 0 16px 0',
                            color: 'var(--text-color-main)',
                        }}
                    >
                        Боковая панель
                    </h2>

                    <div
                        style={{
                            padding: '12px',
                            backgroundColor: 'var(--background-dark)',
                            borderRadius: 'var(--border-radius-50)',
                            border: '1px solid var(--border-main-color)',
                        }}
                    >
                        <strong>Текущая ширина:</strong>{' '}
                        {currentWidth.toFixed(1)}%
                    </div>

                    <div
                        style={{
                            padding: '12px',
                            backgroundColor: 'var(--background-dark)',
                            borderRadius: 'var(--border-radius-50)',
                            border: '1px solid var(--border-active-color)',
                        }}
                    >
                        <strong>Управление:</strong>
                        <ul
                            style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}
                        >
                            <li>Перетащите правую границу мышью</li>
                            <li>Используйте Tab + стрелки ←→</li>
                        </ul>
                    </div>

                    <nav style={{ flex: 1 }}>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--text-color-link)',
                                        textDecoration: 'none',
                                        padding: '8px 12px',
                                        display: 'block',
                                        borderRadius: '4px',
                                        backgroundColor:
                                            'var(--background-dark)',
                                    }}
                                >
                                    Главная
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--text-color-link)',
                                        textDecoration: 'none',
                                        padding: '8px 12px',
                                        display: 'block',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Проекты
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--text-color-link)',
                                        textDecoration: 'none',
                                        padding: '8px 12px',
                                        display: 'block',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Настройки
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--text-color-link)',
                                        textDecoration: 'none',
                                        padding: '8px 12px',
                                        display: 'block',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Помощь
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </ResizableDiv>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Базовый пример использования ResizableDiv в качестве боковой панели. Попробуйте изменить размер, перетащив правую границу или используя клавиатурное управление (Tab + стрелки).',
            },
        },
    },
    decorators: rightDecorators,
};

// Узкая панель
export const NarrowPanel: Story = {
    args: {
        initialWidth: 20,
        minWidth: 15,
        maxWidth: 40,
        keyboardStep: 0.5,
        disabled: false,
    },
    render: (args) => (
        <ResizableDiv
            {...args}
            style={{
                backgroundColor: 'var(--background-dark)',
                color: 'var(--text-color-main)',
            }}
        >
            <div
                style={{
                    padding: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                    Инструменты
                </h3>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}
                >
                    <button
                        style={{
                            padding: '8px',
                            backgroundColor: 'var(--color-brand)',
                            color: 'var(--text-color-brand-background)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        🔧 Настройки
                    </button>
                    <button
                        style={{
                            padding: '8px',
                            backgroundColor: 'var(--danger)',
                            color: 'var(--text-color-danger-background)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        🗑️ Удалить
                    </button>
                    <button
                        style={{
                            padding: '8px',
                            backgroundColor: 'var(--success)',
                            color: 'var(--text-color-success-background)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        ➕ Добавить
                    </button>
                </div>
            </div>
        </ResizableDiv>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Пример узкой панели инструментов с ограниченной максимальной шириной.',
            },
        },
    },
    decorators: rightDecorators,
};

// Широкая панель
export const WidePanel: Story = {
    args: {
        initialWidth: 60,
        minWidth: 40,
        maxWidth: 80,
        keyboardStep: 2,
        disabled: false,
    },
    render: (args) => (
        <ResizableDiv
            {...args}
            style={{
                backgroundColor: 'var(--background-main)',
                borderRight: '2px solid var(--color-brand)',
            }}
        >
            <div
                style={{
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <header>
                    <h2
                        style={{
                            margin: '0 0 8px 0',
                            color: 'var(--color-brand)',
                        }}
                    >
                        Панель контента
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            color: 'var(--text-color-secondary)',
                        }}
                    >
                        Широкая панель для отображения детальной информации
                    </p>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <section
                        style={{
                            padding: '16px',
                            backgroundColor: 'var(--background-dark)',
                            borderRadius: 'var(--border-radius-50)',
                            border: '1px solid var(--border-main-color)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0' }}>Раздел 1</h3>
                        <p style={{ margin: 0, lineHeight: 1.5 }}>
                            Здесь может быть размещен любой контент: текст,
                            изображения, формы или другие компоненты. Панель
                            автоматически подстраивается под содержимое.
                        </p>
                    </section>

                    <section
                        style={{
                            padding: '16px',
                            backgroundColor: 'var(--background-dark)',
                            borderRadius: 'var(--border-radius-50)',
                            border: '1px solid var(--border-active-color)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0' }}>Раздел 2</h3>
                        <p style={{ margin: 0, lineHeight: 1.5 }}>
                            Благодаря гибкой системе ограничений, панель может
                            иметь как минимальную, так и максимальную ширину.
                        </p>
                    </section>
                </main>
            </div>
        </ResizableDiv>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Пример широкой панели контента с большим количеством информации.',
            },
        },
    },
    decorators: rightDecorators,
};

// Отключенная панель
export const DisabledPanel: Story = {
    args: {
        initialWidth: 25,
        minWidth: 15,
        maxWidth: 60,
        keyboardStep: 1,
        disabled: true,
    },
    render: (args) => (
        <ResizableDiv
            {...args}
            style={{
                backgroundColor: 'var(--background-dark)',
                opacity: 0.8,
            }}
        >
            <div
                style={{
                    padding: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'var(--text-color-secondary)',
                }}
            >
                <h3 style={{ margin: '0 0 16px 0' }}>
                    🔒 Заблокированная панель
                </h3>
                <p style={{ margin: 0, lineHeight: 1.5 }}>
                    Эта панель отключена и не может быть изменена по размеру.
                    Элемент управления неактивен.
                </p>
            </div>
        </ResizableDiv>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Пример отключенной панели. Элемент управления изменением размера неактивен.',
            },
        },
    },
    decorators: rightDecorators,
};

// Панель с колбэками
export const WithCallbacks: Story = {
    args: {
        initialWidth: 35,
        minWidth: 20,
        maxWidth: 70,
        keyboardStep: 1,
        disabled: false,
    },
    render: (args) => <WithCallbacksComponent {...args} />,
    parameters: {
        docs: {
            description: {
                story: 'Демонстрация всех колбэков компонента. В журнале отображаются события изменения размера в реальном времени.',
            },
        },
    },
    decorators: rightDecorators,
};

// Панель с левым ресайзером
export const WithLeftResizer: Story = {
    args: {
        initialWidth: 35,
        minWidth: 20,
        maxWidth: 70,
        keyboardStep: 1,
        disabled: false,
    },
    render: (args) => <WithLeftResizerComponent {...args} />,
    decorators: [
        (Story) => (
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        padding: '20px',
                        backgroundColor: 'var(--background-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-color-secondary)',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>
                            Основная область
                        </h3>
                        <p style={{ margin: 0 }}>
                            Эта область автоматически подстраивается под размер
                            правой панели с левым ресайзером
                        </p>
                    </div>
                </div>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Демонстрация компонента с левым ресайзером. Ресайзер располагается на левой границе панели, что позволяет изменять размер, перетаскивая левую границу.',
            },
        },
    },
};
