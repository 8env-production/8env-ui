import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
    title: 'Shared/Logo',
    component: Logo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Logo />
        </div>
    ),
};
