import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import type {
  ThemeConfig,
  ThemeContextValue,
  ThemeCustomVariables,
  ThemeMode,
} from '../types/theme';

/**
 * Контекст темы
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Пропсы для провайдера темы
 */
export interface Ctx8EnvUIProps {
  /**
   * Дочерние компоненты
   */
  children: React.ReactNode;
  /**
   * Начальная тема (по умолчанию 'light')
   */
  defaultTheme?: ThemeMode;
  /**
   * Сохранять тему в localStorage (по умолчанию true)
   */
  persistTheme?: boolean;
  /**
   * Ключ для хранения темы в localStorage (по умолчанию '8env-ui-theme')
   */
  storageKey?: string;
  /**
   * Кастомные CSS переменные для переопределения стилей темы
   */
  customVariables?: ThemeCustomVariables;
}

const DEFAULT_STORAGE_KEY = '8env-ui-theme';

/**
 * Провайдер контекста темы для 8env-ui
 *
 * @example
 * ```tsx
 * import { Ctx8EnvUI } from '@8env-ui/components/context';
 *
 * function App() {
 *   return (
 *     <Ctx8EnvUI
 *       defaultTheme="light"
 *       customVariables={{
 *         common: {
 *           'color-primary': '#ff0000'
 *         }
 *       }}
 *     >
 *       <YourApp />
 *     </Ctx8EnvUI>
 *   );
 * }
 * ```
 */
export const Ctx8EnvUI: React.FC<Ctx8EnvUIProps> = ({
  children,
  defaultTheme = 'light',
  persistTheme = true,
  storageKey = DEFAULT_STORAGE_KEY,
  customVariables,
}) => {
  // Получаем сохранённую тему из localStorage или используем defaultTheme
  const getInitialTheme = useCallback((): ThemeMode => {
    if (!persistTheme || typeof window === 'undefined') {
      return defaultTheme;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    return defaultTheme;
  }, [defaultTheme, persistTheme, storageKey]);

  const [theme, setTheme] = useState<ThemeConfig>({
    mode: getInitialTheme(),
    customVariables,
  });

  // Применить кастомные CSS переменные
  const applyCustomVariables = useCallback(() => {
    if (typeof window === 'undefined' || !customVariables) return;

    const root = document.documentElement;

    // Применяем общие переменные
    if (customVariables.common) {
      Object.entries(customVariables.common).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Применяем переменные для текущей темы
    const modeVariables = customVariables[theme.mode];
    if (modeVariables) {
      Object.entries(modeVariables).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [customVariables, theme.mode]);

  // Применяем тему к document.documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute('data-theme', theme.mode);

    // Применяем кастомные переменные
    applyCustomVariables();

    // Сохраняем тему в localStorage
    if (persistTheme) {
      try {
        localStorage.setItem(storageKey, theme.mode);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme.mode, persistTheme, storageKey, applyCustomVariables]);

  // Установить режим темы
  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setTheme({ mode, customVariables });
    },
    [customVariables]
  );

  // Переключить тему
  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      mode: prev.mode === 'light' ? 'dark' : 'light',
      customVariables,
    }));
  }, [customVariables]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setThemeMode,
      toggleTheme,
    }),
    [theme, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
