// src/components/Select/Select.tsx
import React, { Children, forwardRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../theme/ThemeProvider';

export interface Option {
  label: string;
  value: string | number;
}

export interface SelectProps {
  options: any[];
  selectedValue?: string | number;
  onValueChange: (value: string | number, index: number) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: object;
}

const Select = forwardRef<View, SelectProps>((props, ref) => {
  const theme = useTheme();
  const { options, selectedValue, onValueChange, placeholder, size = 'md', style } = props;

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: size === 'sm' ? theme.spacing.xs : size === 'lg' ? theme.spacing.md : theme.spacing.sm,
    },
    placeholder: { color: theme.colors.textPrimary, fontSize: 16 },
  });

  return (
    <View ref={ref} style={[styles.container, style]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        mode="dialog"
        itemStyle={{ height: 44, color: theme.colors.primary }}
      >
        {placeholder && (
          <Picker.Item label={placeholder} value="" color={theme.colors.primary} />
        )}
        {options.map((opt: any) => (
          <Picker.Item label={opt.name} value={{...opt}} />
        ))}
      </Picker>
    </View>
  );
});

Select.displayName = 'Select';
export default Select;
