import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Edit2, Trash2, UserPlus } from 'lucide-react';
import { UserWithStats } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import UserModal from '../../components/admin/UserModal';
import { DashboardSkeleton } from '../../components/admin/DashboardSkeleton';
import { api } from '../../utils/api';
import { ImageURL } from '../../data/baseApi';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllUsers();
      console.log('Loaded users:', data); // Debug log
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error); // Debug log
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await api.admin.updateUserStatus(userId, newStatus);
      showSuccess('User status updated successfully');
      fetchUsers();
    } catch (error) {
      showError('Failed to update user status');
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await api.admin.deleteUser(selectedUser.id);
      showSuccess('User deleted successfully');
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="button-gradient px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user:any) => (
              <tr key={user._id} className={`${user?.role === 'ADMIN' && 'hidden'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`${ImageURL}/${user?.profile}`}
                        alt={user.name}
                      />
                    </div> */}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{user.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.totalOrders} orders
                  </div>
                  <div className="text-sm text-gray-500">
                    ৳{user.totalSpent.toFixed(2)} spent
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-900"
                    disabled={user.role === 'ADMIN'}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchUsers();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
} 