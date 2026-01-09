import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { initiateOAuth2Login } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FiMail, FiLock, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.username, data.password);
    setLoading(false);
    if (!result.success) {
      // Error is already handled by AuthContext with toast
    }
  };

  const handleOAuth2Login = (provider) => {
    initiateOAuth2Login(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-blue-600">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Username or Email"
              {...register('username', { required: 'Username or email is required' })}
              error={errors.username?.message}
              placeholder="Enter your username or email"
            />

            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/" className="font-medium text-primary hover:text-blue-600">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth2Login('google')}
              className="flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth2Login('github')}
              className="flex items-center justify-center gap-2"
            >
              <FiGithub className="text-xl" />
              <span>GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

