import api from './api';

/**
 * Get all incomes
 */
export const getIncomes = async () => {
  const response = await api.get('/incomes');
  return response.data;
};

/**
 * Get income by ID
 */
export const getIncomeById = async (id) => {
  const response = await api.get(`/incomes/${id}`);
  return response.data;
};

/**
 * Add income
 */
export const addIncome = async (incomeData) => {
  const response = await api.post('/incomes', incomeData);
  return response.data;
};

/**
 * Update income
 */
export const updateIncome = async (id, incomeData) => {
  const response = await api.put(`/incomes/${id}`, incomeData);
  return response.data;
};

/**
 * Delete income
 */
export const deleteIncome = async (id) => {
  const response = await api.delete(`/incomes/${id}`);
  return response.data;
};

/**
 * Filter incomes
 */
export const filterIncomes = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.source) params.append('source', filters.source);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.minAmount) params.append('minAmount', filters.minAmount);
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

  const response = await api.get(`/incomes/filter?${params.toString()}`);
  return response.data;
};

/**
 * Sort incomes
 */
export const sortIncomes = async (sortBy, order = 'asc') => {
  const response = await api.get(`/incomes/sort?sortBy=${sortBy}&order=${order}`);
  return response.data;
};

