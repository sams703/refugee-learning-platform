import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProgress: {},
  badges: [],
  achievements: [],
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateProgress: (state, action) => {
      const { courseId, lessonId, progress } = action.payload;
      if (!state.userProgress[courseId]) {
        state.userProgress[courseId] = {};
      }
      state.userProgress[courseId][lessonId] = progress;
    },
    addBadge: (state, action) => {
      state.badges.push(action.payload);
    },
    setAchievements: (state, action) => {
      state.achievements = action.payload;
    },
  },
});

export const { updateProgress, addBadge, setAchievements } = progressSlice.actions;

export const selectUserProgress = (state) => state.progress.userProgress;
export const selectBadges = (state) => state.progress.badges;
export const selectAchievements = (state) => state.progress.achievements;

export default progressSlice.reducer;
