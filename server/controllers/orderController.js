import Order from '../models/Order.js';
import Recipe from '../models/Recipe.js';

const DELIVERY_FEE = 40;

const format = (o) => ({
  id: o._id, userId: o.userId, items: o.items, totalAmount: o.totalAmount,
  deliveryAddress: o.deliveryAddress, status: o.status, orderDate: o.orderDate,
});

export const getAll = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json(orders.map(format));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order must have items' });

    const recipes = await Recipe.find({ _id: { $in: items.map(i => i.recipeId) } });
    const priceMap = Object.fromEntries(recipes.map(r => [r._id.toString(), r.price]));

    for (const item of items) {
      if (!priceMap[item.recipeId]) return res.status(400).json({ message: `Recipe ${item.recipeId} not found` });
      if (!item.quantity || item.quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });
    }

    const serverItems = items.map(i => ({ recipeId: i.recipeId, name: i.name, price: priceMap[i.recipeId], quantity: i.quantity }));
    const totalAmount = serverItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + DELIVERY_FEE;

    const order = await Order.create({ userId: req.user._id, items: serverItems, totalAmount, deliveryAddress });
    res.status(201).json(format(order));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(format(order));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
