import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
