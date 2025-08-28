import { createSlice } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';

const initialState = {
  isConnected: true,
  pendingSync: [],
  lastSyncTime: null,
  syncInProgress: false,
  offlineQueue: [],
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    addToSyncQueue: (state, action) => {
      state.pendingSync.push(action.payload);
    },
    removeFromSyncQueue: (state, action) => {
      state.pendingSync = state.pendingSync.filter(
        item => item.id !== action.payload
      );
    },
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    addToOfflineQueue: (state, action) => {
      state.offlineQueue.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    clearOfflineQueue: (state) => {
      state.offlineQueue = [];
    },
  },
});

export const {
  setConnectionStatus,
  addToSyncQueue,
  removeFromSyncQueue,
  setSyncInProgress,
  setLastSyncTime,
  addToOfflineQueue,
  clearOfflineQueue,
} = offlineSlice.actions;

// Selectors
export const selectIsConnected = (state) => state.offline.isConnected;
export const selectPendingSync = (state) => state.offline.pendingSync;
export const selectSyncInProgress = (state) => state.offline.syncInProgress;
export const selectOfflineQueue = (state) => state.offline.offlineQueue;

export default offlineSlice.reducer;
