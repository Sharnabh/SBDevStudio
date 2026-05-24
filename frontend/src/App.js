import React, { useEffect } from 'react';
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

/* ── External Redirect Component ── */
const RedirectToAdminSubdomain = () => {
  useEffect(() => {
    const newPath = window.location.pathname.replace('/admin', '');
    window.location.href = `https://admin.sbdevstudio.in${newPath}`;
  }, []);
  return null;
};

function App() {
  const isSubdomain = isAdminDomain();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

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

          {/* Local Dev ONLY: Fallback legacy /admin Routes */}
          {isLocalhost && !isSubdomain && (
            <>
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
              <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
            </>
          )}

          {/* Public Site ONLY: Redirect old /admin bookmarks to the new subdomain */}
          {!isLocalhost && !isSubdomain && (
            <Route path="/admin/*" element={<RedirectToAdminSubdomain />} />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;