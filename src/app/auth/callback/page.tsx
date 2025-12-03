'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Get user info from the token by calling the user endpoint
      const fetchUserAndLogin = async () => {
        try {
          // First, store the token temporarily to make authenticated requests
          localStorage.setItem('auth_token', token);

          // Since we received the token, we can decode it to get user info
          // Or just store the token and get user info later
          // For now, we'll get the user details from the backend
          // First, let's use the token to fetch the current user

          // We need to call the backend to get user info based on the token
          // The backend should have a way to get the user from the token
          // Let's try to get the user by making an authenticated call

          // We can get the user ID from the JWT token by decoding it
          // Or call the backend to get user info using the token
          // Let's try to get user info from backend using the token
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          let user;
          if (response.ok) {
            user = await response.json();
          } else {
            // If we can't get user info, use a temporary user object
            console.error('Failed to fetch user profile');
            user = { id: 'temp', name: 'Google User', email: 'google@example.com' };
          }

          // Login the user in the frontend by storing user data and token
          loginWithToken(user, token);

          // Redirect to the shop page
          router.push('/shop');
          router.refresh(); // Refresh to update UI
        } catch (error) {
          console.error('Error during Google OAuth callback:', error);
          // Redirect with error message
          router.push('/login?error=google_auth_failed');
        }
      };

      fetchUserAndLogin();
    } else {
      console.error('No token received from backend');
      router.push('/login');
    }
  }, [searchParams, router, loginWithToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Processing Google authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}