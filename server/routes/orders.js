import { Router } from 'express';
import Order from '../models/Order.js';
import Recipe from '../models/Recipe.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

const DELIVERY_FEE = 40;

// GET /api/orders - admin gets all, user gets own
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json(orders.map(o => ({
      id: o._id, userId: o.userId, items: o.items, totalAmount: o.totalAmount,
      deliveryAddress: o.deliveryAddress, status: o.status, orderDate: o.orderDate
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders - validate prices server-side
router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order must have items' });

    const recipeIds = items.map(i => i.recipeId);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    const priceMap = Object.fromEntries(recipes.map(r => [r._id.toString(), r.price]));

    // Validate all items exist and compute real total
    for (const item of items) {
      if (!priceMap[item.recipeId]) {
        return res.status(400).json({ message: `Recipe ${item.recipeId} not found` });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
    }

    const serverItems = items.map(i => ({
      recipeId: i.recipeId,
      name: i.name,
      price: priceMap[i.recipeId],
      quantity: i.quantity
    }));
    const subtotal = serverItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalAmount = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      userId: req.user._id,
      items: serverItems,
      totalAmount,
      deliveryAddress
    });

    res.status(201).json({
      id: order._id, userId: order.userId, items: order.items, totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress, status: order.status, orderDate: order.orderDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({
      id: order._id, userId: order.userId, items: order.items, totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress, status: order.status, orderDate: order.orderDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
