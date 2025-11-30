import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface InputProps extends Omit<TextInputProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const theme = useTheme();
  const { style, size = 'md', ...rest } = props;

  const styles = StyleSheet.create({
    base: {
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: theme.borderRadius,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: size === 'sm' ? theme.spacing.xs : size === 'lg' ? theme.spacing.md : theme.spacing.sm,
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      color: theme.colors.textPrimary,
    },
  });

  return <TextInput ref={ref} style={[styles.base, style]} {...rest} />;
});

Input.displayName = 'Input';
export default Input;
