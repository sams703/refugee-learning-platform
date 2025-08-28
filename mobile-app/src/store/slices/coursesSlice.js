import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
};

// Async thunks will be implemented later
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      // API call to be implemented
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCourses, setCurrentCourse, clearError } = coursesSlice.actions;

export const selectCourses = (state) => state.courses.courses;
export const selectCurrentCourse = (state) => state.courses.currentCourse;
export const selectCoursesLoading = (state) => state.courses.isLoading;

export default coursesSlice.reducer;
