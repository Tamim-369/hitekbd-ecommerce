import { useState } from 'react';
import { User, Package, Settings, Camera, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import Input from '../components/Input';
import EditProfileForm from '../components/EditProfileForm';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
  items: { name: string; quantity: number; price: number; image: string; }[];
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    newsletter: true
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

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
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'
        },
        {
          name: 'Smart Watch Series 5',
          quantity: 1,
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80'
        }
      ]
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
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSave = (data: typeof personalInfo) => {
    setPersonalInfo(data);
    setIsEditing(false);
    // Here you would typically make an API call to update the user's profile
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <EditProfileForm
                initialData={personalInfo}
                onSave={handleProfileSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mx-auto">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
                      <Camera className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-900">{personalInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{personalInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{personalInfo.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{personalInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/24</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">Default</span>
                </div>
              </div>
              <button className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
                Add Payment Method
              </button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Order History</h2>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Account Settings</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Notifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                />
                <Input
                  label="SMS Notifications"
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleSettingChange('smsNotifications')}
                />
                <Input
                  label="Two-Factor Authentication"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={() => handleSettingChange('twoFactorAuth')}
                />
                <Input
                  label="Newsletter Subscription"
                  type="checkbox"
                  checked={settings.newsletter}
                  onChange={() => handleSettingChange('newsletter')}
                />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
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
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}