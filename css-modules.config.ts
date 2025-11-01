import type { CSSModulesOptions } from 'vite';

/**
 * Единая конфигурация CSS модулей для Vite и Storybook
 *
 * Формат имен классов: __8env-ui__[ComponentName]__[className]
 * Примеры:
 * - .button → .__8env-ui__Button-module__button
 * - .button--primary → .__8env-ui__Button-module__button--primary
 */
export const cssModulesConfig: CSSModulesOptions = {
  localsConvention: 'dashes',
  generateScopedName: '__8env-ui__[name]__[local]',
};
