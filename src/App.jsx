import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// User Pages
import HomePage from './pages/HomePage';
import CategoryRecipesPage from './pages/CategoryRecipesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SearchResultsPage from './pages/SearchResultsPage';

// Admin Pages
import Dashboard from './components/admin/Dashboard';
import CategoryManager from './components/admin/CategoryManager';
import RecipeManager from './components/admin/RecipeManager';
import OrdersManager from './components/admin/OrdersManager';

// Common
import NotFoundPage from './pages/NotFoundPage';
import Loader from './components/common/Loader';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loader while checking auth on first load
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Starting up..." />
      </div>
    );
  }

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/signup';
    return user?.role === 'admin' ? '/admin/dashboard' : '/home';
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUpPage />} />

        {/* User Routes - wrapped in UserLayout */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryRecipesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Route>

        {/* Admin Routes - wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="recipes" element={<RecipeManager />} />
          <Route path="orders" element={<OrdersManager />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
