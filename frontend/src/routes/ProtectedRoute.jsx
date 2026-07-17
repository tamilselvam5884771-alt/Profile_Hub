import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import { Loader2, Sparkles } from 'lucide-react';

/**
 * ProtectedRoute component that guards private routes.
 * Redirects unauthenticated users to the login page while preserving their attempted location.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#021d1e] text-[#e2f1f1] relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        {/* Premium Brand Loading Container */}
        <div className="flex flex-col items-center gap-6 relative z-10">
          {/* Logo Hexagon Shield Wrapper */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[2px] shadow-2xl shadow-emerald-950/50 animate-bounce">
            <div className="flex items-center justify-center w-full h-full rounded-[14px] bg-[#011414]">
              <svg
                className="w-8 h-8 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="12" y1="12" x2="22" y2="8.5" />
                <line x1="12" y1="12" x2="2" y2="8.5" />
              </svg>
            </div>
          </div>

          {/* Title & Loading indicator */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold tracking-widest bg-gradient-to-r from-[#e2f1f1] to-amber-200 bg-clip-text text-transparent">
              PROFILE<span className="text-amber-500">HUB</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#7da3a3] font-mono tracking-wider">
              <Loader2 size={13} className="animate-spin text-amber-500" />
              <span>SECURING CONNECTION...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
