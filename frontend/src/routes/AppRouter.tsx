import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RoleRoute } from '../components/RoleRoute';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminUsers } from '../pages/AdminUsers';
import { AdminStores } from '../pages/AdminStores';
import { UserStores } from '../pages/UserStores';
import { OwnerDashboard } from '../pages/OwnerDashboard';
import { UpdatePassword } from '../pages/UpdatePassword';
import { Unauthorized } from '../pages/Unauthorized';
import { Navbar } from '../components/Navbar';

/** Where each role lands after login. */
function homeForRole(role?: string): string {
  if (role === 'SYSTEM_ADMIN') return '/admin';
  if (role === 'STORE_OWNER') return '/owner';
  return '/stores';
}

/** Layout route: blocks anonymous users, then renders the matched child route. */
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function RouterContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to={homeForRole(user.role)} replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to={homeForRole(user.role)} replace /> : <Signup />}
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={user ? homeForRole(user.role) : '/login'} replace />}
      />

      {/* Protected routes (login required) */}
      <Route element={<ProtectedLayout />}>
        {/* System administrator */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminUsers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <RoleRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminStores />
            </RoleRoute>
          }
        />

        {/* Store owner */}
        <Route
          path="/owner"
          element={
            <RoleRoute allowedRoles={['STORE_OWNER']}>
              <OwnerDashboard />
            </RoleRoute>
          }
        />

        {/* Normal user */}
        <Route
          path="/stores"
          element={
            <RoleRoute allowedRoles={['NORMAL_USER']}>
              <UserStores />
            </RoleRoute>
          }
        />

        {/* Any logged-in user */}
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? homeForRole(user.role) : '/login'} replace />}
      />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <RouterContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}