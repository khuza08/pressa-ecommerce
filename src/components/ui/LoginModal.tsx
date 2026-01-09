'use client';

import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onSwitchToRegister 
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

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