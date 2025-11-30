import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const FormError: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  return (
    <Text style={StyleSheet.create({ error: { color: theme.colors.error, fontSize: 12, marginTop: theme.spacing.xs } }).error}>
      {children}
    </Text>
  );
};

export default FormError;
