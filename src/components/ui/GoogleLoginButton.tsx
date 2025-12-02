'use client';

import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';

export default function GoogleLoginButton() {
  const { loginWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-black/20 rounded-lg hover:bg-black/5 transition font-medium"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
      ) : (
        <>
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
}