import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatUser = (user) => ({ userId: user._id, name: user.name, email: user.email, role: user.role });

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ message: errors.array()[0].msg }); return false; }
  return true;
};

export const signup = async (req, res) => {
  try {
    if (!validate(req, res)) return;
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user), user: formatUser(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const login = async (req, res) => {
  try {
    if (!validate(req, res)) return;
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user), user: formatUser(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getMe = (req, res) => res.json({ user: formatUser(req.user) });
