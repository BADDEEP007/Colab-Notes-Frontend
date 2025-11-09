import { useState } from 'react';
import authApi from '../../api/authApi';

const ResendVerification = ({ email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await authApi.sendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to send verification email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Email not verified
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Please verify your email address to access all features.
            {email && ` We sent a verification link to ${email}.`}
          </p>
          
          {message && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
