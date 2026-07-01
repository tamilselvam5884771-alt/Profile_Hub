import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '../features/auth';
import Dashboard from '../features/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Root path: redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Future Placeholders */}
        <Route path="/profile" element={<div className="p-8 text-[#e2f1f1]">Profile Placeholder</div>} />
        <Route path="/projects" element={<div className="p-8 text-[#e2f1f1]">Projects Placeholder</div>} />
        <Route path="/analytics" element={<div className="p-8 text-[#e2f1f1]">Analytics Placeholder</div>} />
        <Route path="/settings" element={<div className="p-8 text-[#e2f1f1]">Settings Placeholder</div>} />
      </Route>

      {/* Redirect all other paths to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
