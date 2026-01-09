import api from './api';

/**
 * Get total P&L
 */
export const getPnL = async () => {
  const response = await api.get('/dashboard/pnl');
  return response.data;
};

/**
 * Get P&L for date range
 */
export const getPnLByDateRange = async (startDate, endDate) => {
  const response = await api.get(`/dashboard/pnl/range?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

