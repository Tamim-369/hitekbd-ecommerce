import { useState } from 'react';
import { Save, User, Globe, Bell } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  newProducts: boolean;
  marketing: boolean;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const { showSuccess, showError } = useToast();
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'ShopHub',
    siteDescription: 'Your one-stop shop for premium products',
    contactEmail: 'contact@shophub.com',
    supportPhone: '+1234567890',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderUpdates: true,
    newProducts: false,
    marketing: false,
  });

  const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update site settings
      showSuccess('Site settings updated successfully');
    } catch (error) {
      showError('Failed to update site settings');
    }
  };

  const handleNotificationSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update notification settings
      showSuccess('Notification settings updated successfully');
    } catch (error) {
      showError('Failed to update notification settings');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Settings Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-1 ${
            activeTab === 'general'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <span>General</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-2 px-1 ${
            activeTab === 'notifications'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <span>Notifications</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-1 ${
            activeTab === 'profile'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={20} />
            <span>Profile</span>
          </div>
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'general' && (
          <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, siteName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site Description
              </label>
              <textarea
                value={siteSettings.siteDescription}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    siteDescription: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      contactEmail: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Support Phone
                </label>
                <input
                  type="tel"
                  value={siteSettings.supportPhone}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      supportPhone: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="button-gradient px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Updates
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get notified when order status changes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderUpdates}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        orderUpdates: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    New Products
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications for new product additions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newProducts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newProducts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="button-gradient px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto">
            {/* Profile content will be added here */}
            <p className="text-gray-500 text-center">Profile settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
} 