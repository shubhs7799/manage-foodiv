import Navbar from '../../components/common/Navbar';
import RecipeBrowser from '../../components/user/RecipeBrowser';

export default function UserHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto">
        <RecipeBrowser />
      </div>
    </div>
  );
}
