import { firebaseConfig, FIREBASE_AUTH_URL } from '../config/firebase';

export const authAPI = {
  // Sign up with email and password
  signUp: async (email, password) => {
    const response = await fetch(`${FIREBASE_AUTH_URL}:signUp?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const response = await fetch(`${FIREBASE_AUTH_URL}:signInWithPassword?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    return data;
  },

  // Get user data
  getUserData: async (idToken) => {
    const response = await fetch(`${FIREBASE_AUTH_URL}:lookup?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    return data.users[0];
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    return data;
  },

  // Sign out (client-side only)
  signOut: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};
