import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, addRecipe, updateRecipe, deleteRecipe } from '../../redux/slices/recipesSlice';
import { fetchCategories } from '../../redux/slices/categoriesSlice';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function RecipeManager() {
  const dispatch = useDispatch();
  const { items: recipes, loading } = useSelector(state => state.recipes);
  const { items: categories } = useSelector(state => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    ingredients: ['']
  });

  useEffect(() => {
    dispatch(fetchRecipes());
    dispatch(fetchCategories());
  }, [dispatch]);

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredIngredients = formData.ingredients.filter(i => i.trim());
    
    try {
      if (editingRecipe) {
        await dispatch(updateRecipe({ 
          id: editingRecipe.id, 
          ...formData,
          ingredients: filteredIngredients,
          price: parseFloat(formData.price)
        })).unwrap();
        toast.success('Recipe updated!');
      } else {
        await dispatch(addRecipe({ 
          ...formData, 
          ingredients: filteredIngredients,
          price: parseFloat(formData.price)
        })).unwrap();
        toast.success('Recipe added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({ name: '', categoryId: '', price: '', imageUrl: '', ingredients: [''] });
    setEditingRecipe(null);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [''];
    setFormData({
      name: recipe.name,
      categoryId: recipe.categoryId,
      price: recipe.price.toString(),
      imageUrl: recipe.imageUrl || '',
      ingredients: ingredients.length > 0 ? ingredients : ['']
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await dispatch(deleteRecipe(id)).unwrap();
        toast.success('Recipe deleted!');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recipes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Recipe
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-lg shadow overflow-hidden">
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{getCategoryName(recipe.categoryId)}</p>
                <p className="text-lg font-bold text-green-600 mb-2">₹{recipe.price}</p>
                {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1">Ingredients:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {recipe.ingredients.slice(0, 3).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                      {recipe.ingredients.length > 3 && <li>...</li>}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
          <div className="bg-white p-6 rounded-lg w-96 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingRecipe ? 'Edit Recipe' : 'Add Recipe'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Recipe Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ingredients</label>
                {formData.ingredients.map((ing, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Ingredient ${index + 1}`}
                    value={ing}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
                <button
                  type="button"
                  onClick={addIngredientField}
                  className="text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={16} /> Add Ingredient
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  {editingRecipe ? 'Update' : 'Add Recipe'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
