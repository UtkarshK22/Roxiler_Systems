import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { fetchAdminDashboard, adminData, loading, error } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminDashboard();
  }, [fetchAdminDashboard]);

  const statCards = [
    {
      label: 'Total Users',
      value: adminData?.totalUsers ?? 0,
      icon: '👥',
      href: '/admin/users',
    },
    {
      label: 'Total Stores',
      value: adminData?.totalStores ?? 0,
      icon: '🏪',
      href: '/admin/stores',
    },
    {
      label: 'Total Ratings',
      value: adminData?.totalRatings ?? 0,
      icon: '⭐',
      href: '/stores',
    },
  ];

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.name}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{card.label}</h3>
              <p className="mt-1 text-sm text-gray-500">
                <Link to={card.href} className="text-blue-600 hover:underline">
                  Manage {card.label.toLowerCase()}
                </Link>
              </p>
              <p className="mt-4 text-3xl font-extrabold text-gray-900">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users/new"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Add New User
          </Link>
          <Link
            to="/admin/stores/new"
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            Add New Store
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            View All Users
          </Link>
        </div>
      </div>
    </div>
  );
}