import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import WelcomeHero from './components/WelcomeHero';
import StatsGrid from './components/StatsGrid';
import profileService from '../../services/profileService';
import useAuth from '../../hooks/useAuth';

/**
 * Derives a profile completion percentage from populated profile fields.
 */
const calculateCompletion = (profileData) => {
  if (!profileData) return 0;

  const scalarFields = ['headline', 'bio', 'location', 'profileImage', 'linkedin', 'github', 'leetcode'];
  const filledScalars = scalarFields.filter((field) => profileData[field]?.trim?.()).length;
  const filledArrays = ['skills', 'projects', 'certifications'].filter(
    (field) => (profileData[field]?.length ?? 0) > 0
  ).length;

  const total = scalarFields.length + 3;
  return Math.min(100, Math.round(((filledScalars + filledArrays) / total) * 100));
};

/**
 * Merges auth user fields into the profile payload for a single source of truth.
 */
const enrichProfile = (profileData, authUser) => {
  const userRef = profileData?.userId;

  return {
    ...profileData,
    name: profileData?.name || userRef?.name || authUser?.name || '',
    username: profileData?.username || userRef?.username || authUser?.username || '',
    email: profileData?.email || userRef?.email || authUser?.email || '',
    completion: calculateCompletion(profileData),
  };
};

/**
 * Dashboard Layout Page Component
 * Composes the layout, sidebar responsive visibility, and grid configuration
 * for the ProfileHub SaaS dashboard.
 */
export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.getMyProfile();
      if (response && response.success) {
        setProfile(enrichProfile(response.data, authUser));
      } else {
        throw new Error('Failed to retrieve profile data.');
      }
    } catch (err) {
      console.error('[Dashboard] Failed to fetch profile:', err);
      const errMsg = err.response?.data?.message || err.message || 'Unable to establish server connection.';
      setError(errMsg);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="flex min-h-screen bg-[#021d1e] text-[#e2f1f1] overflow-hidden">
      {/* 1. Sidebar - Responsive (Drawer on Mobile, Collapsible on Tablet, Fixed on Desktop) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} profileCompletion={profile?.completion ?? 0} />

      {/* 2. Main Content Area - Margins expand to offset the responsive Sidebar width */}
      <div className="flex flex-1 flex-col md:pl-20 lg:pl-72 transition-all duration-300 ease-in-out min-w-0">
        
        {/* Sticky Header Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} profile={profile} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {error && !loading && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-xl border border-red-500/30 bg-red-950/20 text-sm shadow-md">
              <div className="space-y-1">
                <p className="text-red-300 font-semibold">Unable to load your profile</p>
                <p className="text-red-400/80 text-xs">{error}</p>
              </div>
              <button
                onClick={fetchProfile}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-[#011414] font-bold rounded-lg text-xs tracking-wider shadow active:scale-95 transition-all duration-200 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {(loading || profile) && (
            <>
              <WelcomeHero profile={profile} loading={loading} />
              <StatsGrid profile={profile} loading={loading} />
            </>
          )}

          {/* Grid Layout for Sub-sections and future components */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Left/Center Column (2/3 width on desktop) */}
            <div className="space-y-6 lg:col-span-2">
              {/* CareerHealth Placeholder */}
              {loading ? (
                <div className="flex h-64 flex-col justify-between rounded-2xl border border-[#083030]/40 bg-[#011414]/30 p-6 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-1/4 rounded bg-[#032e2e]" />
                    <div className="h-3 w-1/2 rounded bg-[#032e2e] opacity-60" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3.5 w-full rounded bg-[#032e2e]" />
                    <div className="h-3.5 w-5/6 rounded bg-[#032e2e]" />
                    <div className="h-3.5 w-4/5 rounded bg-[#032e2e]" />
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-[#032e2e]" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex h-64 items-center justify-center rounded-2xl border border-[#083030]/60 bg-[#011414]/50 p-6 text-[#7da3a3] shadow-lg shadow-black/20 hover:border-[#0a5050] transition-all duration-300"
                >
                  <span className="font-semibold tracking-wide">CareerHealth Placeholder</span>
                </motion.div>
              )}

              {/* Goals Placeholder */}
              {loading ? (
                <div className="flex h-64 flex-col justify-between rounded-2xl border border-[#083030]/40 bg-[#011414]/30 p-6 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 rounded bg-[#032e2e]" />
                    <div className="h-3 w-1/4 rounded bg-[#032e2e] opacity-60" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#032e2e]" />
                      <div className="h-3.5 w-2/3 rounded bg-[#032e2e]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#032e2e]" />
                      <div className="h-3.5 w-1/2 rounded bg-[#032e2e]" />
                    </div>
                  </div>
                  <div className="h-8 w-32 rounded-lg bg-[#032e2e]" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex h-64 items-center justify-center rounded-2xl border border-[#083030]/60 bg-[#011414]/50 p-6 text-[#7da3a3] shadow-lg shadow-black/20 hover:border-[#0a5050] transition-all duration-300"
                >
                  <span className="font-semibold tracking-wide">Goals Placeholder</span>
                </motion.div>
              )}
            </div>

            {/* Right Column (1/3 width on desktop) */}
            <div className="space-y-6">
              {/* QuickActions Placeholder */}
              {loading ? (
                <div className="flex h-48 flex-col justify-between rounded-2xl border border-[#083030]/40 bg-[#011414]/30 p-6 animate-pulse">
                  <div className="h-4 w-1/2 rounded bg-[#032e2e]" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-[#032e2e]" />
                    <div className="h-10 rounded-xl bg-[#032e2e]" />
                    <div className="h-10 rounded-xl bg-[#032e2e]" />
                    <div className="h-10 rounded-xl bg-[#032e2e]" />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex h-48 items-center justify-center rounded-2xl border border-[#083030]/60 bg-[#011414]/50 p-6 text-[#7da3a3] shadow-lg shadow-black/20 hover:border-[#0a5050] transition-all duration-300"
                >
                  <span className="font-semibold tracking-wide">QuickActions Placeholder</span>
                </motion.div>
              )}

              {/* RecentActivity Placeholder */}
              {loading ? (
                <div className="flex h-80 flex-col justify-between rounded-2xl border border-[#083030]/40 bg-[#011414]/30 p-6 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-[#032e2e]" />
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#032e2e]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 rounded bg-[#032e2e]" />
                        <div className="h-2 w-1/4 rounded bg-[#032e2e] opacity-65" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#032e2e]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-1/2 rounded bg-[#032e2e]" />
                        <div className="h-2 w-1/4 rounded bg-[#032e2e] opacity-65" />
                      </div>
                    </div>
                  </div>
                  <div className="h-3.5 w-1/2 rounded bg-[#032e2e] mx-auto mt-4" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex h-80 items-center justify-center rounded-2xl border border-[#083030]/60 bg-[#011414]/50 p-6 text-[#7da3a3] shadow-lg shadow-black/20 hover:border-[#0a5050] transition-all duration-300"
                >
                  <span className="font-semibold tracking-wide">RecentActivity Placeholder</span>
                </motion.div>
              )}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
