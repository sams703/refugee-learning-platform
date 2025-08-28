import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  theme: 'light',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  offline: {
    autoDownload: true,
    downloadOnWifi: true,
    maxStorage: 500, // MB
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    screenReader: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateOfflineSettings: (state, action) => {
      state.offline = { ...state.offline, ...action.payload };
    },
    updateAccessibilitySettings: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  setLanguage,
  setTheme,
  updateNotificationSettings,
  updateOfflineSettings,
  updateAccessibilitySettings,
  resetSettings,
} = settingsSlice.actions;

// Selectors
export const selectLanguage = (state) => state.settings.language;
export const selectTheme = (state) => state.settings.theme;
export const selectNotificationSettings = (state) => state.settings.notifications;
export const selectOfflineSettings = (state) => state.settings.offline;
export const selectAccessibilitySettings = (state) => state.settings.accessibility;

export default settingsSlice.reducer;
