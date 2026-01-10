"use client";
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void; // Action to perform after login
  actionType?: 'favorite' | 'cart'; // Type of action that triggered the modal
}

const LoginModal = ({ isOpen, onClose, onAction, actionType }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // Close modal and perform the original action if provided
      onClose();
      if (onAction) {
        onAction();
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAction = () => {
    // Close modal and perform the original action without authentication
    // This is for demo purposes - in a real app, you might want to implement guest cart/favorites
    onClose();
    if (onAction) {
      onAction();
    }
  };

  const actionText = actionType === 'favorite' ? 'favorite this item' : 'add to cart';
  
  return (
    <div className="fixed inset-0 bg-[#242424]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Log in to {actionText}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#242424]/10 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            You need to log in to {actionText}. Sign in to continue or continue as guest.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#242424] text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-4">Don't have an account?</p>
            <Link 
              href="/auth/signup" 
              className="block w-full text-center bg-gray-100 text-black py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-3"
            >
              Create Account
            </Link>
            
            <button
              onClick={handleGuestAction}
              className="w-full text-center text-blue-600 font-medium hover:underline"
            >
              Continue as Guest
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link 
              href={`/auth/google?redirect=/auth/callback`} 
              className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;