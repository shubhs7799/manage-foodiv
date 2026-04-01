import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/recipes
router.get('/', async (req, res) => {
  try {
    const filter = req.query.categoryId ? { categoryId: req.query.categoryId } : {};
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes.map(r => ({
      id: r._id, name: r.name, categoryId: r.categoryId, ingredients: r.ingredients,
      price: r.price, imageUrl: r.imageUrl, createdAt: r.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({
      id: recipe._id, name: recipe.name, categoryId: recipe.categoryId,
      ingredients: recipe.ingredients, price: recipe.price, imageUrl: recipe.imageUrl, createdAt: recipe.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes (admin)
router.post('/', auth, adminOnly, [
  body('name').trim().notEmpty().withMessage('Recipe name is required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Valid price is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { name, categoryId, ingredients, price, imageUrl } = req.body;
    const recipe = await Recipe.create({ name, categoryId, ingredients: ingredients || [], price, imageUrl: imageUrl || '' });
    res.status(201).json({
      id: recipe._id, name: recipe.name, categoryId: recipe.categoryId,
      ingredients: recipe.ingredients, price: recipe.price, imageUrl: recipe.imageUrl, createdAt: recipe.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/recipes/:id (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, categoryId, ingredients, price, imageUrl } = req.body;
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, categoryId, ingredients: ingredients || [], price, imageUrl: imageUrl || '' },
      { new: true, runValidators: true }
    );
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({
      id: recipe._id, name: recipe.name, categoryId: recipe.categoryId,
      ingredients: recipe.ingredients, price: recipe.price, imageUrl: recipe.imageUrl, createdAt: recipe.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/recipes/:id (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
