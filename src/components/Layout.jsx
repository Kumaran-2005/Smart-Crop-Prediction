import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Leaf, BarChart3, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { currentUser, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const location = useLocation();
  const showLeftDecor = location.pathname === '/dashboard';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Left sidebar for prediction page (visible on lg+) */}
      {showLeftDecor && (
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-green-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-green-600 rounded-full p-2"><Leaf className="text-white w-5 h-5" /></span>
            <div>
              <div className="font-bold text-green-700">SmartCrop</div>
              <div className="text-xs text-gray-500">Predictor</div>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-3 text-gray-700 font-medium hover:text-green-700">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Dashboard
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 text-gray-700 font-medium hover:text-green-700">
              <Sprout className="w-5 h-5 text-green-600" />
              Crop Prediction
            </Link>
          </nav>

          <div className="mt-auto">
            {/* quick stats or profile placeholder */}
            <div className="bg-green-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-500">Success Rate</div>
              <div className="text-lg font-bold text-green-700">90.0%</div>
            </div>
            <div className="text-xs text-gray-500">{ /* keep space for future items */ }</div>
          </div>
        </aside>
      )}
      <nav className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">
                SmartCrop Predictor
              </span>
              {!showLeftDecor && (
                <>
                  <Link to="/" className="text-green-700 hover:underline text-sm ml-2 font-semibold">Dashboard</Link>
                  <Link to="/dashboard" className="text-green-700 hover:underline text-sm ml-2 font-semibold">Crop Prediction</Link>
                </>
              )}
              {isAdmin && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            
            {(currentUser || isAdmin) && (
              <div className="flex items-center space-x-4">
                {currentUser && !isAdmin && (
                  <span className="text-sm text-gray-600">
                    {currentUser.email}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${showLeftDecor ? 'lg:ml-64 lg:pl-4' : ''}`} style={{ paddingTop: 24 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
