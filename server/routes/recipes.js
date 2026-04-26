import { Router } from 'express';
import { body } from 'express-validator';
import { getAll, getById, create, update, remove } from '../controllers/recipeController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, adminOnly, [
  body('name').trim().notEmpty().withMessage('Recipe name is required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Valid price is required')
], create);
router.put('/:id', auth, adminOnly, update);
router.delete('/:id', auth, adminOnly, remove);

export default router;
