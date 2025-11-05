import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tab, Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
    title: 'Shared/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'pills', 'underline'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        fullWidth: {
            control: 'boolean',
        },
        defaultValue: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultValue: 'tab1',
        variant: 'default',
        size: 'medium',
    },
    render: (args) => (
        <div style={{ width: '500px' }}>
            <Tabs {...args}>
                <Tab label="Первый таб" value="tab1">
                    <div style={{ padding: '20px' }}>
                        <h3>Содержимое первого таба</h3>
                        <p>
                            Это содержимое первого таба. Здесь может быть любой
                            контент.
                        </p>
                    </div>
                </Tab>
                <Tab label="Второй таб" value="tab2">
                    <div style={{ padding: '20px' }}>
                        <h3>Содержимое второго таба</h3>
                        <p>
                            А это содержимое второго таба с другой информацией.
                        </p>
                    </div>
                </Tab>
                <Tab label="Третий таб" value="tab3">
                    <div style={{ padding: '20px' }}>
                        <h3>Содержимое третьего таба</h3>
                        <p>И наконец, содержимое третьего таба.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    ),
};

export const Pills: Story = {
    args: {
        defaultValue: 'home',
        variant: 'pills',
        size: 'medium',
    },
    render: (args) => (
        <div style={{ width: '500px' }}>
            <Tabs {...args}>
                <Tab label="Главная" value="home">
                    <div style={{ padding: '20px' }}>
                        <h3>Главная страница</h3>
                        <p>Добро пожаловать на главную страницу!</p>
                    </div>
                </Tab>
                <Tab label="О нас" value="about">
                    <div style={{ padding: '20px' }}>
                        <h3>О нас</h3>
                        <p>Информация о нашей компании.</p>
                    </div>
                </Tab>
                <Tab label="Контакты" value="contacts">
                    <div style={{ padding: '20px' }}>
                        <h3>Контакты</h3>
                        <p>Свяжитесь с нами любым удобным способом.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    ),
};

export const Underline: Story = {
    args: {
        defaultValue: 'overview',
        variant: 'underline',
        size: 'medium',
    },
    render: (args) => (
        <div style={{ width: '500px' }}>
            <Tabs {...args}>
                <Tab label="Обзор" value="overview">
                    <div style={{ padding: '20px' }}>
                        <h3>Обзор</h3>
                        <p>Общая информация и статистика.</p>
                    </div>
                </Tab>
                <Tab label="Детали" value="details">
                    <div style={{ padding: '20px' }}>
                        <h3>Детали</h3>
                        <p>Подробная информация по всем параметрам.</p>
                    </div>
                </Tab>
                <Tab label="Настройки" value="settings">
                    <div style={{ padding: '20px' }}>
                        <h3>Настройки</h3>
                        <p>Конфигурация и персонализация.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    ),
};

export const WithDisabledTab: Story = {
    args: {
        defaultValue: 'active1',
        variant: 'default',
        size: 'medium',
    },
    render: (args) => (
        <div style={{ width: '500px' }}>
            <Tabs {...args}>
                <Tab label="Активный таб" value="active1">
                    <div style={{ padding: '20px' }}>
                        <h3>Активный таб</h3>
                        <p>Этот таб доступен для использования.</p>
                    </div>
                </Tab>
                <Tab label="Отключенный таб" value="disabled" disabled>
                    <div style={{ padding: '20px' }}>
                        <h3>Отключенный таб</h3>
                        <p>Этот таб недоступен.</p>
                    </div>
                </Tab>
                <Tab label="Еще один активный" value="active2">
                    <div style={{ padding: '20px' }}>
                        <h3>Еще один активный таб</h3>
                        <p>Этот таб тоже доступен.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                width: '500px',
            }}
        >
            <div>
                <h4>Маленький размер</h4>
                <Tabs defaultValue="tab1" size="small">
                    <Tab label="Таб 1" value="tab1">
                        <div style={{ padding: '15px' }}>
                            Содержимое маленького таба
                        </div>
                    </Tab>
                    <Tab label="Таб 2" value="tab2">
                        <div style={{ padding: '15px' }}>
                            Содержимое второго таба
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <div>
                <h4>Средний размер</h4>
                <Tabs defaultValue="tab1" size="medium">
                    <Tab label="Таб 1" value="tab1">
                        <div style={{ padding: '20px' }}>
                            Содержимое среднего таба
                        </div>
                    </Tab>
                    <Tab label="Таб 2" value="tab2">
                        <div style={{ padding: '20px' }}>
                            Содержимое второго таба
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <div>
                <h4>Большой размер</h4>
                <Tabs defaultValue="tab1" size="large">
                    <Tab label="Таб 1" value="tab1">
                        <div style={{ padding: '25px' }}>
                            Содержимое большого таба
                        </div>
                    </Tab>
                    <Tab label="Таб 2" value="tab2">
                        <div style={{ padding: '25px' }}>
                            Содержимое второго таба
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    ),
};

export const FullWidth: Story = {
    args: {
        defaultValue: 'tab1',
        variant: 'default',
        size: 'medium',
        fullWidth: true,
    },
    render: (args) => (
        <div style={{ width: '600px' }}>
            <Tabs {...args}>
                <Tab label="Первый" value="tab1">
                    <div style={{ padding: '20px' }}>
                        <h3>Первый таб</h3>
                        <p>Табы растянуты на всю ширину контейнера.</p>
                    </div>
                </Tab>
                <Tab label="Второй" value="tab2">
                    <div style={{ padding: '20px' }}>
                        <h3>Второй таб</h3>
                        <p>Каждый таб занимает равную ширину.</p>
                    </div>
                </Tab>
                <Tab label="Третий" value="tab3">
                    <div style={{ padding: '20px' }}>
                        <h3>Третий таб</h3>
                        <p>Удобно для навигации.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [activeTab, setActiveTab] = useState('profile');

        return (
            <div style={{ width: '500px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p>
                        Активный таб: <strong>{activeTab}</strong>
                    </p>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{ marginRight: '10px' }}
                    >
                        Переключить на Профиль
                    </button>
                    <button onClick={() => setActiveTab('settings')}>
                        Переключить на Настройки
                    </button>
                </div>

                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                >
                    <Tab label="Профиль" value="profile">
                        <div style={{ padding: '20px' }}>
                            <h3>Профиль пользователя</h3>
                            <p>Управление профилем и личной информацией.</p>
                        </div>
                    </Tab>
                    <Tab label="Настройки" value="settings">
                        <div style={{ padding: '20px' }}>
                            <h3>Настройки</h3>
                            <p>Конфигурация приложения и предпочтения.</p>
                        </div>
                    </Tab>
                    <Tab label="Уведомления" value="notifications">
                        <div style={{ padding: '20px' }}>
                            <h3>Уведомления</h3>
                            <p>Управление уведомлениями и оповещениями.</p>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    },
};
