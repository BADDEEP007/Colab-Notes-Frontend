import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/Auth';
import useAuthStore from '../store/useAuthStore';

const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return <AuthLayout initialMode="signup" />;
};

export default SignupPage;
