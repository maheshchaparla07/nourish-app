import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeProfile } from '../api/auth';

interface ProfileCompletionProps {
  token: string;
  userEmail: string;
}

export default function ProfileCompletion({ token, userEmail }: ProfileCompletionProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    fullName?: string;
    role?: string;
    department?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      role?: string;
      department?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await completeProfile(
        { full_name: fullName, role, department },
        token
      );

      localStorage.setItem('auth_token', response.token);
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nourish-400 via-nourish-500 to-nourish-600 flex flex-col items-center justify-center p-4">
      <div className="bg-nourish-beige-50 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-nourish-800">
          Complete Your Profile
        </h1>
        <p className="text-center text-nourish-gray-600 mb-8">
          Welcome! Please complete your profile information to get started.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Display */}
          <div>
            <label className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-3 border-2 border-nourish-gray-300 rounded-lg bg-nourish-gray-100 text-nourish-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
              }}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500/30 transition ${
                errors.fullName
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-nourish-gray-300 focus:border-nourish-500'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors({ ...errors, role: undefined });
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500/30 transition ${
                errors.role
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-nourish-gray-300 focus:border-nourish-500'
              }`}
            >
              <option value="">Select your role</option>
              <option value="Manager">Manager</option>
              <option value="Carer">Carer</option>
              <option value="Administrator">Administrator</option>
              <option value="Staff">Staff</option>
              <option value="Other">Other</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (errors.department) setErrors({ ...errors, department: undefined });
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500/30 transition ${
                errors.department
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-nourish-gray-300 focus:border-nourish-500'
              }`}
            >
              <option value="">Select your department</option>
              <option value="Operations">Operations</option>
              <option value="Care Services">Care Services</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Administration">Administration</option>
              <option value="Other">Other</option>
            </select>
            {errors.department && (
              <p className="text-red-600 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nourish-600 hover:bg-nourish-700 disabled:bg-nourish-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
