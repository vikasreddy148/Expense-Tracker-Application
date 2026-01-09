import { createContext, useContext, useState, useEffect } from 'react';
import { signup, login, logout, getCurrentUser, handleOAuth2Callback as extractOAuth2Data } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await getCurrentUser();
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      const { token: authToken, username: userUsername, email, provider, roles } = response;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      const userData = { username: userUsername, email, provider, roles };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      
      toast.success('Login successful!');
      window.location.href = '/dashboard';
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const handleSignup = async (username, email, password) => {
    try {
      const response = await signup(username, email, password);
      const { token: authToken, username: userUsername, email: userEmail, provider, roles } = response;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      const userData = { username: userUsername, email: userEmail, provider, roles };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      
      toast.success('Signup successful!');
      window.location.href = '/dashboard';
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      return { success: false, error: error.message };
    }
  };

  const handleOAuth2Callback = async (searchParams) => {
    try {
      const authData = extractOAuth2Data(searchParams);
      const { token: authToken, username, email, provider, roles } = authData;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      const userData = { username, email, provider, roles };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      
      toast.success('Authentication successful!');
      window.location.href = '/dashboard';
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'OAuth2 authentication failed');
      window.location.href = '/login';
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      // Even if API call fails, clear local state
      setToken(null);
      setUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    handleOAuth2Callback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

