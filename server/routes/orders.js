import { Router } from 'express';
import Order from '../models/Order.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

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

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order must have items' });

    const order = await Order.create({
      userId: req.user._id,
      items,
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
