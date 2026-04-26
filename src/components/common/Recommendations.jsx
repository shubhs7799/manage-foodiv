import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { api } from '../../services/api';
import { Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Recommendations({ recipeIds }) {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!recipeIds?.length) return;
    api.get(`/recommendations?recipeIds=${recipeIds.join(',')}`)
      .then(setItems)
      .catch(() => {});
  }, [recipeIds.join(',')]);

  if (items.length === 0) return null;

  const handleAdd = (recipe) => {
    dispatch(addToCart(recipe));
    toast.success(`${recipe.name} added!`, { icon: '🛒' });
    setItems(prev => prev.filter(r => r.id !== recipe.id));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-amber-500" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Goes great with your order</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map(recipe => (
          <div key={recipe.id} className="flex-shrink-0 w-44 bg-white rounded-xl shadow-md overflow-hidden">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-24 object-cover" />
            ) : (
              <div className="w-full h-24 bg-gradient-to-br from-orange-400 to-pink-500" />
            )}
            <div className="p-2.5">
              <h3 className="text-sm font-semibold text-gray-800 truncate">{recipe.name}</h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-bold text-green-600">₹{recipe.price}</span>
                <button
                  onClick={() => handleAdd(recipe)}
                  aria-label={`Add ${recipe.name} to cart`}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-1.5 rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
