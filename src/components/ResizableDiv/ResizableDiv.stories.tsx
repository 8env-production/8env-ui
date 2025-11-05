import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ResizableDiv } from './ResizableDiv';

const rightDecorators: Meta<typeof ResizableDiv>['decorators'] = [
  (Story) => (
    <div style={{ height: '100vh', display: 'flex' }}>
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
          <h3 style={{ margin: '0 0 10px 0' }}>Main area</h3>
          <p style={{ margin: 0 }}>This area adjusts to the resizable panel</p>
        </div>
      </div>
    </div>
  ),
];

const meta: Meta<typeof ResizableDiv> = {
  title: 'Components/ResizableDiv',
  component: ResizableDiv,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    initialWidth: {
      description: 'Initial width in percent',
      control: { type: 'range', min: 10, max: 90, step: 1 },
    },
    minWidth: {
      description: 'Minimum width',
      control: { type: 'range', min: 5, max: 50, step: 1 },
    },
    maxWidth: {
      description: 'Maximum width',
      control: { type: 'range', min: 50, max: 95, step: 1 },
    },
    keyboardStep: {
      description: 'Keyboard step',
      control: { type: 'range', min: 0.5, max: 5, step: 0.5 },
    },
    resizerPosition: {
      description: 'Resizer position',
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    disabled: { description: 'Disable resizing', control: 'boolean' },
    onWidthChange: { action: 'widthChange' },
    onResizeStart: { action: 'resizeStart' },
    onResizeEnd: { action: 'resizeEnd' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = (args: React.ComponentProps<typeof ResizableDiv>) => {
  const [currentWidth, setCurrentWidth] = useState(args.initialWidth || 30);

  return (
    <ResizableDiv
      {...args}
      onWidthChange={(width) => {
        setCurrentWidth(width);
        args.onWidthChange?.(width);
      }}
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
        <h2 style={{ margin: 0 }}>Sidebar</h2>

        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--background-dark)',
            borderRadius: 'var(--border-radius-50)',
            border: '1px solid var(--border-main-color)',
          }}
        >
          <strong>Current width:</strong> {currentWidth.toFixed(1)}%
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
                  textDecoration: 'none',
                  padding: '8px 12px',
                  display: 'block',
                  borderRadius: '4px',
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  textDecoration: 'none',
                  padding: '8px 12px',
                  display: 'block',
                  borderRadius: '4px',
                }}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  textDecoration: 'none',
                  padding: '8px 12px',
                  display: 'block',
                  borderRadius: '4px',
                }}
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </ResizableDiv>
  );
};

export const Default: Story = {
  args: {
    initialWidth: 30,
    minWidth: 15,
    maxWidth: 85,
    keyboardStep: 1,
    disabled: false,
  },
  render: (args) => <DefaultComponent {...args} />,
  decorators: rightDecorators,
};

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
      style={{ backgroundColor: 'var(--background-dark)', color: 'var(--text-color-main)' }}
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
        <h3 style={{ margin: '0 0 12px 0' }}>Tools</h3>
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
          Settings
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
          Remove
        </button>
      </div>
    </ResizableDiv>
  ),
  decorators: rightDecorators,
};

export const WithLeftResizer: Story = {
  args: {
    initialWidth: 35,
    minWidth: 20,
    maxWidth: 70,
    keyboardStep: 1,
    disabled: false,
    resizerPosition: 'left',
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
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
          <h3 style={{ margin: '0 0 10px 0' }}>Main area</h3>
        </div>
      </div>

      <ResizableDiv
        {...args}
        style={{
          backgroundColor: 'var(--background-main)',
          borderLeft: '1px solid var(--border-main-color)',
        }}
      >
        <div style={{ padding: '20px' }}>Right panel with left resizer</div>
      </ResizableDiv>
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};

export const DisabledPanel: Story = {
  args: {
    initialWidth: 25,
    minWidth: 15,
    maxWidth: 60,
    keyboardStep: 1,
    disabled: true,
  },
  render: (args) => (
    <ResizableDiv {...args} style={{ backgroundColor: 'var(--background-dark)', opacity: 0.8 }}>
      <div
        style={{
          padding: '20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--text-color-secondary)',
        }}
      >
        <h3 style={{ margin: 0 }}>🔒 Locked panel</h3>
      </div>
    </ResizableDiv>
  ),
  decorators: rightDecorators,
};
