import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../components/user/UserHeader';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-md flex gap-3 sm:gap-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-base sm:text-lg font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md h-fit sticky top-20">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹40.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg sm:text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">₹{(total + 40).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
