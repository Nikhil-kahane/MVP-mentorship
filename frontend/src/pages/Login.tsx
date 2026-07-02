import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/auth';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setError('');
    setForgotSent('');
    try {
      await authAPI.forgotPassword(forgotEmail);
      setForgotSent(`Password reset link simulated for: ${forgotEmail}`);
    } catch {
      setForgotSent('Failed to trigger reset email simulation.');
    }
  };

  const fillQuickDemo = (role: 'student' | 'mentor' | 'admin') => {
    if (role === 'student') {
      setUsername('student_demo');
      setPassword('password123');
    } else if (role === 'mentor') {
      setUsername('sarah_m');
      setPassword('password123');
    } else if (role === 'admin') {
      setUsername('admin_user');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 text-left animate-fade-in px-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-400 font-medium">Log into your Mentorship Academy session</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {showForgot ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <h2 className="text-lg font-bold text-gray-800">Forgot Password</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Provide your registration email address and we will configure an active SMTP mock response / password reset validation.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={forgotEmail} 
                onChange={e => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
              />
            </div>
            {forgotSent && (
              <p className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 p-3 rounded-lg leading-relaxed">
                {forgotSent}
              </p>
            )}
            <button 
              type="submit" 
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Reset My Password
            </button>
            <button 
              type="button" 
              onClick={() => { setShowForgot(false); setForgotSent(''); }} 
              className="w-full text-center text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="username or demo" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)} 
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-400 font-semibold pt-4">
              Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Sign up</Link>
            </p>

            {/* Test accounts quick filler */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex items-center gap-1.5 mb-3 justify-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Quick Sandbox Login Options
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  onClick={() => fillQuickDemo('student')} 
                  className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-[10px] font-bold text-slate-600 hover:text-indigo-600 rounded-lg transition"
                >
                  Student
                </button>
                <button 
                  type="button" 
                  onClick={() => fillQuickDemo('mentor')} 
                  className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-[10px] font-bold text-slate-600 hover:text-indigo-600 rounded-lg transition"
                >
                  Mentor
                </button>
                <button 
                  type="button" 
                  onClick={() => fillQuickDemo('admin')} 
                  className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-[10px] font-bold text-slate-600 hover:text-indigo-600 rounded-lg transition"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
