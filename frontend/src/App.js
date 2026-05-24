import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductSelector from './pages/ProductSelector';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FoodiesLogin from './pages/FoodiesLogin';
import FoodiesDashboard from './pages/FoodiesDashboard';
import { useAuth } from './hooks/useAuth';
import { useFoodiesAuth } from './hooks/useFoodiesAuth';
import { isAdminDomain, getAdminRoute } from './lib/routes';
import './App.css';

/* ── SBDevStudio auth guard ── */
const RequireSBDevAuth = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to={getAdminRoute('/sbdevstudio/login')} state={{ from: location }} replace />;
  }
  return children;
};

/* ── Foodies auth guard ── */
const RequireFoodiesAuth = ({ children }) => {
  const { token } = useFoodiesAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to={getAdminRoute('/foodies/login')} state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const isSubdomain = isAdminDomain();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {isSubdomain ? (
            <>
              {/* Admin Subdomain Root Routes */}
              <Route path="/" element={<ProductSelector />} />
              <Route path="/sbdevstudio/login" element={<AdminLogin />} />
              <Route
                path="/sbdevstudio"
                element={
                  <RequireSBDevAuth>
                    <AdminDashboard />
                  </RequireSBDevAuth>
                }
              />
              <Route path="/foodies/login" element={<FoodiesLogin />} />
              <Route
                path="/foodies"
                element={
                  <RequireFoodiesAuth>
                    <FoodiesDashboard />
                  </RequireFoodiesAuth>
                }
              />
            </>
          ) : (
            <>
              {/* Main Site Routes */}
              <Route path="/" element={<HomePage />} />
            </>
          )}

          {/* Legacy /admin Routes (Fallback for main site and local dev) */}
          <Route path="/admin" element={<ProductSelector />} />
          <Route path="/admin/sbdevstudio/login" element={<AdminLogin />} />
          <Route
            path="/admin/sbdevstudio"
            element={
              <RequireSBDevAuth>
                <AdminDashboard />
              </RequireSBDevAuth>
            }
          />
          <Route path="/admin/foodies/login" element={<FoodiesLogin />} />
          <Route
            path="/admin/foodies"
            element={
              <RequireFoodiesAuth>
                <FoodiesDashboard />
              </RequireFoodiesAuth>
            }
          />

          {/* Legacy redirect */}
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;