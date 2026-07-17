import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-[#021d1e] text-amber-100 selection:bg-amber-500 selection:text-black">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
