import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import CategoryManager from '../../components/admin/CategoryManager';
import RecipeManager from '../../components/admin/RecipeManager';

export default function AdminDashboard({ view = 'categories' }) {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={true} />
      <div className="container mx-auto">
        {view === 'categories' && <CategoryManager />}
        {view === 'recipes' && <RecipeManager />}
      </div>
    </div>
  );
}
