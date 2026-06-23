import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';

// Placeholder components for pages we will build in Phase 4
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2">This module will be built in the next phase.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes with Layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sales" element={<Sales />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchases" element={<Placeholder title="Purchases & Procurement" />} />
            <Route path="inventory" element={<Placeholder title="Inventory & Warehousing" />} />
            <Route path="accounting" element={<Placeholder title="Accounting & Auditing" />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;