"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoginModal from '../components/modals/LoginModal';

interface LoginModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: (onAction?: () => void, actionType?: 'favorite' | 'cart') => void;
  closeLoginModal: () => void;
  loginModalAction: (() => void) | null;
  loginModalActionType: 'favorite' | 'cart' | null;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const LoginModalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalAction, setLoginModalAction] = useState<(() => void) | null>(null);
  const [loginModalActionType, setLoginModalActionType] = useState<'favorite' | 'cart' | null>(null);

  const openLoginModal = (onAction?: () => void, actionType?: 'favorite' | 'cart') => {
    if (onAction) setLoginModalAction(() => onAction);
    if (actionType) setLoginModalActionType(actionType);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginModalAction(null);
    setLoginModalActionType(null);
  };

  return (
    <LoginModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginModalAction,
        loginModalActionType,
      }}
    >
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onAction={loginModalAction || undefined}
        actionType={loginModalActionType || undefined}
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