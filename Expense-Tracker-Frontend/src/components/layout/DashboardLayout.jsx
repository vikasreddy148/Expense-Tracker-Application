import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-0 h-full w-64 bg-gray-800 text-white z-40 overflow-y-auto">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </>
        )}

        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

