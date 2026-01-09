import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiDollarSign, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/transactions', label: 'Transactions', icon: FiDollarSign },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-xl font-bold">Expense Tracker</span>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
          <li className="mt-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

