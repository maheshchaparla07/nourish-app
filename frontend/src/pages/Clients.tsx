import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getAllClients, Client } from '../api/clients';

export default function Clients() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [lastViewed, setLastViewed] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, [filterType, searchQuery]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllClients(
        filterType === 'all' ? undefined : filterType,
        searchQuery || undefined
      );
      setClients(response.clients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setLastViewed(client);
  };

  const getClientName = (client: Client): string => {
    const parts = [client.forename, client.middle_name, client.surname].filter(Boolean);
    return parts.join(' ') || 'Unnamed Client';
  };

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="flex">
          {/* Left Sidebar - Client List */}
          <div className="w-80 bg-white border-r border-nourish-gray-200 flex flex-col h-screen fixed left-64">
            {/* Add New Client Button */}
            <div className="p-4 border-b border-nourish-gray-200">
              <button 
                onClick={() => navigate('/clients/new')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add new client</span>
              </button>
            </div>

            {/* Last Viewed Section */}
            {lastViewed ? (
              <div className="p-4 border-b border-nourish-gray-200 bg-nourish-gray-50">
                <h3 className="text-xs font-semibold text-nourish-gray-500 uppercase mb-2">Last Viewed</h3>
                <button
                  onClick={() => handleClientSelect(lastViewed)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedClient?.id === lastViewed.id
                      ? 'bg-nourish-100 text-nourish-700 font-medium'
                      : 'hover:bg-nourish-gray-100 text-nourish-gray-700'
                  }`}
                >
                  {lastViewed.name}
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-nourish-gray-200 bg-nourish-gray-50">
                <h3 className="text-xs font-semibold text-nourish-gray-500 uppercase mb-2">Last Viewed</h3>
                <p className="text-sm text-nourish-gray-500">No user views recorded.</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="p-4 border-b border-nourish-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="search clients"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchClients();
                    }
                  }}
                  className="w-full px-4 py-2 pl-10 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                />
                <svg
                  className="w-5 h-5 text-nourish-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="px-4 pb-4 border-b border-nourish-gray-200">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500 bg-white"
              >
                <option value="all">- Client</option>
                <option value="active">- Active</option>
                <option value="inactive">- Inactive</option>
              </select>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {loading ? (
                  <div className="text-center py-8 text-nourish-gray-500 text-sm">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500 text-sm">
                    {error}
                  </div>
                ) : clients.length === 0 ? (
                  <div className="text-center py-8 text-nourish-gray-500 text-sm">
                    No clients found
                  </div>
                ) : (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 flex items-center gap-2 ${
                        selectedClient?.id === client.id
                          ? 'bg-nourish-100 text-nourish-700 font-medium'
                          : 'hover:bg-nourish-gray-100 text-nourish-gray-700'
                      }`}
                    >
                      <span className="flex-1 truncate">{getClientName(client)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-80">
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-nourish-gray-900 mb-2">
                  Clients
                </h1>
                <p className="text-nourish-gray-600">
                  Manage and view client information
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Appointment Stats */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Appointment Stats</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">This week</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>Hours: 960h, 55m</p>
                        <p>Appointments: 318</p>
                        <p>Active clients: 180</p>
                      </div>
                    </div>
                    <div className="border-t border-nourish-gray-200 pt-4">
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last week</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>Hours: 733h, 50m</p>
                        <p>Appointments: 236</p>
                        <p>Active clients: 124</p>
                      </div>
                    </div>
                    <div className="border-t border-nourish-gray-200 pt-4">
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last month</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>Hours: 3536h, 30m</p>
                        <p>Appointments: 1153</p>
                        <p>Active clients: 189</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Summary */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Checklist summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">5 Expired / Required</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>Medication form: 411 clients</p>
                        <p>Referral Form: 357 clients</p>
                        <p>Registration Form: 270 clients</p>
                        <p>SLA: 342 clients</p>
                        <p>Turn 18: 421 clients</p>
                      </div>
                    </div>
                    <div className="border-t border-nourish-gray-200 pt-4">
                      <p className="text-sm font-medium text-orange-600 mb-2">4 Expiring within 1 month</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>Medication form: 3 clients</p>
                        <p>Referral Form: 2 clients</p>
                        <p>Registration Form: 3 clients</p>
                        <p>SLA: 6 clients</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diary Summary */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-nourish-gray-900">Diary summary</h2>
                    <a href="#" className="text-sm text-nourish-600 hover:text-nourish-700 font-medium">View all</a>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">This Week</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>1 Update on progress</p>
                        <p>14 Handover note generated via Mobile App</p>
                        <p>1 Understanding me</p>
                      </div>
                    </div>
                    <div className="border-t border-nourish-gray-200 pt-4">
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last Week</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>44 Handover note generated via Mobile App</p>
                        <p>2 Post</p>
                        <p>2 Phone</p>
                        <p>6 Update on progress</p>
                        <p>6 Understanding me</p>
                        <p>1 Finance</p>
                        <p>3 Email</p>
                        <p>1 Text</p>
                      </div>
                    </div>
                    <div className="border-t border-nourish-gray-200 pt-4">
                      <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last Month</p>
                      <div className="space-y-1 text-sm text-nourish-gray-600">
                        <p>196 Handover note generated via Mobile App</p>
                        <p>2 Post</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Diary Cases */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Open diary cases</h2>
                  <div className="text-center py-8 text-nourish-gray-500 text-sm">
                    No open cases
                  </div>
                </div>
              </div>

              {/* Medication Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Medication Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-nourish-gray-700 mb-2">This week</p>
                    <p className="text-sm text-nourish-gray-600">No outcomes submitted</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last week</p>
                    <p className="text-sm text-nourish-gray-600">No outcomes submitted</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nourish-gray-700 mb-2">Last month</p>
                    <p className="text-sm text-nourish-gray-600">No outcomes submitted</p>
                  </div>
                </div>
              </div>

              {/* Selected Client Details */}
              {selectedClient && (
                <div className="card mt-6">
                  <h2 className="text-2xl font-semibold text-nourish-gray-900 mb-4">
                    {selectedClient.name}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-nourish-gray-600 mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedClient.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedClient.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-nourish-gray-600">
                      Select a client from the left sidebar to view detailed information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

