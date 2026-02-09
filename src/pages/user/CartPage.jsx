import Navbar from '../../components/common/Navbar';
import Cart from '../../components/user/Cart';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto">
        <Cart />
      </div>
    </div>
  );
}
