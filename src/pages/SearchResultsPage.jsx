import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import RecipeCard from '../components/common/RecipeCard';

export default function SearchResultsPage() {
  const { searchResults } = useSelector(state => state.recipes);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
          Search Results
        </h1>
        <p className="text-gray-600 text-sm">{searchResults.length} items found</p>
      </div>

      {searchResults.length === 0 ? (
        <EmptyState icon={Search} title="No recipes found" subtitle="Try searching with different keywords" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
