// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const OAUTH2_REDIRECT_URI = import.meta.env.VITE_OAUTH2_REDIRECT_URI || 'http://localhost:5173/auth/callback';

// Expense Categories
export const EXPENSE_CATEGORIES = {
  PERSONAL: 'PERSONAL',
  SURVIVAL_LIVELIHOOD: 'SURVIVAL_LIVELIHOOD',
  INVESTMENT: 'INVESTMENT'
};

// Income Sources
export const INCOME_SOURCES = {
  FROM_INVESTMENT: 'FROM_INVESTMENT',
  SALARY: 'SALARY',
  FROM_TRADING: 'FROM_TRADING'
};

// Auth Providers
export const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
  GITHUB: 'GITHUB'
};

// Category Labels (for display)
export const CATEGORY_LABELS = {
  PERSONAL: 'Personal',
  SURVIVAL_LIVELIHOOD: 'Survival & Livelihood',
  INVESTMENT: 'Investment'
};

// Source Labels (for display)
export const SOURCE_LABELS = {
  FROM_INVESTMENT: 'From Investment',
  SALARY: 'Salary',
  FROM_TRADING: 'From Trading'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'userData'
};

