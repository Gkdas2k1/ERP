import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Settings from './pages/Settings';
// We will build the Login and Dashboard pages in the next step!

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/settings" element={<Settings />} />
          {/* Fallback for now */}
          <Route path="*" element={<Navigate to="/settings" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;