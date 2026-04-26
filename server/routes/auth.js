import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.get('/me', auth, getMe);

export default router;
