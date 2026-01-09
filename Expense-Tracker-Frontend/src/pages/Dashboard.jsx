/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { getPnL } from '../services/dashboardService';
import { getExpenses, addExpense, deleteExpense } from '../services/expenseService';
import { getIncomes, addIncome, deleteIncome } from '../services/incomeService';
import { formatCurrency, formatDateForDisplay, formatDateForAPI } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_SOURCES, CATEGORY_LABELS, SOURCE_LABELS } from '../utils/constants';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [pnl, setPnl] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const expenseForm = useForm();
  const incomeForm = useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [pnlData, expensesData, incomesData] = await Promise.all([
        getPnL(),
        getExpenses(),
        getIncomes(),
      ]);

      setPnl(pnlData);
      setExpenses(expensesData);
      setIncomes(incomesData);
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onExpenseSubmit = async (data) => {
    try {
      const expenseData = {
        description: data.description,
        category: data.category,
        amount: parseFloat(data.amount),
        dateOfExpense: formatDateForAPI(data.dateOfExpense || new Date()),
      };

      await addExpense(expenseData);
      toast.success('Expense added successfully');
      expenseForm.reset();
      loadDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to add expense');
    }
  };

  const onIncomeSubmit = async (data) => {
    try {
      const incomeData = {
        description: data.description,
        source: data.source,
        amount: parseFloat(data.amount),
        dateOfIncome: formatDateForAPI(data.dateOfIncome || new Date()),
      };

      await addIncome(incomeData);
      toast.success('Income added successfully');
      incomeForm.reset();
      loadDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to add income');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted successfully');
        loadDashboardData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete expense');
      }
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome(id);
        toast.success('Income deleted successfully');
        loadDashboardData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete income');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const profitLoss = pnl?.profitLoss || 0;
  const isProfit = profitLoss >= 0;
  const totalTransactions = expenses.length + incomes.length;
  const savingsRate = pnl?.totalIncome > 0 
    ? ((profitLoss / pnl.totalIncome) * 100).toFixed(0)
    : 0;

  // Get recent transactions (last 10, mixed)
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense', date: e.dateOfExpense })),
    ...incomes.map(i => ({ ...i, type: 'income', date: i.dateOfIncome }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your finances at a glance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-semibold uppercase mb-2">Total Income</p>
                <p className="text-4xl font-bold">{formatCurrency(pnl?.totalIncome || 0)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <FiTrendingUp className="text-3xl" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs font-semibold uppercase mb-2">Total Expenses</p>
                <p className="text-4xl font-bold">{formatCurrency(pnl?.totalExpense || 0)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <FiTrendingDown className="text-3xl" />
              </div>
            </div>
          </Card>

          <Card className={`bg-gradient-to-br ${isProfit ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'} text-white p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-xs font-semibold uppercase mb-2">Net Profit/Loss</p>
                <p className="text-4xl font-bold">{formatCurrency(profitLoss)}</p>
                <p className="text-sm mt-2 opacity-90">
                  {isProfit ? "You're in profit!" : "You're in loss"}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <FiDollarSign className="text-3xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Add Expense and Income Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiPlus className="text-red-600 text-xl" />
              <h2 className="text-xl font-semibold">Add Expense</h2>
            </div>
            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4">
              <Input
                label="Description"
                {...expenseForm.register('description', { required: 'Description is required' })}
                error={expenseForm.formState.errors.description?.message}
                placeholder="e.g., Grocery shopping"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  {...expenseForm.register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => (
                    <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
                  ))}
                </select>
                {expenseForm.formState.errors.category && (
                  <p className="mt-1 text-sm text-danger">{expenseForm.formState.errors.category.message}</p>
                )}
              </div>

              <Input
                label="Amount (₹)"
                type="number"
                step="0.01"
                {...expenseForm.register('amount', { 
                  required: 'Amount is required', 
                  min: { value: 0.01, message: 'Amount must be greater than 0' } 
                })}
                error={expenseForm.formState.errors.amount?.message}
                placeholder="0.00"
              />

              <Input
                label="Date"
                type="date"
                {...expenseForm.register('dateOfExpense')}
                defaultValue={new Date().toISOString().split('T')[0]}
              />

              <Button type="submit" variant="danger" className="w-full">
                <FiPlus className="inline mr-2" />
                Add Expense
              </Button>
            </form>
          </Card>

          {/* Add Income Form */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiPlus className="text-green-600 text-xl" />
              <h2 className="text-xl font-semibold">Add Income</h2>
            </div>
            <form onSubmit={incomeForm.handleSubmit(onIncomeSubmit)} className="space-y-4">
              <Input
                label="Description"
                {...incomeForm.register('description', { required: 'Description is required' })}
                error={incomeForm.formState.errors.description?.message}
                placeholder="e.g., Monthly salary"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source <span className="text-danger">*</span>
                </label>
                <select
                  {...incomeForm.register('source', { required: 'Source is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select source</option>
                  {Object.entries(INCOME_SOURCES).map(([key, value]) => (
                    <option key={value} value={value}>{SOURCE_LABELS[value]}</option>
                  ))}
                </select>
                {incomeForm.formState.errors.source && (
                  <p className="mt-1 text-sm text-danger">{incomeForm.formState.errors.source.message}</p>
                )}
              </div>

              <Input
                label="Amount (₹)"
                type="number"
                step="0.01"
                {...incomeForm.register('amount', { 
                  required: 'Amount is required', 
                  min: { value: 0.01, message: 'Amount must be greater than 0' } 
                })}
                error={incomeForm.formState.errors.amount?.message}
                placeholder="0.00"
              />

              <Input
                label="Date"
                type="date"
                {...incomeForm.register('dateOfIncome')}
                defaultValue={new Date().toISOString().split('T')[0]}
              />

              <Button type="submit" variant="success" className="w-full">
                <FiPlus className="inline mr-2" />
                Add Income
              </Button>
            </form>
          </Card>
        </div>

        {/* Quick Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{totalTransactions}</p>
            </Card>
            <Card className="text-center p-4">
              <p className="text-sm text-gray-600 mb-2">Expenses Count</p>
              <p className="text-3xl font-bold text-red-600">{expenses.length}</p>
            </Card>
            <Card className="text-center p-4">
              <p className="text-sm text-gray-600 mb-2">Income Count</p>
              <p className="text-3xl font-bold text-green-600">{incomes.length}</p>
            </Card>
            <Card className="text-center p-4">
              <p className="text-sm text-gray-600 mb-2">Savings Rate</p>
              <p className="text-3xl font-bold text-purple-600">{savingsRate}%</p>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {allTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {allTransactions.map((transaction) => (
                <div 
                  key={`${transaction.type}-${transaction.id}`} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{transaction.description}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'expense' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.type === 'expense' 
                          ? CATEGORY_LABELS[transaction.category] 
                          : SOURCE_LABELS[transaction.source]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateForDisplay(transaction.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={() => transaction.type === 'expense' 
                        ? handleDeleteExpense(transaction.id) 
                        : handleDeleteIncome(transaction.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
