import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signUp({ email, password, name })).unwrap();
      toast.success('Account created successfully!');
      navigate('/home');
    } catch (err) {
      const errorMessage = err?.message || err || 'Sign up failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us today!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 font-semibold text-lg shadow-lg transition"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Already have an account?</p>
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
