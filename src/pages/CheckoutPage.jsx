import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import UserHeader from '../components/user/UserHeader';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createOrder({
        userId: user.userId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        deliveryAddress: address
      })).unwrap();

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-history');
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
