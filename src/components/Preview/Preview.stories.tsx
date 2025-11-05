import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Preview, PreviewProps } from './Preview';

const meta: Meta<typeof Preview> = {
  title: 'Components/Preview',
  component: Preview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'URL to display in the preview iframe',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class applied to the root element',
    },
    onClose: { action: 'onClose' },
    onEdit: { action: 'onEdit' },
    onOpen: { action: 'onOpen' },
  },
};

export default meta;
type Story = StoryObj<PreviewProps>;

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
