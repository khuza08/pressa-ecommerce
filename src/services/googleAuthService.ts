// src/services/googleAuthService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const googleAuthService = {
  // Redirect the user to the backend to initiate Google OAuth flow
  // The backend will then redirect to Google's OAuth server
  initiateGoogleLogin: () => {
    // Redirect to the backend endpoint to initiate the OAuth flow
    // The backend will handle the interaction with Google
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  },

  // No longer handling the callback directly - backend handles that
  // Frontend callback page will receive the token from the backend redirect
};