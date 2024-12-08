import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      showError('Email not found. Please try again');
      navigate('/forgot-password');
      return;
    }

    if (!code || code.length !== 4) {
      showError('Please enter a valid 4-digit code');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await verifyEmail(email, parseInt(code));
      localStorage.setItem('resetToken', token);
      showSuccess('Email verified successfully');
      navigate('/reset-password');
    } catch (error: any) {
      if (error.errorMessages?.length > 0) {
        error.errorMessages.forEach((err: { message: string }) => {
          showError(err.message);
        });
      } else {
        showError(error.message || 'Failed to verify email');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the verification code sent to your email"
    >
      <div className="mt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            required
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter 4-digit code"
            pattern="[0-9]{4}"
            maxLength={4}
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 button-gradient ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
