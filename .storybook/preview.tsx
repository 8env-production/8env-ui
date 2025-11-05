import React from 'react';

import type { Preview } from '@storybook/react';

import { Ctx8EnvUI } from '../src/context/ThemeContext';
import '../src/styles/theme.scss';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Ctx8EnvUI defaultTheme="light">
        <Story />
      </Ctx8EnvUI>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
