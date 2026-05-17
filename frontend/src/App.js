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
import './App.css';

/* ── SBDevStudio auth guard ── */
const RequireSBDevAuth = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/sbdevstudio/login" state={{ from: location }} replace />;
  }
  return children;
};

/* ── Foodies auth guard ── */
const RequireFoodiesAuth = ({ children }) => {
  const { token } = useFoodiesAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/foodies/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<HomePage />} />

          {/* Product selector — shown before any login */}
          <Route path="/admin" element={<ProductSelector />} />

          {/* ── SBDevStudio ── */}
          <Route path="/admin/sbdevstudio/login" element={<AdminLogin />} />
          <Route
            path="/admin/sbdevstudio"
            element={
              <RequireSBDevAuth>
                <AdminDashboard />
              </RequireSBDevAuth>
            }
          />

          {/* ── Foodies POS ── */}
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