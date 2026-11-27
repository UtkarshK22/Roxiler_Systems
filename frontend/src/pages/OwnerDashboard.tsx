import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { DataTable } from '../components/DataTable';

export function OwnerDashboard() {
  const { fetchOwnerDashboard, ownerData, loading, error } = useDashboard();

  useEffect(() => {
    fetchOwnerDashboard();
  }, [fetchOwnerDashboard]);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  const store = ownerData?.store ?? null;
  const averageRating = ownerData?.averageRating ?? null;
  const raters = ownerData?.raters || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="text-gray-600">
          Manage your store and view customer ratings
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
          {error}
        </div>
      )}

      {!store ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Store Assigned</h3>
          <p className="text-yellow-700">
            You don't have a store assigned yet. Please contact the system administrator.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Store Name</h3>
              <p className="text-2xl font-bold text-gray-900">{store.name}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Average Rating</h3>
              <p className="text-4xl font-extrabold text-blue-600">
                {averageRating !== null ? averageRating.toFixed(2) : 'No ratings yet'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Raters</h3>
              <p className="text-2xl font-bold text-gray-900">{raters.length}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 px-6 py-4 border-b border-gray-200">
              Customers Who Rated Your Store
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">Name</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">Rating</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {raters.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No ratings yet
                      </td>
                    </tr>
                  ) : (
                    raters.map((rater) => (
                      <tr key={rater.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-700">{rater.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{rater.email}</td>
                        <td className="px-6 py-3 text-sm font-medium text-yellow-600">
                          ⭐ {rater.rating}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {new Date(rater.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}