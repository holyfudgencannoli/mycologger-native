import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Switch, SwitchProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';


export interface SwitchControlProps extends Omit<SwitchProps, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SwitchControl = forwardRef<Switch, SwitchControlProps>((props, ref) => {
  const theme = useTheme();
  const { label, style, ...rest } = props;

  const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    label: { marginLeft: theme.spacing.sm, color: theme.colors.textPrimary },
  });

  return (
    <View style={[styles.container, style]}>
      <Switch ref={ref} {...rest} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
});

SwitchControl.displayName = 'SwitchControl';
export default SwitchControl;
