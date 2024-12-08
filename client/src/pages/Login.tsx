import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      showSuccess('Login successful');
      navigate('/');
    } catch (error: any) {
      if (error.errorMessages?.length > 0) {
        error.errorMessages.forEach((err: { message: string }) => {
          showError(err.message);
        });
      } else {
        showError(error.message || 'Failed to login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={
        <>
          Don't have an account?{' '}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </>
      }
    >
      <div className="mt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
            />
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 button-gradient ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
