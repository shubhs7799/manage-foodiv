import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/ordersSlice';
import UserHeader from '../components/user/UserHeader';

export default function OrderHistoryPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserOrders(user.userId));
    }
  }, [dispatch, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Out for Delivery': return 'bg-blue-500';
      case 'Preparing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                  </div>
                  <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded text-sm`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {order.items?.map((item, index) => (
                      <li key={index} className="text-gray-600 flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.deliveryAddress && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Delivery Address:</h4>
                    <p className="text-gray-600 text-sm">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                    </p>
                    <p className="text-gray-600 text-sm">Phone: {order.deliveryAddress.phone}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders yet. Start ordering now!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
