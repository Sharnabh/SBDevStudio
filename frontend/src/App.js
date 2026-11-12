import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useFoodiesAuth } from './hooks/useFoodiesAuth';
import { isAdminDomain, getAdminRoute } from './lib/routes';
import './App.css';

// Lazy-loaded routes for code-splitting and bundle performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductSelector = lazy(() => import('./pages/ProductSelector'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FoodiesLogin = lazy(() => import('./pages/FoodiesLogin'));
const FoodiesDashboard = lazy(() => import('./pages/FoodiesDashboard'));

/* ── Route loading fallback ── */
const RouteLoadingFallback = () => (
  <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center font-mono text-xs text-[#8891a1]">
    <div className="w-8 h-8 rounded-lg bg-[#131824] border border-[#232b3e] flex items-center justify-center mb-3 shadow-md">
      <span className="w-2 h-2 rounded-full bg-[#5ab9fc] animate-ping" />
    </div>
    <span>Loading workspace...</span>
  </div>
);

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
        <Suspense fallback={<RouteLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
