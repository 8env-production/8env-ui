import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SolidLoader, SolidLoaderProps } from './SolidLoader';

const meta = {
  title: 'Components/SolidLoader',
  component: SolidLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Показывать overlay загрузки',
    },
    className: {
      control: 'text',
      description: 'Дополнительный className',
    },
    children: {
      control: false,
    },
  },
  args: {
    isLoading: true,
  },
} satisfies Meta<typeof SolidLoader>;

export default meta;
type Story = StoryObj<SolidLoaderProps>;

const Container = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '320px' }}>{children}</div>
);

const ContentBox = (
  <div
    style={{
      width: '100%',
      height: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-background-secondary)',
    }}
  >
    Контент
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <Container>
      <SolidLoader {...args}>{ContentBox}</SolidLoader>
    </Container>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  render: (args) => (
    <Container>
      <SolidLoader {...args}>{ContentBox}</SolidLoader>
    </Container>
  ),
};

export const Idle: Story = {
  args: {
    isLoading: false,
  },
  render: (args) => (
    <Container>
      <SolidLoader {...args}>{ContentBox}</SolidLoader>
    </Container>
  ),
};