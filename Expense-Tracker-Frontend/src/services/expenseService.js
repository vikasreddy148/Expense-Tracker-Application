import api from './api';

/**
 * Get all expenses
 */
export const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

/**
 * Get expense by ID
 */
export const getExpenseById = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Add expense
 */
export const addExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

/**
 * Update expense
 */
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

/**
 * Delete expense
 */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

/**
 * Filter expenses
 */
export const filterExpenses = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.minAmount) params.append('minAmount', filters.minAmount);
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

  const response = await api.get(`/expenses/filter?${params.toString()}`);
  return response.data;
};

/**
 * Sort expenses
 */
export const sortExpenses = async (sortBy, order = 'asc') => {
  const response = await api.get(`/expenses/sort?sortBy=${sortBy}&order=${order}`);
  return response.data;
};

