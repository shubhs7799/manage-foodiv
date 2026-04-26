import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipesByCategory } from '../redux/slices/recipesSlice';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import { ShoppingCart } from 'lucide-react';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import RecipeCard from '../components/common/RecipeCard';

export default function CategoryRecipesPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { categoryItems, loading } = useSelector(state => state.recipes);
  const { items: categories } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchRecipesByCategory(id));
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, id, categories.length]);

  const category = categories.find(c => c.id === id);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
          {category?.name || 'Recipes'}
        </h1>
        <p className="text-gray-600 text-sm">Discover amazing dishes</p>
      </div>

      {loading ? (
        <Loader />
      ) : categoryItems.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No recipes found" subtitle="This category is empty" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryItems.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
