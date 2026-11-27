import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLabels: Record<string, string> = {
    SYSTEM_ADMIN: 'System Admin',
    NORMAL_USER: 'Normal User',
    STORE_OWNER: 'Store Owner',
  };

  const rolePaths: Record<string, string> = {
    SYSTEM_ADMIN: '/admin',
    NORMAL_USER: '/stores',
    STORE_OWNER: '/owner',
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-blue-600">Roxiler</span>
            <span className="text-sm font-medium text-gray-600">Systems</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={rolePaths[user.role] || '/stores'}
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {roleLabels[user.role] || user.role}
            </span>
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="text-red-600 font-medium hover:text-red-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}