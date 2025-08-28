import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
const BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://your-production-api.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.removeItem('token');
      // Handle logout logic here if needed
    }
    return Promise.reject(error);
  }
);

// Authentication Service
export const authService = {
  login: (username, password) => {
    return api.post('/auth/login', { username, password });
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
};

// Courses Service
export const coursesService = {
  getAllCourses: (params = {}) => {
    return api.get('/courses', { params });
  },

  getCourse: (courseId) => {
    return api.get(`/courses/${courseId}`);
  },

  createCourse: (courseData) => {
    return api.post('/courses', courseData);
  },

  updateCourse: (courseId, courseData) => {
    return api.put(`/courses/${courseId}`, courseData);
  },

  publishCourse: (courseId, isPublished) => {
    return api.put(`/courses/${courseId}/publish`, { is_published: isPublished });
  },
};

// Lessons Service
export const lessonsService = {
  getLesson: (lessonId) => {
    return api.get(`/lessons/${lessonId}`);
  },

  createLesson: (lessonData) => {
    return api.post('/lessons', lessonData);
  },

  updateLesson: (lessonId, lessonData) => {
    return api.put(`/lessons/${lessonId}`, lessonData);
  },
};

// Progress Service
export const progressService = {
  getUserProgress: (userId) => {
    return api.get(`/progress/user/${userId}`);
  },

  updateProgress: (progressData) => {
    return api.post('/progress', progressData);
  },

  getCourseProgress: (userId, courseId) => {
    return api.get(`/progress/user/${userId}/course/${courseId}`);
  },
};

// Assessments Service
export const assessmentsService = {
  getAssessment: (lessonId) => {
    return api.get(`/assessments/lesson/${lessonId}`);
  },

  submitAssessment: (assessmentData) => {
    return api.post('/assessments/submit', assessmentData);
  },

  getAssessmentResults: (userId, assessmentId) => {
    return api.get(`/assessments/${assessmentId}/results/${userId}`);
  },
};

// Badges Service
export const badgesService = {
  getUserBadges: (userId) => {
    return api.get(`/badges/user/${userId}`);
  },

  getAllBadges: () => {
    return api.get('/badges');
  },
};

// Sync Service
export const syncService = {
  syncData: (syncData) => {
    return api.post('/sync', syncData);
  },

  getLastSync: (userId) => {
    return api.get(`/sync/last/${userId}`);
  },
};

// Offline Support
export const offlineService = {
  // Store API calls for offline sync
  queueApiCall: async (method, endpoint, data = null) => {
    try {
      const offlineQueue = await AsyncStorage.getItem('offlineQueue');
      const queue = offlineQueue ? JSON.parse(offlineQueue) : [];
      
      queue.push({
        id: Date.now().toString(),
        method,
        endpoint,
        data,
        timestamp: Date.now(),
      });
      
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Error queueing API call:', error);
    }
  },

  // Process offline queue when connection is restored
  processOfflineQueue: async () => {
    try {
      const offlineQueue = await AsyncStorage.getItem('offlineQueue');
      if (!offlineQueue) return;

      const queue = JSON.parse(offlineQueue);
      const results = [];

      for (const item of queue) {
        try {
          let result;
          switch (item.method.toLowerCase()) {
            case 'get':
              result = await api.get(item.endpoint);
              break;
            case 'post':
              result = await api.post(item.endpoint, item.data);
              break;
            case 'put':
              result = await api.put(item.endpoint, item.data);
              break;
            case 'delete':
              result = await api.delete(item.endpoint);
              break;
            default:
              throw new Error(`Unsupported method: ${item.method}`);
          }
          results.push({ success: true, item, result });
        } catch (error) {
          results.push({ success: false, item, error: error.message });
        }
      }

      // Clear the queue after processing
      await AsyncStorage.removeItem('offlineQueue');
      
      return results;
    } catch (error) {
      console.error('Error processing offline queue:', error);
      throw error;
    }
  },
};

export default api;
