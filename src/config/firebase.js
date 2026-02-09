export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

export const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;
export const FIREBASE_DB_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Admin email - only this email can access admin panel
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@foodiv.com";


