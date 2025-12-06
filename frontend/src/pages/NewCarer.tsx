import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { createCarer, CarerCreate } from '../api/carers';

interface Carer {
  id: string;
  name: string;
  hasMobile?: boolean;
  status?: 'active' | 'inactive';
}

// Mock data for the sidebar list
const mockCarers: Carer[] = [
  { id: '1', name: 'Elisha Wilkin', hasMobile: false, status: 'active' },
  { id: '2', name: 'Aparna Chandran', hasMobile: true, status: 'active' },
  { id: '3', name: 'Brooke Hall', hasMobile: true, status: 'active' },
  { id: '4', name: 'Carrie Wood-Woolley', hasMobile: true, status: 'active' },
  { id: '5', name: 'Emma Cuthbert', hasMobile: true, status: 'active' },
  { id: '6', name: 'Abigail Kelly', hasMobile: false, status: 'active' },
  { id: '7', name: 'After School Club S/U', hasMobile: false, status: 'active' },
  { id: '8', name: 'Alima Amar', hasMobile: false, status: 'active' },
  { id: '9', name: 'Amy James', hasMobile: false, status: 'active' },
  { id: '10', name: 'Charlotte Elgey', hasMobile: false, status: 'active' },
  { id: '11', name: 'Dana Docherty', hasMobile: false, status: 'active' },
  { id: '12', name: 'Donna Stolweather', hasMobile: false, status: 'active' },
  { id: '13', name: 'Friday Youth Group S/U', hasMobile: false, status: 'active' },
  { id: '14', name: 'Grace Murphy', hasMobile: false, status: 'active' },
  { id: '15', name: 'Heather Whyman', hasMobile: false, status: 'active' },
];

export default function NewCarer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    status: 'Active',
    title: '',
    gender: 'Female',
    forename: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    secondaryEmail: '',
    landline: '',
    mobile: '',
    hasMobileAccess: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const filteredCarers = mockCarers.filter(carer => {
    const matchesSearch = carer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || carer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const carerData: CarerCreate = {
        status: formData.status,
        title: formData.title || undefined,
        gender: formData.gender || undefined,
        forename: formData.forename,
        middle_name: formData.middleName || undefined,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        email: formData.email || undefined,
        secondary_email: formData.secondaryEmail || undefined,
        landline: formData.landline || undefined,
        mobile: formData.mobile || undefined,
        has_mobile_access: formData.hasMobileAccess,
      };

      await createCarer(carerData);
      navigate('/carers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create carer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="flex">
          {/* Left Sidebar - Carer List */}
          <div className="w-80 bg-white border-r border-nourish-gray-200 flex flex-col h-screen fixed left-64">
            {/* Header */}
            <div className="p-4 border-b border-nourish-gray-200">
              <h2 className="text-xl font-semibold text-nourish-gray-900">New Carer</h2>
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
                  placeholder="search carers"
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500 bg-white"
              >
                <option value="all">- All</option>
                <option value="active">- Active</option>
                <option value="inactive">- Inactive</option>
              </select>
            </div>

            {/* Carer List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {filteredCarers.map((carer) => (
                  <button
                    key={carer.id}
                    onClick={() => navigate(`/carers/${carer.id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 flex items-center gap-2 hover:bg-nourish-gray-100 text-nourish-gray-700"
                  >
                    {carer.hasMobile && (
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        M
                      </span>
                    )}
                    <span className="flex-1 truncate">{carer.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-80">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="max-w-3xl">
                  {/* Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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

                  {/* Mobile */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-nourish-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:border-nourish-500"
                    />
                  </div>

                  {/* Mobile Access */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasMobileAccess"
                        checked={formData.hasMobileAccess}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 text-nourish-500 border-nourish-gray-300 rounded focus:ring-nourish-500"
                      />
                      <span className="text-sm text-nourish-gray-700">Enable mobile app access</span>
                    </label>
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
                      {loading ? 'Saving...' : 'Save Carer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/carers')}
                      className="px-4 py-2 border border-nourish-gray-300 text-nourish-gray-700 font-medium rounded-lg hover:bg-nourish-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
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

