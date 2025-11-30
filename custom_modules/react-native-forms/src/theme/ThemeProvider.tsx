import React, { createContext, useContext } from 'react';
import { defaultTheme } from './defaultTheme';

export const ThemeContext = createContext(defaultTheme);

interface Props {
  theme?: Partial<typeof defaultTheme>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ theme = {}, children }) => {
  // shallow merge – you can deep‑merge if you want
  const merged = { ...defaultTheme, ...theme };
  return <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
