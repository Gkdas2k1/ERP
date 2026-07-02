import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Sales = lazy(() => import('./pages/Sales'));
const Accounting = lazy(() => import('./pages/Accounting'));

// Placeholder for future modules
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2">This module will be built in the next phase.</p>
  </div>
);

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />

          {/* Protected Routes with Layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="sales" element={<Suspense fallback={<PageLoader />}><Sales /></Suspense>} />
            <Route path="purchases" element={<Placeholder title="Purchases & Procurement" />} />
            <Route path="inventory" element={<Suspense fallback={<PageLoader />}><Inventory /></Suspense>} />
            <Route path="accounting" element={<Suspense fallback={<PageLoader />}><Accounting /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;