import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getExpenses, filterExpenses, sortExpenses, deleteExpense } from '../services/expenseService';
import { getIncomes, filterIncomes, sortIncomes, deleteIncome } from '../services/incomeService';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_SOURCES, CATEGORY_LABELS, SOURCE_LABELS } from '../utils/constants';
import { FiFilter, FiArrowUp, FiArrowDown, FiTrash2, FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'income'
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const filterForm = useForm();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const [expensesData, incomesData] = await Promise.all([
        getExpenses(),
        getIncomes(),
      ]);
      setExpenses(expensesData);
      setIncomes(incomesData);
    } catch (error) {
      toast.error(error.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (data) => {
    try {
      setLoading(true);
      if (activeTab === 'expenses') {
        const filters = {
          category: data.category || undefined,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          minAmount: data.minAmount || undefined,
          maxAmount: data.maxAmount || undefined,
        };
        const filtered = await filterExpenses(filters);
        setExpenses(filtered);
      } else {
        const filters = {
          source: data.source || undefined,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          minAmount: data.minAmount || undefined,
          maxAmount: data.maxAmount || undefined,
        };
        const filtered = await filterIncomes(filters);
        setIncomes(filtered);
      }
      setShowFilters(false);
    } catch (error) {
      toast.error(error.message || 'Failed to filter transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    filterForm.reset();
    loadTransactions();
    setShowFilters(false);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'expense') {
          await deleteExpense(id);
        } else {
          await deleteIncome(id);
        }
        toast.success(`${type === 'expense' ? 'Expense' : 'Income'} deleted successfully`);
        loadTransactions();
      } catch (error) {
        toast.error(error.message || `Failed to delete ${type}`);
      }
    }
  };

  useEffect(() => {
    const performSort = async () => {
      try {
        setLoading(true);
        if (activeTab === 'expenses') {
          const sorted = await sortExpenses(sortBy, sortOrder);
          setExpenses(sorted);
        } else {
          const sorted = await sortIncomes(sortBy, sortOrder);
          setIncomes(sorted);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to sort transactions');
      } finally {
        setLoading(false);
      }
    };
    performSort();
  }, [sortBy, sortOrder, activeTab]);

  const currentTransactions = activeTab === 'expenses' ? expenses : incomes;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all your transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('expenses');
              loadTransactions();
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses <span className="ml-2 text-sm">({expenses.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('income');
              loadTransactions();
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'income'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Income <span className="ml-2 text-sm">({incomes.length})</span>
          </button>
        </div>

        {/* Filters and Sort Section */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FiFilter />
            Filters
          </Button>

          <div className="flex items-center gap-2">
            {sortOrder === 'asc' ? (
              <FiArrowUp className="text-gray-600" />
            ) : (
              <FiArrowDown className="text-gray-600" />
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Date</option>
              {activeTab === 'expenses' ? (
                <option value="category">Category</option>
              ) : (
                <option value="source">Source</option>
              )}
              <option value="amount">Amount</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Filter Form */}
        {showFilters && (
          <Card className="p-6">
            <form onSubmit={filterForm.handleSubmit(handleFilter)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTab === 'expenses' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CATEGORY</label>
                    <select
                      {...filterForm.register('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All</option>
                      {Object.entries(EXPENSE_CATEGORIES).map(([, value]) => (
                        <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SOURCE</label>
                    <select
                      {...filterForm.register('source')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All</option>
                      {Object.entries(INCOME_SOURCES).map(([, value]) => (
                        <option key={value} value={value}>{SOURCE_LABELS[value]}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DATE RANGE</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      {...filterForm.register('startDate')}
                      placeholder="From"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="date"
                      {...filterForm.register('endDate')}
                      placeholder="To"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AMOUNT RANGE</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      {...filterForm.register('minAmount')}
                      placeholder="Min (₹)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      step="0.01"
                      {...filterForm.register('maxAmount')}
                      placeholder="Max (₹)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary">Apply Filters</Button>
                <Button type="button" variant="secondary" onClick={handleClearFilters}>Clear</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Transactions List */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : currentTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No {activeTab} transactions found</p>
          ) : (
            <div className="space-y-3">
              {currentTransactions.map((transaction) => {
                const isExpense = activeTab === 'expenses';
                const date = isExpense ? transaction.dateOfExpense : transaction.dateOfIncome;
                const category = isExpense 
                  ? CATEGORY_LABELS[transaction.category] 
                  : SOURCE_LABELS[transaction.source];
                
                const categoryColors = isExpense
                  ? {
                      PERSONAL: 'bg-blue-100 text-blue-800',
                      SURVIVAL_LIVELIHOOD: 'bg-green-100 text-green-800',
                      INVESTMENT: 'bg-purple-100 text-purple-800',
                    }
                  : {
                      SALARY: 'bg-green-100 text-green-800',
                      FROM_INVESTMENT: 'bg-blue-100 text-blue-800',
                      FROM_TRADING: 'bg-purple-100 text-purple-800',
                    };

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isExpense ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {isExpense ? (
                          <FiArrowDownLeft className={`text-xl ${isExpense ? 'text-red-600' : 'text-green-600'}`} />
                        ) : (
                          <FiArrowUpRight className="text-xl text-green-600" />
                        )}
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900">{transaction.description}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            categoryColors[isExpense ? transaction.category : transaction.source]
                          }`}>
                            {category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{formatDateForDisplay(date)}</p>
                      </div>

                      {/* Amount and Delete */}
                      <div className="flex items-center gap-4">
                        <p className={`font-semibold text-lg ${
                          isExpense ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isExpense ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <button
                          onClick={() => handleDelete(transaction.id, activeTab === 'expenses' ? 'expense' : 'income')}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;

