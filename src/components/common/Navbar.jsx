import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar({ isAdmin = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="text-2xl font-bold">
          {isAdmin ? 'Admin Panel' : 'FooDiv'}
        </Link>

        <div className="flex items-center gap-6">
          {isAdmin ? (
            <>
              <Link to="/admin/categories" className="hover:text-blue-200">Categories</Link>
              <Link to="/admin/recipes" className="hover:text-blue-200">Recipes</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-blue-200">Menu</Link>
              <Link to="/cart" className="hover:text-blue-200 relative">
                Cart
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {items.length}
                  </span>
                )}
              </Link>
            </>
          )}
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
