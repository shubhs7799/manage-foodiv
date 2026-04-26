import { validationResult } from 'express-validator';
import Category from '../models/Category.js';

const format = (c) => ({ id: c._id, name: c.name, imageUrl: c.imageUrl, createdAt: c.createdAt });

export const getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories.map(format));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    const category = await Category.create({ name: req.body.name, imageUrl: req.body.imageUrl || '' });
    res.status(201).json(format(category));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, { name: req.body.name, imageUrl: req.body.imageUrl || '' }, { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(format(category));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
