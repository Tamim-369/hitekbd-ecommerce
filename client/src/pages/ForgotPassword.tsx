import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      localStorage.setItem('resetEmail', email);
      showSuccess('Verification code sent to your email');
      navigate('/verify-email');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.errorMessages?.length > 0) {
        error.errorMessages.forEach((err: { message: string }) => {
          showError(err.message);
        });
      } else {
        showError(error.message || 'Failed to send verification code');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={
        <>
          Remember your password?{' '}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </>
      }
    >
      <div className="mt-8 space-y-6">
        <div className="rounded-md">
          <p className="text-sm text-gray-600 mb-4">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 button-gradient ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
