import { Router } from 'express';
import { body } from 'express-validator';
import { getAll, create, update, remove } from '../controllers/categoryController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.post('/', auth, adminOnly, [body('name').trim().notEmpty().withMessage('Category name is required')], create);
router.put('/:id', auth, adminOnly, update);
router.delete('/:id', auth, adminOnly, remove);

export default router;
