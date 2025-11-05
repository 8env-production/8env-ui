import { useContext } from 'react';

import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextValue } from '../types/theme';

/**
 * Хук для доступа к контексту темы
 *
 * @throws {Error} Если используется вне провайдера Ctx8EnvUI
 *
 * @example
 * ```tsx
 * import { useTheme } from '@8env-ui/components/hooks';
 *
 * function MyComponent() {
 *   const { theme, toggleTheme, setThemeMode } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Текущая тема: {theme.mode}</p>
 *       <button onClick={toggleTheme}>
 *         Переключить тему
 *       </button>
 *       <button onClick={() => setThemeMode('dark')}>
 *         Тёмная тема
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a Ctx8EnvUI provider');
  }

  return context;
};
