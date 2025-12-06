import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { createClient, ClientCreate } from '../api/clients';

interface Client {
  id: string;
  name: string;
  hasSpecial?: boolean;
  status?: 'active' | 'inactive';
}

// Mock data for the sidebar list
const mockClients: Client[] = [
  { id: '1', name: 'Aaron Bunn', hasSpecial: false, status: 'active' },
  { id: '2', name: 'Aaron Earl', hasSpecial: false, status: 'active' },
  { id: '3', name: 'Aarun Rashaad Ali', hasSpecial: false, status: 'active' },
  { id: '4', name: 'Abdul Rasul', hasSpecial: true, status: 'active' },
  { id: '5', name: 'Abdullah Zeb', hasSpecial: false, status: 'active' },
  { id: '6', name: 'Adam Graydon', hasSpecial: false, status: 'active' },
  { id: '7', name: 'Adam Izzahmad', hasSpecial: false, status: 'active' },
  { id: '8', name: 'Adam Mamtaz', hasSpecial: false, status: 'active' },
  { id: '9', name: 'Adam Walker', hasSpecial: false, status: 'active' },
  { id: '10', name: 'Adult Group Staff', hasSpecial: false, status: 'active' },
  { id: '11', name: 'After School Club Staff', hasSpecial: false, status: 'active' },
  { id: '12', name: 'Ahmed Alshumary', hasSpecial: true, status: 'active' },
  { id: '13', name: 'Alan Evans', hasSpecial: false, status: 'active' },
  { id: '14', name: 'Alara Kilic', hasSpecial: true, status: 'active' },
  { id: '15', name: 'Alby McDermott', hasSpecial: false, status: 'active' },
];

export default function NewClient() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    status: 'Client',
    clientType: 'Person',
    title: '',
    gender: 'Female',
    forename: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    secondaryEmail: '',
    landline: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || client.status === filterType;
    return matchesSearch && matchesType;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, clientType: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const clientData: ClientCreate = {
        status: formData.status,
        client_type: formData.clientType,
        title: formData.title || undefined,
        gender: formData.gender || undefined,
        forename: formData.forename,
        middle_name: formData.middleName || undefined,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        email: formData.email || undefined,
        secondary_email: formData.secondaryEmail || undefined,
        landline: formData.landline || undefined,
      };

      await createClient(clientData);
      navigate('/clients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="flex">
          {/* Left Sidebar - Client List */}
          <div className="w-80 bg-white border-r border-nourish-gray-200 flex flex-col h-screen fixed left-64">
            {/* Header */}
            <div className="p-4 border-b border-nourish-gray-200">
              <h2 className="text-xl font-semibold text-nourish-gray-900">New Client</h2>
            </div>

            {/* Last Viewed Section */}
            <div className="p-4 border-b border-nourish-gray-200 bg-nourish-gray-50">
              <h3 className="text-xs font-semibold text-nourish-gray-500 uppercase mb-2">Last Viewed</h3>
              <p className="text-sm text-nourish-gray-500">No user views recorded.</p>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-nourish-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="search clients"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                <p className="text-xs font-semibold text-nourish-gray-500 uppercase px-2 mb-2">2nd person required in building</p>
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 flex items-center gap-2 hover:bg-nourish-gray-100 text-nourish-gray-700"
                  >
                    <svg className="w-4 h-4 text-nourish-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="flex-1 truncate">{client.name}</span>
                    {client.hasSpecial && (
                      <span className="text-nourish-gray-500 font-semibold">*</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-80">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Form Fields */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      >
                        <option value="Client">Client</option>
                        <option value="Prospect">Prospect</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Client Type */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Client type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clientType"
                            value="Person"
                            checked={formData.clientType === 'Person'}
                            onChange={() => handleRadioChange('Person')}
                            className="mr-2"
                          />
                          <span className="text-sm text-nourish-gray-700">Person</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clientType"
                            value="Organisation"
                            checked={formData.clientType === 'Organisation'}
                            onChange={() => handleRadioChange('Organisation')}
                            className="mr-2"
                          />
                          <span className="text-sm text-nourish-gray-700">Organisation</span>
                        </label>
                      </div>
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Only choose 'organisation' if your carers visit a location rather than a person, for example a care home.
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                        placeholder="Mr, Mrs, Ms, Dr, etc."
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Forename */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Forename <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="forename"
                        value={formData.forename}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Middle Name */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Middle name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Surname */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Surname <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Secondary Email */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Secondary Email(s)
                      </label>
                      <input
                        type="text"
                        name="secondaryEmail"
                        value={formData.secondaryEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                        placeholder="email1@example.com; email2@example.com"
                      />
                      <p className="mt-1 text-xs text-nourish-gray-500">
                        Use a semi-colon to add an additional email address.
                      </p>
                    </div>

                    {/* Landline */}
                    <div>
                      <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                        Landline
                      </label>
                      <input
                        type="tel"
                        name="landline"
                        value={formData.landline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Client'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/clients')}
                        className="px-4 py-2 border border-nourish-gray-300 text-nourish-gray-700 font-medium rounded-lg hover:bg-nourish-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Right: Map */}
                  <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
                    <div className="card h-full">
                      <h3 className="text-lg font-semibold text-nourish-gray-900 mb-4">Location</h3>
                      <div className="w-full h-[600px] bg-nourish-gray-100 rounded-lg border border-nourish-gray-300 relative overflow-hidden">
                        {/* Map placeholder - Replace with actual map component (e.g., Google Maps, Mapbox) */}
                        <iframe
                          src="https://www.openstreetmap.org/export/embed.html?bbox=-1.25%2C54.55%2C-1.20%2C54.58&layer=mapnik&marker=54.565,-1.225"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0"
                        ></iframe>
                        {/* Map controls overlay */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-nourish-gray-50">
                            <svg className="w-5 h-5 text-nourish-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-nourish-gray-50">
                            <svg className="w-5 h-5 text-nourish-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-nourish-gray-50">
                            <svg className="w-5 h-5 text-nourish-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

