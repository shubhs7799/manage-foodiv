import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecipeCard({ recipe }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(recipe));
    toast.success(`${recipe.name} added to cart!`, { icon: '🛒' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
      <div className="relative overflow-hidden h-40 sm:h-48">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500" />
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 line-clamp-1">{recipe.name}</h3>
        {recipe.ingredients?.length > 0 && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{recipe.ingredients.slice(0, 2).join(', ')}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl sm:text-2xl font-bold text-green-600">₹{recipe.price}</span>
        </div>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${recipe.name} to cart`}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition font-medium text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
