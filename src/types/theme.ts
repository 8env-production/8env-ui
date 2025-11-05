/**
 * Режимы темы
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Кастомные CSS переменные для переопределения стилей
 * Ключ - имя CSS переменной (без '--'), значение - значение переменной
 *
 * @example
 * {
 *   'color-primary': '#ff0000',
 *   'color-secondary': '#00ff00'
 * }
 */
export type CSSVariables = Record<string, string>;

/**
 * Кастомные CSS переменные для разных режимов темы
 */
export interface ThemeCustomVariables {
  /**
   * Переменные для светлой темы
   */
  light?: CSSVariables;
  /**
   * Переменные для тёмной темы
   */
  dark?: CSSVariables;
  /**
   * Общие переменные для обеих тем
   */
  common?: CSSVariables;
}

/**
 * Конфигурация темы
 */
export interface ThemeConfig {
  mode: ThemeMode;
  customVariables?: ThemeCustomVariables;
}

/**
 * Значение контекста темы
 */
export interface ThemeContextValue {
  /**
   * Текущая тема
   */
  theme: ThemeConfig;
  /**
   * Установить режим темы
   */
  setThemeMode: (mode: ThemeMode) => void;
  /**
   * Переключить тему между light и dark
   */
  toggleTheme: () => void;
}
