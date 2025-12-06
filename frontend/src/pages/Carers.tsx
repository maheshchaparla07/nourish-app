import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getAllCarers, Carer } from '../api/carers';

export default function Carers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [carers, setCarers] = useState<Carer[]>([]);
  const [selectedCarer, setSelectedCarer] = useState<Carer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [lastViewed, setLastViewed] = useState<Carer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarers();
  }, [filterStatus, searchQuery]);

  const fetchCarers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCarers(
        filterStatus === 'all' ? undefined : filterStatus,
        searchQuery || undefined
      );
      setCarers(response.carers);
      if (response.carers.length > 0 && !selectedCarer) {
        setSelectedCarer(response.carers[0]);
        setLastViewed(response.carers[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load carers');
    } finally {
      setLoading(false);
    }
  };

  const handleCarerSelect = (carer: Carer) => {
    setSelectedCarer(carer);
    setLastViewed(carer);
  };

  const getCarerName = (carer: Carer): string => {
    const parts = [carer.forename, carer.middle_name, carer.surname].filter(Boolean);
    return parts.join(' ') || 'Unnamed Carer';
  };

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="flex">
          {/* Left Sidebar - Carer List */}
          <div className="w-80 bg-white border-r border-nourish-gray-200 flex flex-col h-screen fixed left-64">
          {/* Add New Carer Button */}
          <div className="p-4 border-b border-nourish-gray-200">
            <button 
              onClick={() => navigate('/carers/new')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add new carer</span>
            </button>
          </div>

          {/* Last Viewed Section */}
          {lastViewed && (
            <div className="p-4 border-b border-nourish-gray-200 bg-nourish-gray-50">
              <h3 className="text-xs font-semibold text-nourish-gray-500 uppercase mb-2">Last Viewed</h3>
              <button
                onClick={() => handleCarerSelect(lastViewed)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCarer?.id === lastViewed.id
                    ? 'bg-nourish-100 text-nourish-700 font-medium'
                    : 'hover:bg-nourish-gray-100 text-nourish-gray-700'
                }`}
              >
                {lastViewed.name}
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-4 border-b border-nourish-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="search carers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchCarers();
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
              {loading ? (
                <div className="text-center py-8 text-nourish-gray-500 text-sm">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500 text-sm">
                  {error}
                </div>
              ) : carers.length === 0 ? (
                <div className="text-center py-8 text-nourish-gray-500 text-sm">
                  No carers found
                </div>
              ) : (
                carers.map((carer) => (
                  <button
                    key={carer.id}
                    onClick={() => handleCarerSelect(carer)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 flex items-center gap-2 ${
                      selectedCarer?.id === carer.id
                        ? 'bg-nourish-100 text-nourish-700 font-medium'
                        : 'hover:bg-nourish-gray-100 text-nourish-gray-700'
                    }`}
                  >
                    {carer.has_mobile_access && (
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        M
                      </span>
                    )}
                    <span className="flex-1 truncate">{getCarerName(carer)}</span>
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
                Carers
              </h1>
              <p className="text-nourish-gray-600">
                Manage and view carer information
              </p>
            </div>

            {/* Selected Carer Details */}
            {selectedCarer ? (
              <div className="card">
                <h2 className="text-2xl font-semibold text-nourish-gray-900 mb-4">
                  {getCarerName(selectedCarer)}
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-nourish-gray-600 mb-1">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedCarer.status}
                    </span>
                  </div>
                  {selectedCarer.has_mobile_access && (
                    <div>
                      <p className="text-sm text-nourish-gray-600 mb-1">Mobile Access</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Mobile Enabled
                      </span>
                    </div>
                  )}
                  {selectedCarer.email && (
                    <div>
                      <p className="text-sm text-nourish-gray-600 mb-1">Email</p>
                      <p className="text-sm text-nourish-gray-900">{selectedCarer.email}</p>
                    </div>
                  )}
                  {selectedCarer.mobile && (
                    <div>
                      <p className="text-sm text-nourish-gray-600 mb-1">Mobile</p>
                      <p className="text-sm text-nourish-gray-900">{selectedCarer.mobile}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <p className="text-nourish-gray-600 text-center py-8">
                  Select a carer from the left sidebar to view details.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

