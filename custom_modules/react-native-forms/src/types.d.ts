import { TextStyle } from "react-native";

export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'default' | 'primary' | 'secondary';

export interface FormControlProps {
  id?: string;
  name: string;
  label?: string;
  size?: Size;
  variant?: Variant;
  disabled?: boolean;
  required?: boolean;
  error?: string; // validation message
  children: React.ReactNode;
  labelStyle?: TextStyle;
}
