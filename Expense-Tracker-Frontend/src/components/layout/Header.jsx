import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Expense Tracker
        </Link>
        
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/about" className="text-gray-700 hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary">
                Contact
              </Link>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

