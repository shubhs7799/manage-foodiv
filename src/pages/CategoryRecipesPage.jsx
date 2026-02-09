import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipesByCategory } from '../redux/slices/recipesSlice';
import { addToCart } from '../redux/slices/cartSlice';
import UserHeader from '../components/user/UserHeader';
import toast from 'react-hot-toast';
import { ShoppingCart, Star } from 'lucide-react';

export default function CategoryRecipesPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: recipes, loading } = useSelector(state => state.recipes);
  const { items: categories } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchRecipesByCategory(id));
  }, [dispatch, id]);

  const handleAddToCart = (recipe) => {
    dispatch(addToCart(recipe));
    toast.success(`${recipe.name} added!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#10b981', color: '#fff' }
    });
  };

  const category = categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {category?.name || 'Recipes'}
          </h1>
          <p className="text-gray-600 text-sm">Discover amazing dishes</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                <div className="relative overflow-hidden h-40 sm:h-48">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500"></div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="font-semibold text-xs">4.5</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 line-clamp-1">{recipe.name}</h3>
                  {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      {recipe.ingredients.slice(0, 2).join(', ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{recipe.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(recipe)}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No recipes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
