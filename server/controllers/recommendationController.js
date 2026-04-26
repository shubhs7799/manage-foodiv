import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';

const PAIRINGS = {
  'breakfast': ['Drinks'], 'lunch': ['Drinks', 'Desserts'], 'dinner': ['Drinks', 'Desserts'],
  'snacks': ['Drinks'], 'desserts': ['Drinks'], 'drinks': ['Snacks', 'Desserts'],
  'indian': ['Drinks', 'Desserts'], 'fast food': ['Drinks', 'Snacks'],
};

export const getRecommendations = async (req, res) => {
  try {
    const ids = (req.query.recipeIds || '').split(',').filter(Boolean);
    if (!ids.length) return res.json([]);

    const cartRecipes = await Recipe.find({ _id: { $in: ids } });
    const catIds = [...new Set(cartRecipes.map(r => r.categoryId.toString()))];
    const categories = await Category.find({ _id: { $in: catIds } });

    const pairingNames = new Set();
    categories.forEach(c => (PAIRINGS[c.name.toLowerCase()] || ['Drinks']).forEach(p => pairingNames.add(p)));

    const pairingCats = await Category.find({ name: { $in: [...pairingNames] } });
    const recipes = await Recipe.find({ categoryId: { $in: pairingCats.map(c => c._id) }, _id: { $nin: ids } }).limit(6);

    res.json(recipes.map(r => ({ id: r._id, name: r.name, categoryId: r.categoryId, ingredients: r.ingredients, price: r.price, imageUrl: r.imageUrl })));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
