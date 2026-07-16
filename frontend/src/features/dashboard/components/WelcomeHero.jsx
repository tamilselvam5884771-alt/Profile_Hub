import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Github,
  Clock,
  Sparkles,
  Award,
  FileText,
  Terminal,
} from 'lucide-react';

/**
 * WelcomeHero Component
 * Renders the dashboard greeting, profile completion metrics, and motivational banner.
 * Receives profile data via props — does not fetch.
 */
export default function WelcomeHero({ profile, loading = false }) {
  // Animation presets for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const floatAnimation = (delay) => ({
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay: delay,
    },
  });

  // 1. Render Skeleton Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 rounded-3xl border border-[#083535] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] p-6 lg:p-8 shadow-xl shadow-black/35 relative overflow-hidden animate-pulse">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Greeting badge skeleton */}
            <div className="h-6 w-36 rounded-full bg-[#032e2e]" />
            {/* Title skeleton */}
            <div className="h-10 w-full rounded-xl bg-[#032e2e]" />
            <div className="h-10 w-2/3 rounded-xl bg-[#032e2e]" />
            {/* Subtext skeleton */}
            <div className="h-4 w-5/6 rounded-lg bg-[#032e2e]" />
          </div>
          {/* Progress box skeleton */}
          <div className="p-5 rounded-2xl border border-[#084848] bg-[#022424]/40 backdrop-blur-sm max-w-xl h-24" />
        </div>
        {/* Terminal graphic skeleton */}
        <div className="lg:col-span-4 rounded-2xl border border-[#084848]/60 bg-gradient-to-br from-[#023333] to-[#011414] h-full min-h-[220px]" />
      </div>
    );
  }

  const displayName = profile?.name || profile?.username || 'Developer';
  const displayUsername = profile?.username ? `@${profile.username}` : 'profile.config';
  const displayEmail = profile?.email || '';
  const projectCount = profile?.projects?.length ?? 0;
  const completionPercentage = profile?.completion ?? 0;
  const isComplete = completionPercentage === 100;
  const lastUpdated = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Today';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 lg:grid-cols-10 rounded-3xl border border-[#083535] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] p-6 lg:p-8 shadow-xl shadow-black/35 relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* LEFT SECTION (60% width equivalent - 6 columns out of 10) */}
      <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Friendly Greeting */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/20 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            Good Morning, {displayName} 👋
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#e2f1f1]">
            Every project you build,<br className="hidden sm:inline" />
            every skill you learn,<br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
              moves your career forward.
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm text-[#7da3a3] max-w-xl leading-relaxed">
            ProfileHub helps you showcase your complete professional journey in one place.
            {displayEmail && (
              <span className="block mt-1 text-emerald-400/80">{displayEmail}</span>
            )}
          </p>
        </motion.div>

        {/* Profile Completion Box */}
        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl border border-[#084848] bg-[#022424]/40 backdrop-blur-sm max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          {/* Progress Bar Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#e2f1f1]">
              <span>
                {isComplete
                  ? 'Excellent! Your profile is fully completed.'
                  : `Your profile is ${completionPercentage}% complete.`}
              </span>
              <span className="text-amber-400">{completionPercentage}%</span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="h-2 w-full rounded-full bg-[#032e2e]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#7da3a3]">
              <Clock size={11} className="text-emerald-500" />
              Last Updated {lastUpdated}
            </div>
          </div>

          {/* CTA Action Button */}
          {!isComplete && (
            <Link 
              to="/profile" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] font-bold text-sm shadow-lg shadow-amber-950/20 active:scale-95 transition-all duration-200 group"
            >
              Continue Building
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* RIGHT SECTION (40% width equivalent - 4 columns out of 10) */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-4 flex items-center justify-center relative min-h-[260px] lg:min-h-full rounded-2xl border border-[#084848]/60 bg-gradient-to-br from-[#023333] to-[#011414] p-6 shadow-inner overflow-hidden"
      >
        {/* Interactive Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083535_1px,transparent_1px),linear-gradient(to_bottom,#083535_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

        {/* Center Mockup element: Terminal Box */}
        <div className="relative z-10 w-full max-w-[240px] rounded-xl border border-[#0c4e4e] bg-[#010c0c] p-4 shadow-xl shadow-black/50 text-emerald-400 font-mono text-[10px] space-y-2">
          <div className="flex items-center gap-1.5 border-b border-[#083030]/80 pb-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <Terminal size={11} className="text-[#558888] ml-2" />
            <span className="text-[#558888]">{displayUsername}</span>
          </div>
          <div><span className="text-[#7da3a3]">&gt; </span>npm run showcase</div>
          <div className="text-amber-400">⚡ ProfileHub Active</div>
          <div className="text-[#7da3a3]">Status: Premium Verified</div>
        </div>

        {/* Floating Badges with Lucide Icons */}
        
        {/* 1. GitHub Badge */}
        <motion.div
          animate={floatAnimation(0)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-[#e2f1f1] shadow-lg shadow-black/30 backdrop-blur-sm"
        >
          <Github size={14} className="text-[#e2f1f1]" />
          <span>GitHub</span>
        </motion.div>

        {/* 2. LeetCode Badge */}
        <motion.div
          animate={floatAnimation(0.6)}
          className="absolute bottom-6 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-amber-400 shadow-lg shadow-black/30 backdrop-blur-sm"
        >
          <Award size={14} className="text-amber-400" />
          <span>LeetCode</span>
        </motion.div>

        {/* 3. Projects Badge */}
        <motion.div
          animate={floatAnimation(1.2)}
          className="absolute top-10 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-emerald-400 shadow-lg shadow-black/30 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>{projectCount} {projectCount === 1 ? 'Project' : 'Projects'}</span>
        </motion.div>

        {/* 4. Resume Badge */}
        <motion.div
          animate={floatAnimation(1.8)}
          className="absolute bottom-8 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-[#7da3a3] shadow-lg shadow-black/30 backdrop-blur-sm"
        >
          <FileText size={14} className="text-amber-500" />
          <span>Resume CV</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
