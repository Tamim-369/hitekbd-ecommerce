import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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

  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/profile" />
  }
  return (
    <AuthLayout
      title="Log In to your account"
      subtitle={
        <>
          Don't have an account?{' '}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Create Account
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
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={e =>
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
              className={`w-full flex justify-center items-center py-2 px-4  rounded-xl font-semibold text-white bg-gradient-to-r from-[#37c3fa] to-[#c937fb] shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#37c3fa] focus:ring-opacity-50 disabled:from-gray-400 disabled:to-gray-500  disabled:cursor-not-allowed disabled:hover:translate-y-0  disabled:hover:shadow-lg disabled:opacity-70`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
