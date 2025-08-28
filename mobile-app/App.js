import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeI18n } from './src/i18n';
import { initializeDatabase } from './src/services/database';
import theme from './src/utils/theme';
import LoadingScreen from './src/screens/LoadingScreen';

// Initialize i18n
initializeI18n();

const App = () => {
  useEffect(() => {
    // Initialize offline database
    initializeDatabase()
      .then(() => {
        console.log('Mobile database initialized successfully');
      })
      .catch((error) => {
        console.error('Failed to initialize mobile database:', error);
      });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={theme.colors.primary}
            />
            <AppNavigator />
            <Toast />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
