import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';

// Layouts - loaded eagerly (needed immediately)
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';
import Loader from './components/common/Loader';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryRecipesPage = lazy(() => import('./pages/CategoryRecipesPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages - only loaded when admin visits
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const RecipeManager = lazy(() => import('./pages/admin/RecipeManager'));
const OrdersManager = lazy(() => import('./pages/admin/OrdersManager'));

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUpPage />} />

          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryRecipesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="recipes" element={<RecipeManager />} />
            <Route path="orders" element={<OrdersManager />} />
          </Route>

          <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
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
