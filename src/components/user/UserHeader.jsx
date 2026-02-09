import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Search, UtensilsCrossed, Menu } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { searchRecipes, clearSearch } from '../../redux/slices/recipesSlice';
import { useState } from 'react';

export default function UserHeader() {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchRecipes(searchQuery));
      navigate('/search');
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      dispatch(clearSearch());
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-lg z-40 border-b-2 border-orange-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
              <UtensilsCrossed className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
              FoodHub
            </span>
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative">
              <div className="bg-orange-100 p-2 rounded-full hover:bg-orange-200 transition">
                <ShoppingCart size={20} className="text-orange-600" />
              </div>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <User size={16} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {user?.name || user?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition"
            >
              <LogOut size={18} className="text-red-600" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </form>
            <Link to="/cart" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Cart</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{items.length} items</span>
                <ShoppingCart size={20} className="text-orange-600" />
              </div>
            </Link>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium truncate">{user?.name || user?.email}</span>
              <User size={20} className="text-gray-700" />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-100 text-red-600 rounded-lg font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
