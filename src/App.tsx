import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { ProblemSolvingPage } from './pages/ProblemSolvingPage';
import { useAuthStore } from './store/useAuthStore';
import Navbar from './components/layout/Navbar';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Submissions Page Placeholder
const SubmissionsPagePlaceholder: React.FC = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Submissions History</h1>
      <p className="text-slate-400 max-w-md">
        View your recent submissions, verdicts, and runtime details. (Page Placeholder)
      </p>
    </div>
  </div>
);



export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Global Toast notifications */}
      <Toaster position="top-right" theme="dark" richColors />

      <Routes>
        {/* Public Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Main Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemSolvingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <SubmissionsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
