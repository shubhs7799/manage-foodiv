import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', phone: '' });

  const handleChange = (field) => (e) => setAddress(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(createOrder({
        items: items.map(item => ({ recipeId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        totalAmount: total,
        deliveryAddress: address
      })).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-history');
    } catch (err) {
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <EmptyState icon={ShoppingBag} title="Your cart is empty" subtitle="Add items before checkout" />;
  }

  const inputClass = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition";

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Street Address</label>
              <input type="text" value={address.street} onChange={handleChange('street')} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">City</label>
                <input type="text" value={address.city} onChange={handleChange('city')} className={inputClass} required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">State</label>
                <input type="text" value={address.state} onChange={handleChange('state')} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Zip Code</label>
                <input type="text" value={address.zip} onChange={handleChange('zip')} className={inputClass} required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Phone</label>
                <input type="tel" value={address.phone} onChange={handleChange('phone')} className={inputClass} required />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 font-semibold disabled:opacity-50 transition"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
