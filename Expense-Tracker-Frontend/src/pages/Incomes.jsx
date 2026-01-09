import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { 
  getIncomes, 
  addIncome, 
  updateIncome, 
  deleteIncome, 
  filterIncomes,
  sortIncomes 
} from '../services/incomeService';
import { INCOME_SOURCES, SOURCE_LABELS } from '../utils/constants';
import { formatCurrency, formatDateForDisplay, formatDateForAPI } from '../utils/formatters';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiFilter, FiX } from 'react-icons/fi';

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      const data = await getIncomes();
      setIncomes(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const incomeData = {
        description: data.description,
        source: data.source,
        amount: parseFloat(data.amount),
        dateOfIncome: formatDateForAPI(data.dateOfIncome),
      };

      if (editingIncome) {
        await updateIncome(editingIncome.id, incomeData);
        toast.success('Income updated successfully');
      } else {
        await addIncome(incomeData);
        toast.success('Income added successfully');
      }

      reset();
      setShowModal(false);
      setEditingIncome(null);
      loadIncomes();
    } catch (error) {
      toast.error(error.message || 'Failed to save income');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setValue('description', income.description);
    setValue('source', income.source);
    setValue('amount', income.amount);
    setValue('dateOfIncome', income.dateOfIncome);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome(id);
        toast.success('Income deleted successfully');
        loadIncomes();
      } catch (error) {
        toast.error(error.message || 'Failed to delete income');
      }
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      const data = await filterIncomes(filters);
      setIncomes(data);
      setShowFilters(false);
    } catch (error) {
      toast.error(error.message || 'Failed to filter incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (sortBy, order) => {
    try {
      setLoading(true);
      const data = await sortIncomes(sortBy, order);
      setIncomes(data);
    } catch (error) {
      toast.error(error.message || 'Failed to sort incomes');
    } finally {
      setLoading(false);
    }
  };

  const getSourceBadgeColor = (source) => {
    const colors = {
      SALARY: 'bg-green-100 text-green-800',
      FROM_INVESTMENT: 'bg-blue-100 text-blue-800',
      FROM_TRADING: 'bg-purple-100 text-purple-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Incomes</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter className="inline mr-2" />
              Filters
            </Button>
            <Button variant="primary" onClick={() => { reset(); setEditingIncome(null); setShowModal(true); }}>
              <FiPlus className="inline mr-2" />
              Add Income
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Incomes</h3>
              <button onClick={() => { setShowFilters(false); loadIncomes(); }}>
                <FiX className="text-xl" />
              </button>
            </div>
            <FilterForm onFilter={handleFilter} onClear={() => { loadIncomes(); setShowFilters(false); }} />
          </Card>
        )}

        <Card>
          <div className="mb-4 flex gap-2">
            <select
              onChange={(e) => handleSort(e.target.value, 'asc')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">Sort by...</option>
              <option value="source">Source</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : incomes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No incomes found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incomes.map((income) => (
                    <tr key={income.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{income.description}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(income.source)}`}>
                          {SOURCE_LABELS[income.source]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(income.amount)}</td>
                      <td className="px-4 py-3">{formatDateForDisplay(income.dateOfIncome)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(income)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(income.id)}
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
        <IncomeModal
          onSubmit={handleSubmit(onSubmit)}
          onClose={() => { setShowModal(false); reset(); setEditingIncome(null); }}
          register={register}
          errors={errors}
          editingIncome={editingIncome}
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
        <label className="block text-sm font-medium mb-1">Source</label>
        <select {...register('source')} className="w-full px-3 py-2 border rounded-lg">
          <option value="">All Sources</option>
          {Object.entries(INCOME_SOURCES).map(([key, value]) => (
            <option key={value} value={value}>{SOURCE_LABELS[value]}</option>
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

const IncomeModal = ({ onSubmit, onClose, register, errors, editingIncome }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{editingIncome ? 'Edit Income' : 'Add Income'}</h2>
        <form onSubmit={onSubmit}>
          <Input
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            placeholder="Enter income description"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source <span className="text-danger">*</span>
            </label>
            <select
              {...register('source', { required: 'Source is required' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.source ? 'border-danger' : 'border-gray-300'}`}
            >
              <option value="">Select source</option>
              {Object.entries(INCOME_SOURCES).map(([key, value]) => (
                <option key={value} value={value}>{SOURCE_LABELS[value]}</option>
              ))}
            </select>
            {errors.source && <p className="mt-1 text-sm text-danger">{errors.source.message}</p>}
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
            {...register('dateOfIncome', { required: 'Date is required' })}
            error={errors.dateOfIncome?.message}
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

export default Incomes;

