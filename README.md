# FooDiv - Restaurant Delivery App

A modern restaurant delivery application built with React, Redux Toolkit, Tailwind CSS, and Firebase REST API.

## Features

### Admin Panel
- **Category Management**: Create, update, and delete food categories
- **Recipe Management**: Add, edit, and remove recipes with details like price, prep time, ingredients, and images
- **Authentication**: Secure admin login system

### User Interface
- **Browse Menu**: View all recipes with category filtering
- **Shopping Cart**: Add items, adjust quantities, and place orders
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **Backend**: Firebase (using REST API, not SDK)

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password provider
4. Enable **Firestore Database** in test mode (or production mode with proper rules)
5. Get your Firebase config from Project Settings

### 2. Update Firebase Config

Edit `src/config/firebase.js` and replace with your Firebase credentials:

\`\`\`javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  databaseURL: "YOUR_DATABASE_URL"
};
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

## Usage

### Admin Panel

1. Navigate to `/admin/login`
2. Sign up for a new admin account or login
3. Manage categories at `/admin/categories`
4. Manage recipes at `/admin/recipes`

### User Interface

1. Navigate to `/` (home page)
2. Browse recipes by category
3. Add items to cart
4. View cart at `/cart`
5. Place orders

## Project Structure

\`\`\`
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── user/           # User-facing components
│   └── common/         # Shared components
├── pages/
│   ├── admin/          # Admin pages
│   └── user/           # User pages
├── redux/
│   ├── slices/         # Redux slices
│   └── store.js        # Redux store configuration
├── services/           # API services
├── config/             # Configuration files
└── App.jsx             # Main app component
\`\`\`

## Firebase REST API

This project uses Firebase REST API instead of the Firebase SDK:

- **Authentication**: `https://identitytoolkit.googleapis.com/v1/accounts`
- **Firestore**: `https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents`

### Collections Structure

**categories**
\`\`\`json
{
  "name": "string",
  "description": "string"
}
\`\`\`

**recipes**
\`\`\`json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "categoryId": "string",
  "imageUrl": "string",
  "ingredients": "string",
  "prepTime": "number"
}
\`\`\`

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The production-ready files will be in the `dist` folder.

## License

MIT
