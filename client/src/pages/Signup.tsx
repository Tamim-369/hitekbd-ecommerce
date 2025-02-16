import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      showSuccess('Account created successfully.');
      navigate('/');
    } catch (error: any) {
      showError(error?.message || 'Failed to create account');
    }
  };

  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/profile" />
  }
  return (
    <div className="mt-2">
      <AuthLayout
        title="Create your account"
        subtitle={
          <>
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </a>
          </>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email address"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Phone Number"
            type="text"
            name="phone"
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Address"
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={e =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={e =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Input
            label="Confirm password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={e =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create account
            </button>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
