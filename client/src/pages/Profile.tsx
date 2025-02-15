import { useState, useEffect } from 'react';
import {
  User,
  Package,
  Settings,
  Heart,
  LogOut,
} from 'lucide-react';
import EditProfileForm from '../components/EditProfileForm';
import { api } from '../utils/api';
import { STATUS } from '../enums/order';
import Orders from './profile/Orders';
import WishList from './profile/WishList';
import ProfileSettings from './profile/ProfileSettings';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  _id: string;
  date: string;
  total: number;
  amountPaid: number;
  phoneNumber: string;
  address: string;
  transactionID: string;
  status: STATUS.CANCELLED | STATUS.DELIVERED | STATUS.PENDING;
  items: { name: string; quantity: number; price: number; image: string }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice: number;
  image: string[];
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
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchOrderData();
  }, []);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      fetchWishlistData();
    }
  }, [activeTab]);

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
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const getAllOrders = await api.orders.getMyOrders();
      if (getAllOrders) {
        //@ts-ignore
        setOrders(getAllOrders);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
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
  const [orders, setOrders] = useState([]);
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
      case STATUS.DELIVERED as string:
        return 'bg-green-100 text-green-800';
      case STATUS.PENDING as string:
        return 'bg-yellow-100 text-yellow-800';
      case STATUS.CANCELLED as string:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const fetchWishlistData = async () => {
    try {
      setWishlistLoading(true);
      const products: any = await api.wishlist.get();
      setWishlistItems(products);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };
  const { logout } = useAuth()
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h2>
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
        return <Orders
          loading={loading}
          error={error}
          orders={orders}
          getStatusColor={getStatusColor}
        />

      case 'wishlist':
        return <WishList wishlistLoading={wishlistLoading} wishlistItems={wishlistItems} />


      case 'settings':
        return (
          <ProfileSettings
            handlePasswordSubmit={handlePasswordSubmit}
            passwordError={passwordError}
            passwordSuccess={passwordSuccess}
            passwords={passwords}
            handlePasswordChange={handlePasswordChange}
            isChangingPassword={isChangingPassword}
          />
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'profile'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'orders'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'wishlist'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'settings'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <LogOut size={20} />
                  Logout
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
