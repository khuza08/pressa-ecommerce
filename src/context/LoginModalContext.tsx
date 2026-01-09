"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoginModal from '../components/ui/LoginModal';

interface LoginModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: (onAction?: () => void, actionType?: 'favorite' | 'cart') => void;
  closeLoginModal: () => void;
  loginModalAction: (() => void) | null;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const LoginModalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalAction, setLoginModalAction] = useState<(() => void) | null>(null);

  const openLoginModal = (onAction?: () => void, actionType?: 'favorite' | 'cart') => {
    if (onAction) setLoginModalAction(() => onAction);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginModalAction(null);
  };

  return (
    <LoginModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginModalAction,
      }}
    >
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginSuccess={loginModalAction || undefined}
      />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
};