import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('resetToken');
    if (!token) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    const token = localStorage.getItem('resetToken');
    if (!token) {
      showError('Invalid reset token. Please try again');
      navigate('/forgot-password');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      showSuccess('Password has been reset successfully');
      // Clear reset-related items from localStorage
      localStorage.removeItem('resetToken');
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (error: any) {
      if (error.errorMessages?.length > 0) {
        error.errorMessages.forEach((err: { message: string }) => {
          showError(err.message);
        });
      } else {
        showError(error.message || 'Failed to reset password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle={
        <>
          Remember your password?{' '}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >

          </a>
        </>
      }
    >
      <div className="mt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            required
            value={formData.newPassword}
            onChange={e =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            placeholder="Enter new password"
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={e =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="Confirm new password"
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 button-gradient ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Need help?{' '}
            <a
              href="/contact"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact Support
            </a>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}
