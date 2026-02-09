import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import CategoryRecipesPage from './pages/CategoryRecipesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import CategoryManager from './components/admin/CategoryManager';
import RecipeManager from './components/admin/RecipeManager';
import OrdersManager from './components/admin/OrdersManager';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/home'} /> : <LoginPage />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/home" /> : <SignUpPage />
          } />

          {/* User Routes */}
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/category/:id" element={isAuthenticated ? <CategoryRecipesPage /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isAuthenticated ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} />
          <Route path="/order-history" element={isAuthenticated ? <OrderHistoryPage /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><CategoryManager /></AdminLayout>} />
          <Route path="/admin/recipes" element={<AdminLayout><RecipeManager /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><OrdersManager /></AdminLayout>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

          {/* Default */}
          <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/home') : '/signup'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
