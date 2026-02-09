import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/ordersSlice';
import toast from 'react-hot-toast';

export default function OrdersManager() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('Order status updated!');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-indigo-600 font-semibold mb-2">Order #{order.id}</h3>
                  <p className="text-gray-600">
                    {order.items?.length || 0} items | Total: ₹{order.totalAmount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded text-sm`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-700 mb-1">Delivery Address:</p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                  </p>
                  <p className="text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Ordered on {formatDate(order.orderDate)}
              </p>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">No orders yet</div>
          )}
        </div>
      )}
    </div>
  );
}
