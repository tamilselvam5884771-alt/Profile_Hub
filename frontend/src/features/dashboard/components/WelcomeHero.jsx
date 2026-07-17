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
  Briefcase,
  ExternalLink,
} from 'lucide-react';

/**
 * WelcomeHero Component
 * Renders the dashboard greeting, profile completion metrics, and motivational banner.
 * If a featured project exists, it is displayed in the right panel instead of the terminal mockup.
 * Receives profile data via props — does not fetch.
 */
export default function WelcomeHero({ profile, loading = false }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.15 },
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
      delay,
    },
  });

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 rounded-3xl border border-[#083535] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] p-6 lg:p-8 shadow-xl shadow-black/35 relative overflow-hidden animate-pulse">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="h-6 w-36 rounded-full bg-[#032e2e]" />
            <div className="h-10 w-full rounded-xl bg-[#032e2e]" />
            <div className="h-10 w-2/3 rounded-xl bg-[#032e2e]" />
            <div className="h-4 w-5/6 rounded-lg bg-[#032e2e]" />
          </div>
          <div className="p-5 rounded-2xl border border-[#084848] bg-[#022424]/40 backdrop-blur-sm max-w-xl h-24" />
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-[#084848]/60 bg-gradient-to-br from-[#023333] to-[#011414] h-full min-h-[220px]" />
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const displayName          = profile?.name || profile?.username || 'Developer';
  const displayUsername      = profile?.username ? `@${profile.username}` : 'profile.config';
  const displayEmail         = profile?.email || '';
  const projectCount         = profile?.projects?.length ?? 0;
  const completionPercentage = profile?.completion ?? 0;
  const isComplete           = completionPercentage === 100;
  const lastUpdated          = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Today';

  // Detect featured project (exclusive — only one can be featured at a time)
  const featuredProject = Array.isArray(profile?.projects)
    ? profile.projects.find((p) => p.featured === true)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 lg:grid-cols-10 rounded-3xl border border-[#083535] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] p-6 lg:p-8 shadow-xl shadow-black/35 relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* ── LEFT SECTION (6 cols) ──────────────────────────────────────────── */}
      <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Greeting badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/20 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            Good morning, {displayName} 👋
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
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#e2f1f1]">
              <span>
                {isComplete
                  ? 'Excellent! Your profile is fully completed.'
                  : `Your profile is ${completionPercentage}% complete.`}
              </span>
              <span className="text-amber-400">{completionPercentage}%</span>
            </div>

            {/* Progress bar */}
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

      {/* ── RIGHT SECTION (4 cols) — Featured Project OR Terminal ─────────── */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-4 flex items-center justify-center relative min-h-[260px] lg:min-h-full rounded-2xl border border-[#084848]/60 bg-gradient-to-br from-[#023333] to-[#011414] overflow-hidden"
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083535_1px,transparent_1px),linear-gradient(to_bottom,#083535_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

        {featuredProject ? (
          /* ── Featured Project Card ── */
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Thumbnail */}
            <div className="relative w-full h-36 bg-[#022424]/50 overflow-hidden shrink-0">
              {featuredProject.thumbnailUrl ? (
                <img
                  src={featuredProject.thumbnailUrl}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#234b4b]">
                  <Briefcase size={28} className="opacity-40" />
                </div>
              )}
              {/* FEATURED ribbon */}
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-[#011414] text-[9px] font-black tracking-wide shadow">
                <Sparkles size={9} className="fill-current" />
                FEATURED
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-3 p-4">
              <div>
                <h3 className="text-sm font-bold text-[#e2f1f1] leading-snug line-clamp-1">
                  {featuredProject.title}
                </h3>
                {featuredProject.tagline && (
                  <p className="text-[10px] text-[#7da3a3] mt-0.5 line-clamp-1">
                    {featuredProject.tagline}
                  </p>
                )}
              </div>

              {/* Category badge */}
              <span className="self-start inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/25 text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                {featuredProject.category}
              </span>

              {/* Tech stack chips */}
              {featuredProject.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {featuredProject.techStack.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-[#022424]/60 border border-[#083535] text-[9px] text-[#7da3a3]"
                    >
                      {t}
                    </span>
                  ))}
                  {featuredProject.techStack.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#010c0c] border border-[#083030] text-[9px] text-[#5e8888] font-mono">
                      +{featuredProject.techStack.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                {featuredProject.githubUrl && (
                  <a
                    href={featuredProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-[#022424] border border-[#084848] text-[10px] font-bold text-[#7da3a3] hover:text-white hover:bg-[#033c3c] active:scale-95 transition-all"
                  >
                    <Github size={11} />
                    Repo
                  </a>
                )}
                {featuredProject.liveDemoUrl && (
                  <a
                    href={featuredProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] text-[10px] font-bold active:scale-95 transition-all"
                  >
                    <ExternalLink size={11} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Terminal Mockup (fallback when no featured project) ── */
          <>
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

            {/* Floating badges */}
            <motion.div
              animate={floatAnimation(0)}
              className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-[#e2f1f1] shadow-lg shadow-black/30 backdrop-blur-sm"
            >
              <Github size={14} className="text-[#e2f1f1]" />
              <span>GitHub</span>
            </motion.div>

            <motion.div
              animate={floatAnimation(0.6)}
              className="absolute bottom-6 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-amber-400 shadow-lg shadow-black/30 backdrop-blur-sm"
            >
              <Award size={14} className="text-amber-400" />
              <span>LeetCode</span>
            </motion.div>

            <motion.div
              animate={floatAnimation(1.2)}
              className="absolute top-10 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-emerald-400 shadow-lg shadow-black/30 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>{projectCount} {projectCount === 1 ? 'Project' : 'Projects'}</span>
            </motion.div>

            <motion.div
              animate={floatAnimation(1.8)}
              className="absolute bottom-8 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085a5a] bg-[#022424]/90 text-xs font-semibold text-[#7da3a3] shadow-lg shadow-black/30 backdrop-blur-sm"
            >
              <FileText size={14} className="text-amber-500" />
              <span>Resume CV</span>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
