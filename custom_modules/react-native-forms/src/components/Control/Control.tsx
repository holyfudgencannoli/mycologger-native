import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { FormControlProps } from '../../types';

export const Control: React.FC<FormControlProps> = ({
  id,
  name,
  label,
  size = 'md',
  variant = 'default',
  disabled = false,
  required = false,
  error,
  children,
  labelStyle
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: { marginBottom: theme.spacing.sm },
    label: {
      color: theme.colors.textPrimary,
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      marginBottom: theme.spacing.xs,
      textAlign: 'center'
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, {...labelStyle}]} accessibilityLabel={`${name}-label`}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      <View style={{ flexDirection: 'row' }}>{children}</View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Control;
