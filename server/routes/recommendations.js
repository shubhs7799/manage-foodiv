import { Router } from 'express';
import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';

const router = Router();

// Category name → what pairs well with it (by category name)
const PAIRINGS = {
  'breakfast':  ['Drinks'],
  'lunch':      ['Drinks', 'Desserts'],
  'dinner':     ['Drinks', 'Desserts'],
  'snacks':     ['Drinks'],
  'desserts':   ['Drinks'],
  'drinks':     ['Snacks', 'Desserts'],
  'indian':     ['Drinks', 'Desserts'],
  'fast food':  ['Drinks', 'Snacks'],
};

// GET /api/recommendations?recipeIds=id1,id2
router.get('/', async (req, res) => {
  try {
    const { recipeIds } = req.query;
    if (!recipeIds) return res.json([]);

    const ids = recipeIds.split(',').filter(Boolean);
    if (ids.length === 0) return res.json([]);

    // Find categories of the given recipes
    const cartRecipes = await Recipe.find({ _id: { $in: ids } });
    const cartCategoryIds = [...new Set(cartRecipes.map(r => r.categoryId.toString()))];

    // Look up category names
    const categories = await Category.find({ _id: { $in: cartCategoryIds } });
    const categoryNames = categories.map(c => c.name.toLowerCase());

    // Collect pairing category names
    const pairingNames = new Set();
    for (const name of categoryNames) {
      const pairs = PAIRINGS[name] || ['Drinks'];
      pairs.forEach(p => pairingNames.add(p));
    }

    // Find pairing categories by name
    const pairingCategories = await Category.find({
      name: { $in: [...pairingNames] }
    });
    const pairingCategoryIds = pairingCategories.map(c => c._id);

    // Get recipes from pairing categories, excluding what's already in cart
    const recommendations = await Recipe.find({
      categoryId: { $in: pairingCategoryIds },
      _id: { $nin: ids }
    }).limit(6);

    res.json(recommendations.map(r => ({
      id: r._id, name: r.name, categoryId: r.categoryId,
      ingredients: r.ingredients, price: r.price, imageUrl: r.imageUrl
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
