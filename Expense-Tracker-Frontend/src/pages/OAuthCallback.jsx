import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleOAuth2Callback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleOAuth2Callback(searchParams);
        // Navigation is handled in AuthContext
      } catch (error) {
        console.error('OAuth2 callback error:', error);
        // Fallback navigation if AuthContext navigation fails
        window.location.href = '/login';
      }
    };

    processCallback();
  }, [searchParams, handleOAuth2Callback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;

