'use client';

import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import { googleAuthService } from '@/services/googleAuthService';

export default function GoogleLoginButton() {
  const { loginWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // Use the real Google OAuth service to initiate the flow
      googleAuthService.initiateGoogleLogin();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1 py-3 px-4 border-2 border-black/10 rounded-lg hover:bg-[#242424]/5 transition font-medium"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
      ) : (
        <>
          <span>Login with</span>
          <FcGoogle size={20} />
          <span>much faster!</span>
        </>
      )}
    </button>
  );
}