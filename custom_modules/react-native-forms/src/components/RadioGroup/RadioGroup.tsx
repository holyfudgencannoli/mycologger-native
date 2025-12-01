import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface RadioOption {
  label: string;
  value: string | number;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue?: string | number;
  onChange: (value: string | number) => void;
  size?: 'sm' | 'md' | 'lg';
  style?: object;
}

const RadioGroup = forwardRef<View, RadioGroupProps>((props, ref) => {
  const theme = useTheme();
  const { options, selectedValue, onChange, size = 'md', style } = props;

  const styles = StyleSheet.create({
    container: { flexDirection: 'row', flexWrap: 'wrap' },
    option: { flexDirection: 'row', alignItems: 'center', marginRight: theme.spacing.sm, marginBottom: theme.spacing.xs },
    circle: {
      width: size === 'sm' ? 12 : size === 'lg' ? 20 : 16,
      height: size === 'sm' ? 12 : size === 'lg' ? 20 : 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginRight: theme.spacing.xs,
    },
    selectedCircle: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    label: { color: theme.colors.textPrimary, fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16 },
  });

  return (
    <View ref={ref} style={[styles.container, style]}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={styles.option}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={[styles.circle, isSelected && styles.selectedCircle]} />
            <Text style={styles.label}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
