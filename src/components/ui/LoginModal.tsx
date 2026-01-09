'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void; // Callback to execute after successful login
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess
}: LoginModalProps) {
  const { isAuthenticated } = useAuth();

  // Close modal and execute callback when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    }
  }, [isAuthenticated, isOpen, onClose, onLoginSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <button
              onClick={onClose}
              className="text-black/50 hover:text-black p-1 rounded-full hover:bg-black/10"
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="mt-4">
            <GoogleLoginButton />
          </div>
          
        </div>
      </div>
    </div>
  );
}