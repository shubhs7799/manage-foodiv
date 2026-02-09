import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthForm from '../../components/common/AuthForm';

export default function AdminLogin() {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return <AuthForm isAdmin={true} />;
}
