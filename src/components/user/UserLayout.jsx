import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserHeader from './UserHeader';

export default function UserLayout() {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <UserHeader />
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
