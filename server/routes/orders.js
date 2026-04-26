import { Router } from 'express';
import { getAll, create, updateStatus } from '../controllers/orderController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getAll);
router.post('/', auth, create);
router.patch('/:id/status', auth, adminOnly, updateStatus);

export default router;
