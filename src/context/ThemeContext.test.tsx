import React from 'react';

import { act, renderHook } from '@testing-library/react';

import { useTheme } from '../hooks/useTheme';
import { Ctx8EnvUI } from './ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('должен предоставлять начальную светлую тему по умолчанию', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.mode).toBe('light');
  });

  it('должен использовать defaultTheme если передан', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI defaultTheme="dark">{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.mode).toBe('dark');
  });

  it('должен переключать тему через toggleTheme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.mode).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme.mode).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme.mode).toBe('light');
  });

  it('должен устанавливать тему через setThemeMode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(result.current.theme.mode).toBe('dark');

    act(() => {
      result.current.setThemeMode('light');
    });

    expect(result.current.theme.mode).toBe('light');
  });

  it('должен сохранять тему в localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI persistTheme={true}>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(localStorage.getItem('8env-ui-theme')).toBe('dark');
  });

  it('должен использовать custom storageKey', () => {
    const customKey = 'my-custom-theme-key';
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI persistTheme={true} storageKey={customKey}>
        {children}
      </Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(localStorage.getItem(customKey)).toBe('dark');
    expect(localStorage.getItem('8env-ui-theme')).toBeNull();
  });

  it('не должен сохранять тему если persistTheme=false', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI persistTheme={false}>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(localStorage.getItem('8env-ui-theme')).toBeNull();
  });

  it('должен загружать сохранённую тему из localStorage', () => {
    localStorage.setItem('8env-ui-theme', 'dark');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.mode).toBe('dark');
  });

  it('должен применять общие кастомные CSS переменные', () => {
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    const customVariables = {
      common: {
        'color-primary': '#ff0000',
        'color-secondary': '#00ff00',
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI customVariables={customVariables}>{children}</Ctx8EnvUI>
    );

    renderHook(() => useTheme(), { wrapper });

    expect(setPropertySpy).toHaveBeenCalledWith('--color-primary', '#ff0000');
    expect(setPropertySpy).toHaveBeenCalledWith('--color-secondary', '#00ff00');

    setPropertySpy.mockRestore();
  });

  it('должен применять кастомные переменные для светлой темы', () => {
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    const customVariables = {
      light: {
        'color-primary': '#0000ff',
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI defaultTheme="light" customVariables={customVariables}>
        {children}
      </Ctx8EnvUI>
    );

    renderHook(() => useTheme(), { wrapper });

    expect(setPropertySpy).toHaveBeenCalledWith('--color-primary', '#0000ff');

    setPropertySpy.mockRestore();
  });

  it('должен применять кастомные переменные для тёмной темы', () => {
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    const customVariables = {
      dark: {
        'color-background': '#000000',
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI defaultTheme="dark" customVariables={customVariables}>
        {children}
      </Ctx8EnvUI>
    );

    renderHook(() => useTheme(), { wrapper });

    expect(setPropertySpy).toHaveBeenCalledWith('--color-background', '#000000');

    setPropertySpy.mockRestore();
  });

  it('должен применять соответствующие переменные при переключении темы', () => {
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    const customVariables = {
      light: {
        'color-text': '#000000',
      },
      dark: {
        'color-text': '#ffffff',
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Ctx8EnvUI customVariables={customVariables}>{children}</Ctx8EnvUI>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Светлая тема по умолчанию
    expect(setPropertySpy).toHaveBeenCalledWith('--color-text', '#000000');

    setPropertySpy.mockClear();

    // Переключаем на тёмную тему
    act(() => {
      result.current.toggleTheme();
    });

    expect(setPropertySpy).toHaveBeenCalledWith('--color-text', '#ffffff');

    setPropertySpy.mockRestore();
  });
});

describe('useTheme', () => {
  it('должен выбросить ошибку если используется вне провайдера', () => {
    // Подавляем console.error для этого теста
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a Ctx8EnvUI provider');

    console.error = originalError;
  });
});
