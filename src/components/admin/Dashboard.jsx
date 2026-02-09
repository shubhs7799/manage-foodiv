import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categoriesSlice';
import { fetchRecipes } from '../../redux/slices/recipesSlice';
import { fetchOrders } from '../../redux/slices/ordersSlice';
import { Tag, Book, ClipboardList, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: categories } = useSelector(state => state.categories);
  const { items: recipes } = useSelector(state => state.recipes);
  const { items: orders } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipes());
    dispatch(fetchOrders());
  }, [dispatch]);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const stats = [
    { icon: Tag, label: 'Categories', count: categories.length, link: '/admin/categories', color: 'bg-blue-500' },
    { icon: Book, label: 'Recipes', count: recipes.length, link: '/admin/recipes', color: 'bg-green-500' },
    { icon: ClipboardList, label: 'Total Orders', count: orders.length, link: '/admin/orders', color: 'bg-purple-500' },
    { icon: Clock, label: 'Pending Orders', count: pendingOrders, link: '/admin/orders', color: 'bg-orange-500' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, count, link, color }) => (
          <div key={label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className="text-3xl font-bold">{count}</span>
            </div>
            <h3 className="text-gray-600 mb-2">{label}</h3>
            <Link to={link} className="text-indigo-600 hover:underline text-sm">
              View all →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
