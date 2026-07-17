import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginPage, RegisterPage } from '../features/auth';
import Dashboard from '../features/dashboard/Dashboard';
import { ProfilePage } from '../features/profile';
import ProtectedRoute from './ProtectedRoute';

/**
 * Page transition wrapper — subtle fade + slight upward slide.
 * Kept intentionally short (180 ms) so it doesn't feel sluggish.
 */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login"    element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

        {/* Root path: redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />

          {/* Profile Creation/Editing Route */}
          <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />

          {/* Future Placeholders */}
          <Route path="/projects"   element={<PageTransition><div className="p-8 text-[#e2f1f1]">Projects Placeholder</div></PageTransition>} />
          <Route path="/analytics"  element={<PageTransition><div className="p-8 text-[#e2f1f1]">Analytics Placeholder</div></PageTransition>} />
          <Route path="/settings"   element={<PageTransition><div className="p-8 text-[#e2f1f1]">Settings Placeholder</div></PageTransition>} />
        </Route>

        {/* Redirect all other paths to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
