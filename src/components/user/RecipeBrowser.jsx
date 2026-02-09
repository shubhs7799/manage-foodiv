import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categoriesSlice';
import { fetchRecipes, fetchRecipesByCategory } from '../../redux/slices/recipesSlice';
import { addToCart } from '../../redux/slices/cartSlice';

export default function RecipeBrowser() {
  const dispatch = useDispatch();
  const { items: categories } = useSelector(state => state.categories);
  const { items: recipes, loading } = useSelector(state => state.recipes);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      dispatch(fetchRecipesByCategory(categoryId));
    } else {
      dispatch(fetchRecipes());
    }
  };

  const handleAddToCart = (recipe) => {
    dispatch(addToCart(recipe));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Our Menu</h1>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">{recipe.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">${recipe.price}</span>
                  <span className="text-sm text-gray-500">{recipe.prepTime} min</span>
                </div>
                <button
                  onClick={() => handleAddToCart(recipe)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No recipes found in this category.
        </div>
      )}
    </div>
  );
}
