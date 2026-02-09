import { Link, useLocation } from 'react-router-dom';
import { Home, Tag, Book, ClipboardList, LogOut, ChefHat } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/categories', icon: Tag, label: 'Categories' },
    { path: '/admin/recipes', icon: Book, label: 'Recipes' },
    { path: '/admin/orders', icon: ClipboardList, label: 'Orders' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">FoodHub</h1>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-all ${
              location.pathname === path 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg' 
                : 'hover:bg-slate-800'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-medium shadow-lg"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
