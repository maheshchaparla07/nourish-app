import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email or username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await loginUser({ email, password });
      
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
    <div className="min-h-screen bg-gradient-to-br from-nourish-400 via-nourish-500 to-nourish-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Cartoon Illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Water droplets - nourishment (food, hydration) */}
        <div className="absolute left-8 top-24 w-32 h-32 border-4 border-white/30 rounded-full">
          <div className="absolute inset-2 border-2 border-white/20 rounded-full"></div>
        </div>
        <div className="absolute right-16 top-32 w-16 h-16 border-4 border-white/30 rounded-full">
          <div className="absolute inset-1 border-2 border-white/20 rounded-full"></div>
        </div>
        <div className="absolute right-24 top-48 w-12 h-12 border-4 border-white/30 rounded-full"></div>
        <div className="absolute right-32 top-64 w-10 h-10 border-4 border-white/30 rounded-full"></div>
        
        {/* Star - achievement and progress */}
        <div className="absolute left-24 top-48">
          <div className="w-28 h-28 bg-white/25 rounded-full flex items-center justify-center border-2 border-white/15">
            <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              {/* Simple star shape - minimalist */}
              <path d="M12 2l2.5 7.5L22 10l-6 5.5 1.5 8.5L12 20l-5.5 4 1.5-8.5L2 10l7.5-.5L12 2z" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
        </div>
        
        {/* Home - independence and transition - minimalist */}
        <div className="absolute bottom-8 left-8">
          <div className="w-28 h-28 bg-white/25 rounded-full flex items-center justify-center border-2 border-white/15">
            <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              {/* Simplified house - minimalist style */}
              <path d="M12 4l-8 7v9h16V11l-8-7z" fill="currentColor" opacity="0.7"/>
              {/* Door - simple rectangle */}
              <rect x="10" y="15" width="4" height="5" fill="currentColor" opacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Sun - warmth and energy */}
        <div className="absolute top-12 right-12 opacity-60">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Care character with heart - support and care */}
        <div className="absolute bottom-8 right-8">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-nourish-blue-200/60 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span className="text-white text-2xl font-semibold">Main</span>
      </div>

      {/* Login Card */}
      <div className="bg-nourish-beige-50 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md mx-4 z-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-nourish-800">
          Main<br />
          <span className="text-xl font-normal text-nourish-gray-600">Welcome back</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Sign in with your email or username
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="Login"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500/30 transition ${
                errors.email
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-nourish-gray-300 focus:border-nourish-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-nourish-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Password"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-nourish-500/30 transition pr-12 ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-nourish-gray-300 focus:border-nourish-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-nourish-gray-500 hover:text-nourish-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Keep me logged in checkbox */}
          <div className="flex items-center">
            <input
              id="keepLoggedIn"
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="w-4 h-4 text-nourish-500 border-nourish-gray-300 rounded focus:ring-nourish-500"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-nourish-gray-700">
              Keep me logged in
            </label>
          </div>

          {/* Server error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-nourish-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-nourish-600 focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:ring-offset-2 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          {/* Links */}
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/register" className="text-nourish-gray-600 hover:text-nourish-600 transition">
              First time?
            </Link>
            <a href="#" className="text-nourish-gray-600 hover:text-nourish-600 transition">
              Forgot your password?
            </a>
          </div>

          {/* Microsoft Sign In Button */}
          <button
            type="button"
            className="w-full bg-white border-2 border-nourish-gray-200 text-nourish-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-nourish-gray-50 focus:outline-none focus:ring-2 focus:ring-nourish-500 focus:ring-offset-2 transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
              <rect x="0" y="0" width="11" height="11" fill="#F25022" />
              <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
              <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
              <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </button>
        </form>
      </div>

      {/* Terms of Use Button */}
      <button className="absolute bottom-8 bg-nourish-gray-800 text-white px-6 py-2 rounded-lg hover:bg-nourish-gray-900 transition z-10">
        Terms of Use
      </button>
    </div>
  );
}
