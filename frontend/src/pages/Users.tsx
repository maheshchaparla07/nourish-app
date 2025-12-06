import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getAllUsers, User } from '../api/auth';

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-nourish-gray-900 mb-2">
              Registered Users
            </h1>
            <p className="text-nourish-gray-600">
              View all registered user accounts
            </p>
          </div>

          {/* Stats Card */}
          <div className="mb-6">
            <div className="card bg-gradient-to-r from-nourish-50 to-nourish-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nourish-gray-600 mb-1">Total Registered Users</p>
                  <p className="text-3xl font-bold text-nourish-gray-900">{users.length}</p>
                </div>
                <div className="p-4 bg-nourish-500 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="card text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nourish-500 mx-auto mb-4"></div>
              <p className="text-nourish-gray-600">Loading users...</p>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-nourish-gray-200">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">#</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">Name</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">User ID</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">Registered Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-nourish-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-nourish-gray-500">
                          No users registered yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr
                          key={user.id}
                          className="border-b border-nourish-gray-100 hover:bg-nourish-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 text-sm text-nourish-gray-600">{index + 1}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-nourish-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-nourish-gray-900">
                                {user.name || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-nourish-gray-700">{user.email}</td>
                          <td className="py-4 px-6 text-sm text-nourish-gray-500 font-mono text-xs">
                            {user.id.substring(0, 8)}...
                          </td>
                          <td className="py-4 px-6 text-sm text-nourish-gray-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Refresh Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={fetchUsers}
                  className="btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


