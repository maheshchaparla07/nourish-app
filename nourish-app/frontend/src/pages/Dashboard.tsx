import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { user } = useAuth();
  
  // User name (user is guaranteed to exist due to ProtectedRoute)
  const displayName = user?.name || 'User';

  return (
    <div className="flex min-h-screen bg-nourish-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-nourish-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-nourish-gray-600">
              Welcome to your digital care records platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Residents"
              value={24}
              change="+3 this month"
              trend="up"
              color="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              title="Care Notes Today"
              value={18}
              change="+5 from yesterday"
              trend="up"
              color="secondary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              title="Pending Tasks"
              value={7}
              change="3 completed today"
              trend="down"
              color="accent"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
            <StatCard
              title="Digital Records"
              value="98%"
              change="+2% this week"
              trend="up"
              color="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Care Note</span>
                </button>
                <button className="w-full btn-secondary text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add New Resident</span>
                </button>
                <button className="w-full border-2 border-nourish-gray-300 text-nourish-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-nourish-gray-50 transition-colors text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View All Records</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-nourish-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', action: 'Care note updated', time: '2 hours ago', type: 'note' },
                  { name: 'Michael Chen', action: 'New resident added', time: '4 hours ago', type: 'resident' },
                  { name: 'Emma Williams', action: 'Medication record updated', time: '6 hours ago', type: 'medication' },
                  { name: 'James Brown', action: 'Care plan reviewed', time: '1 day ago', type: 'plan' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-nourish-gray-200 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'note' ? 'bg-nourish-100 text-nourish-600' :
                      activity.type === 'resident' ? 'bg-nourish-blue-100 text-nourish-blue-600' :
                      activity.type === 'medication' ? 'bg-nourish-beige-100 text-nourish-beige-600' :
                      'bg-nourish-gray-100 text-nourish-gray-600'
                    }`}>
                      {activity.type === 'note' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {activity.type === 'resident' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      )}
                      {activity.type === 'medication' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )}
                      {activity.type === 'plan' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-nourish-gray-900">{activity.name}</p>
                      <p className="text-sm text-nourish-gray-600">{activity.action}</p>
                      <p className="text-xs text-nourish-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transition Message */}
          <div className="mt-8 card bg-gradient-to-r from-nourish-50 to-nourish-blue-50 border-nourish-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-nourish-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-nourish-gray-900 mb-2">
                  Transitioning from Paper to Digital
                </h3>
                <p className="text-nourish-gray-700 mb-4">
                  You're successfully transitioning from paper-based notes to our digital care records platform. 
                  This system helps you provide more efficient, person-centered care while maintaining accurate 
                  and accessible documentation for people with mental disabilities transitioning to independence.
                </p>
                <div className="flex gap-3">
                  <button className="btn-primary text-sm">
                    Learn More
                  </button>
                  <button className="border-2 border-nourish-500 text-nourish-700 font-medium px-4 py-2 rounded-lg hover:bg-nourish-50 transition-colors text-sm">
                    View Tutorial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
