import { useState, useEffect } from 'react';
import {
  User,
  Package,
  Settings,
  Camera,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Input from '../components/Input';
import EditProfileForm from '../components/EditProfileForm';
import { api } from '../utils/api';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
  items: { name: string; quantity: number; price: number; image: string }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.user.getProfile();
      if (response) {
        setPersonalInfo(response);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (data: Omit<UserProfile, 'id'>) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await api.user.updateProfile(formData);
      await fetchUserProfile(); // Refresh the profile data
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    newsletter: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous error/success messages when user starts typing
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsChangingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      await api.auth.changePassword(
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmPassword
      );

      setPasswordSuccess('Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const orders: Order[] = [
    {
      id: '#ORD-2024-001',
      date: '2024-03-15',
      total: 499.98,
      status: 'delivered',
      items: [
        {
          name: 'Premium Wireless Headphones',
          quantity: 1,
          price: 299.99,
          image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
        },
        {
          name: 'Smart Watch Series 5',
          quantity: 1,
          price: 199.99,
          image:
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: '#ORD-2024-002',
      date: '2024-03-10',
      total: 89.99,
      status: 'processing',
      items: [
        {
          name: 'Designer Backpack',
          quantity: 1,
          price: 89.99,
          image:
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
        },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h2>
              {!isEditing && !loading && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : (
              <EditProfileForm
                initialData={personalInfo}
                onSave={handleProfileSave}
              />
            )}
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Order History
              </h2>
              <div className="space-y-6">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ordered on {order.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-900">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Account Settings
            </h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Password
                </h3>
                {passwordError && (
                  <div className="text-red-600 mb-4">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="text-green-600 mb-4">{passwordSuccess}</div>
                )}
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                  >
                    {isChangingPassword
                      ? 'Changing Password...'
                      : 'Change Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'orders'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'settings'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </nav>
            </div>
          </div>
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
