import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Predict from './components/Home';
import UserHome from './components/UserHome';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

const AppContent = () => {
  const { currentUser, isAdmin } = useAuth();

  // If user is admin, show admin dashboard
  if (isAdmin) {
    return (
      <Layout>
        <AdminDashboard />
      </Layout>
    );
  }

  // If user is logged in, show main dashboard and allow navigation to predictions history
  if (currentUser) {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<UserHome />} />
        </Routes>
      </Layout>
    );
  }

  // Show predict, login, and admin routes for logged-out users
  return (
    <Routes>
      <Route path="/" element={<Predict />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
