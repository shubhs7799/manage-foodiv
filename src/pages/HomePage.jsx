import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ChefHat className="text-orange-600" size={32} />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Food Categories
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">Choose your favorite cuisine</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          to="/order-history"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 font-medium text-sm shadow-lg"
        >
          📦 Orders
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <EmptyState icon={ChefHat} title="No categories available" subtitle="Check back later!" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative overflow-hidden aspect-square">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <ChefHat className="text-white" size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm sm:text-base">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
