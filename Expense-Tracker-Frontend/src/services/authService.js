import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Sign up a new user
 */
export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login user
 */
export const login = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Even if API call fails, clear local storage
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

/**
 * Handle OAuth2 callback - Extract data from URL query parameters
 */
export const handleOAuth2Callback = (searchParams) => {
  const token = searchParams.get('token');
  const username = searchParams.get('username');
  const email = searchParams.get('email');
  const provider = searchParams.get('provider') || 'LOCAL';

  if (!token) {
    throw new Error('No token received from OAuth2 provider');
  }

  return {
    token,
    username,
    email,
    provider,
    roles: ['ROLE_USER'], // Default role
  };
};

/**
 * Initiate OAuth2 login
 */
export const initiateOAuth2Login = (provider) => {
  // Redirect to backend OAuth2 endpoint
  window.location.href = `http://localhost:8080/oauth2/authorization/${provider.toLowerCase()}`;
};

