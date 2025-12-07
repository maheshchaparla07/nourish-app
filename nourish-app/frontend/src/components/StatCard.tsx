interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
}

export default function StatCard({ title, value, change, trend, icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-nourish-50 text-nourish-600',
    secondary: 'bg-nourish-blue-50 text-nourish-blue-600',
    accent: 'bg-nourish-beige-50 text-nourish-beige-600',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-nourish-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-nourish-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <svg className="w-4 h-4 text-nourish-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-nourish-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}


