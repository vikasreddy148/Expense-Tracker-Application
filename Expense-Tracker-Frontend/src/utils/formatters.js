import { format, parseISO } from 'date-fns';

/**
 * Format date to YYYY-MM-DD for API
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  if (typeof date === 'string') {
    return date.split('T')[0]; // Extract date part from ISO string
  }
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd MMM, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(number);
};

