import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  filterExpenses,
  sortExpenses 
} from '../services/expenseService';
import { EXPENSE_CATEGORIES, CATEGORY_LABELS } from '../utils/constants';
import { formatCurrency, formatDateForDisplay, formatDateForAPI } from '../utils/formatters';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiFilter, FiX } from 'react-icons/fi';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const expenseData = {
        description: data.description,
        category: data.category,
        amount: parseFloat(data.amount),
        dateOfExpense: formatDateForAPI(data.dateOfExpense),
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await addExpense(expenseData);
        toast.success('Expense added successfully');
      }

      reset();
      setShowModal(false);
      setEditingExpense(null);
      loadExpenses();
    } catch (error) {
      toast.error(error.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setValue('description', expense.description);
    setValue('category', expense.category);
    setValue('amount', expense.amount);
    setValue('dateOfExpense', expense.dateOfExpense);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted successfully');
        loadExpenses();
      } catch (error) {
        toast.error(error.message || 'Failed to delete expense');
      }
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      const data = await filterExpenses(filters);
      setExpenses(data);
      setShowFilters(false);
    } catch (error) {
      toast.error(error.message || 'Failed to filter expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (sortBy, order) => {
    try {
      setLoading(true);
      const data = await sortExpenses(sortBy, order);
      setExpenses(data);
    } catch (error) {
      toast.error(error.message || 'Failed to sort expenses');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      PERSONAL: 'bg-blue-100 text-blue-800',
      SURVIVAL_LIVELIHOOD: 'bg-green-100 text-green-800',
      INVESTMENT: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter className="inline mr-2" />
              Filters
            </Button>
            <Button variant="primary" onClick={() => { reset(); setEditingExpense(null); setShowModal(true); }}>
              <FiPlus className="inline mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Expenses</h3>
              <button onClick={() => { setShowFilters(false); loadExpenses(); }}>
                <FiX className="text-xl" />
              </button>
            </div>
            <FilterForm onFilter={handleFilter} onClear={() => { loadExpenses(); setShowFilters(false); }} />
          </Card>
        )}

        <Card>
          <div className="mb-4 flex gap-2">
            <select
              onChange={(e) => handleSort(e.target.value, 'asc')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">Sort by...</option>
              <option value="category">Category</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : expenses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No expenses found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{expense.description}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(expense.category)}`}>
                          {CATEGORY_LABELS[expense.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-red-600">{formatCurrency(expense.amount)}</td>
                      <td className="px-4 py-3">{formatDateForDisplay(expense.dateOfExpense)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ExpenseModal
          onSubmit={handleSubmit(onSubmit)}
          onClose={() => { setShowModal(false); reset(); setEditingExpense(null); }}
          register={register}
          errors={errors}
          editingExpense={editingExpense}
        />
      )}
    </DashboardLayout>
  );
};

const FilterForm = ({ onFilter, onClear }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onFilter)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select {...register('category')} className="w-full px-3 py-2 border rounded-lg">
          <option value="">All Categories</option>
          {Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => (
            <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input type="date" {...register('startDate')} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input type="date" {...register('endDate')} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Min Amount</label>
        <input type="number" step="0.01" {...register('minAmount')} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max Amount</label>
        <input type="number" step="0.01" {...register('maxAmount')} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" variant="primary">Apply Filters</Button>
        <Button type="button" variant="secondary" onClick={onClear}>Clear</Button>
      </div>
    </form>
  );
};

const ExpenseModal = ({ onSubmit, onClose, register, errors, editingExpense }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={onSubmit}>
          <Input
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            placeholder="Enter expense description"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-danger">*</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-danger' : 'border-gray-300'}`}
            >
              <option value="">Select category</option>
              {Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => (
                <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-danger">{errors.category.message}</p>}
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })}
            error={errors.amount?.message}
            placeholder="0.00"
          />

          <Input
            label="Date"
            type="date"
            {...register('dateOfExpense', { required: 'Date is required' })}
            error={errors.dateOfExpense?.message}
          />

          <div className="flex gap-2 mt-4">
            <Button type="submit" variant="primary" className="flex-1">Save</Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Expenses;

