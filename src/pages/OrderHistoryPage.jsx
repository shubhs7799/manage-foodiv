import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/ordersSlice';
import { Package } from 'lucide-react';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { STATUS_COLORS } from '../constants';
import { formatDate } from '../utils';

export default function OrderHistoryPage() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return <EmptyState icon={Package} title="No orders yet" subtitle="Start ordering now!" />;
  }

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Order #{order.id?.slice(-6)}</h3>
                <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
              </div>
              <span className={`${STATUS_COLORS[order.status] || 'bg-gray-500'} text-white px-3 py-1 rounded text-sm`}>
                {order.status}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Items:</h4>
              <ul className="space-y-1">
                {order.items?.map((item, i) => (
                  <li key={i} className="text-gray-600 text-sm flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {order.deliveryAddress && (
              <div className="mb-4 text-sm text-gray-600">
                <h4 className="font-semibold text-gray-700 mb-1">Delivery:</h4>
                <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}</p>
                <p>Phone: {order.deliveryAddress.phone}</p>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
