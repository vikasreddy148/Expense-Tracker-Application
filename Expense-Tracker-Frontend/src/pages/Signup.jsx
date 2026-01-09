import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { initiateOAuth2Login } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    setLoading(true);
    const result = await signup(data.username, data.email, data.password);
    setLoading(false);
    if (!result.success) {
      // Error is already handled by AuthContext with toast
    }
  };

  const handleOAuth2Signup = (provider) => {
    initiateOAuth2Login(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-600">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Username"
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
              error={errors.username?.message}
              placeholder="Choose a username"
            />

            <Input
              label="Email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
              placeholder="your.email@example.com"
            />

            <Input
              label="Password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
              placeholder="Create a password"
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
              placeholder="Confirm your password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth2Signup('google')}
              className="flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth2Signup('github')}
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

export default Signup;

