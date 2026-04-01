import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Category from '../models/Category.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories.map(c => ({ id: c._id, name: c.name, imageUrl: c.imageUrl, createdAt: c.createdAt })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories (admin)
router.post('/', auth, adminOnly, [
  body('name').trim().notEmpty().withMessage('Category name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const category = await Category.create({ name: req.body.name, imageUrl: req.body.imageUrl || '' });
    res.status(201).json({ id: category._id, name: category.name, imageUrl: category.imageUrl, createdAt: category.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, imageUrl: req.body.imageUrl || '' },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ id: category._id, name: category.name, imageUrl: category.imageUrl, createdAt: category.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
