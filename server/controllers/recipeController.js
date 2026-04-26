import { validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';

const format = (r) => ({
  id: r._id, name: r.name, categoryId: r.categoryId, ingredients: r.ingredients,
  price: r.price, imageUrl: r.imageUrl, createdAt: r.createdAt,
});

export const getAll = async (req, res) => {
  try {
    const filter = req.query.categoryId ? { categoryId: req.query.categoryId } : {};
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes.map(format));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(format(recipe));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    const { name, categoryId, ingredients, price, imageUrl } = req.body;
    const recipe = await Recipe.create({ name, categoryId, ingredients: ingredients || [], price, imageUrl: imageUrl || '' });
    res.status(201).json(format(recipe));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const { name, categoryId, ingredients, price, imageUrl } = req.body;
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id, { name, categoryId, ingredients: ingredients || [], price, imageUrl: imageUrl || '' }, { new: true, runValidators: true }
    );
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(format(recipe));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
