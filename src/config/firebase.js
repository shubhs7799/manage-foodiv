export const firebaseConfig = {
  apiKey: "AIzaSyAvJActIsb4M-XcMJ49GEWfQIQRs4xzDh4",
  authDomain: "foodiv-48fa9.firebaseapp.com",
  projectId: "foodiv-48fa9",
  storageBucket: "foodiv-48fa9.firebasestorage.app",
  databaseURL: "https://foodiv-48fa9.firebaseio.com"
};

export const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;
export const FIREBASE_DB_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Admin email - only this email can access admin panel
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@foodiv.com";
