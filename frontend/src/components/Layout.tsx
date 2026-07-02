import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Calendar, User, LogOut, Shield, CheckCircle, Menu, X, ArrowLeft } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-gray-800">
      {/* Navigation Brand Header */}
      <nav id="app-navbar" className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              M
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition">
                Mentorship
              </span>
              <span className="text-xs block text-gray-400 font-medium">Academy Hub</span>
            </div>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              to="/courses" 
              className={`font-semibold text-sm transition ${isActive('/courses') ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            >
              Courses
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-semibold text-sm transition ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/bookings" 
                  className={`font-semibold text-sm transition ${isActive('/bookings') ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                >
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin-workflow" 
                    className={`font-semibold text-sm transition py-1 px-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-1.5 ${isActive('/admin-workflow') ? 'ring-2 ring-red-200 bg-red-100' : 'hover:bg-red-100'}`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                
                {/* Profile Badge Button */}
                <div className="h-6 w-[1px] bg-gray-200"></div>

                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition"
                >
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {user.first_name?.[0] || user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-gray-900 leading-3">
                      {user.first_name} {user.last_name}
                    </p>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm">
                  Log In
                </Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-indigo-100 hover:shadow-lg transition">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Action */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 md:hidden text-gray-500 hover:text-gray-900 bg-gray-50 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3 shadow-lg flex flex-col">
          <Link 
            to="/courses" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 font-semibold text-gray-700"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Courses
          </Link>
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 font-semibold text-gray-700"
              >
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                Dashboard
              </Link>
              <Link 
                to="/bookings" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 font-semibold text-gray-700"
              >
                <Calendar className="w-4 h-4 text-indigo-500" />
                My Bookings
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin-workflow" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 font-semibold text-red-600 bg-red-50"
                >
                  <Shield className="w-4 h-4 text-red-500" />
                  Admin Manager
                </Link>
              )}
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 font-semibold text-gray-700 border-t border-gray-100"
              >
                <User className="w-4 h-4 text-indigo-500" />
                Profile Settings
              </Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left p-3 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 font-semibold"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex gap-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold border border-indigo-200">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center p-3 bg-indigo-600 text-white rounded-xl font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer Element */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-sm text-gray-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Mentorship Academy. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
