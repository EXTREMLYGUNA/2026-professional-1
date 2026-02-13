import axios from 'axios';

// ✅ FIX 1: Vite requires VITE_ prefix, not REACT_APP_
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000,
    withCredentials: true // ✅ Important for CORS
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url); // Debug
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        try {
            // ✅ FIX 2: Add leading slash and correct path
            const response = await api.post('/api/auth/register', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.user.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Register error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    login: async (userData) => {
        try {
            // ✅ FIX 2: Add leading slash and correct path
            const response = await api.post('/api/auth/login', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.user.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    getProfile: async () => {
        try {
            // ✅ FIX 2: Add leading slash and correct path
            const response = await api.get('/api/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Profile error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Failed to fetch profile' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }
};

export default api;