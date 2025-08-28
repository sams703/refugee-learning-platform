import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    primaryVariant: '#1565C0',
    secondary: '#FFA726',
    secondaryVariant: '#FF9800',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
    disabled: '#BDBDBD',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  roundness: 8,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export default theme;
