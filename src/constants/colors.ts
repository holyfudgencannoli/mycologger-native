import { ColorValue } from "react-native";

export const COLORS = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    surface: '#ffffff',
    surfaceAlt: '#f0f0f0',
    formBackground: 'rgba(16, 160, 255, 0.45)',
    formLabelText: 'white', 
    formTitleText: 'rgba(1,160,16,1)',

    primary1: 'rgba(16, 160, 255, 0.45)',
    secondary1: 'rgba(1,160,16,1)',

    primary2: 'rgba(1, 160, 16,1)',
    secondary2: 'rgba(160,1,16,1)',

    primary3: 'rgba(160, 1, 16, 1)',
    secondary3: 'rgba(122,16,255,1)',

    primary4: 'rgba(122, 16, 255, 1)',
    secondary4: 'rgba(16,160,255,1)'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    surface: '#1e1e1e',
    surfaceAlt: '#2a2a2a',
    formBackground: 'rgba(16, 160, 255, 0.45)',
    formLabelText: 'black',
    formTitleText: 'rgba(160,160,16,1)',
    
    primary1: 'rgba(16, 160, 255, 0.45)',
    secondary1: 'rgba(1,160,16,1)',

    primary2: 'rgba(1, 160, 16,1)',
    secondary2: 'rgba(160,1,16,1)',

    primary3: 'rgba(160, 1, 16, 1)',
    secondary3: 'rgba(122,16,255,1)',
    
    primary4: 'rgba(122, 16, 255, 1)',
    secondary4: 'rgba(16,160,255,S)'
  },
  button: {
    primary: '#f74a63cc'
  },
  BACKGROUND_GRADIENT: {
    PRIMARY: ['#94F8', '#00f', '#057'],
    SECONDARY: ['#00ff88', '#8800ff', '#ff8800'],
  } as const satisfies {
    PRIMARY: [ColorValue, ColorValue, ColorValue],
    SECONDARY: [ColorValue, ColorValue, ColorValue]
  }
} as const;


interface ThemeMode {
  text: ColorValue;
  background: ColorValue;
  tint: ColorValue;
  icon: ColorValue;
  surface: ColorValue;
  surfaceAlt: ColorValue;

  formBackground: ColorValue;
  formLabelText: ColorValue;
  formTitleText: ColorValue;

  primary1: ColorValue;
  secondary1: ColorValue;
  primary2: ColorValue;
  secondary2: ColorValue;
  primary3: ColorValue;
  secondary3: ColorValue;
  primary4: ColorValue; 
  secondary4: ColorValue;
}

export type Theme = typeof COLORS;
export type ColorMode = keyof Pick<Theme, 'light' | 'dark'>; // "light" | "dark"

// Optional: helper to get colors safely
export const getTheme = (mode: ColorMode = 'light') => COLORS[mode];