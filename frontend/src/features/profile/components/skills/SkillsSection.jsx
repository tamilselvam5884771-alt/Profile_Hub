import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  PackageOpen,
  Tag,
  Clock,
} from 'lucide-react';
import profileService from '../../../../services/profileService';
import SkillModal from './SkillModal';

// ─── Constants ─────────────────────────────────────────────────────────────────

const LEVEL_META = {
  Beginner:     { color: 'text-sky-400',     bg: 'bg-sky-500/10',     ring: 'ring-sky-500/30',     bar: 'bg-sky-400',     pct: '25%'  },
  Intermediate: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   ring: 'ring-amber-500/30',   bar: 'bg-amber-400',   pct: '50%'  },
  Advanced:     { color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', bar: 'bg-emerald-400', pct: '75%'  },
  Expert:       { color: 'text-purple-400',  bg: 'bg-purple-500/10',  ring: 'ring-purple-500/30',  bar: 'bg-purple-400',  pct: '100%' },
};

const CATEGORY_COLORS = {
  'Programming Language': 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/25',
  'Frontend':             'text-pink-400 bg-pink-500/10 ring-pink-500/25',
  'Backend':              'text-orange-400 bg-orange-500/10 ring-orange-500/25',
  'Database':             'text-teal-400 bg-teal-500/10 ring-teal-500/25',
  'Cloud':                'text-blue-400 bg-blue-500/10 ring-blue-500/25',
  'DevOps':               'text-indigo-400 bg-indigo-500/10 ring-indigo-500/25',
  'AI / Machine Learning':'text-violet-400 bg-violet-500/10 ring-violet-500/25',
  'Mobile':               'text-rose-400 bg-rose-500/10 ring-rose-500/25',
  'Tools':                'text-yellow-400 bg-yellow-500/10 ring-yellow-500/25',
  'Soft Skills':          'text-lime-400 bg-lime-500/10 ring-lime-500/25',
  'Other':                'text-slate-400 bg-slate-500/10 ring-slate-500/25',
};

// Framer Motion stagger container / item variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
  exit:    { opacity: 0, scale: 0.93, y: -8, transition: { duration: 0.2 } },
};

// ─── SkillCard (memoized) ──────────────────────────────────────────────────────

/**
 * Individual skill card — memoized so it only re-renders when its own
 * skill prop or deleting flag changes.
 */
const SkillCard = memo(function SkillCard({ skill, onEdit, onDelete, isDeleting }) {
  const level    = LEVEL_META[skill.level] || LEVEL_META.Beginner;
  const catColor = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other;
  const hasExp   = skill.experience?.value != null && skill.experience?.unit;

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-[#083535]
                 bg-gradient-to-br from-[#011c1c] via-[#011414] to-[#010c0c]
                 hover:border-[#0c5f5f] hover:shadow-[0_0_24px_rgba(16,185,129,0.05)]
                 transition-all duration-300 cursor-default"
    >
      {/* Hover gold top-line accent */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-full" />

      {/* Action buttons — appear on hover */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(skill)}
          title="Edit skill"
          className="p-1.5 rounded-lg border border-[#084848] bg-[#011414]
                     hover:bg-[#033c3c] hover:border-amber-500/40
                     text-[#7da3a3] hover:text-amber-400
                     transition-all duration-200 active:scale-90"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(skill._id)}
          title="Delete skill"
          disabled={isDeleting}
          className="p-1.5 rounded-lg border border-[#084848] bg-[#011414]
                     hover:bg-red-950/30 hover:border-red-500/40
                     text-[#7da3a3] hover:text-red-400
                     transition-all duration-200 active:scale-90 disabled:opacity-50"
        >
          {isDeleting
            ? <Loader2 size={13} className="animate-spin" />
            : <Trash2 size={13} />}
        </button>
      </div>

      {/* Skill name */}
      <div className="pr-16">
        <h3 className="text-sm font-bold text-[#e2f1f1] truncate leading-tight tracking-wide">
          {skill.skillName}
        </h3>
      </div>

      {/* Category + Level badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold ring-1 ${catColor}`}>
          <Tag size={9} />
          {skill.category}
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold ring-1 ${level.bg} ${level.color} ${level.ring}`}>
          <Zap size={9} />
          {skill.level}
        </span>
      </div>

      {/* Level progress bar */}
      <div className="w-full h-1 rounded-full bg-[#083535] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${level.bar}`}
          initial={{ width: 0 }}
          animate={{ width: level.pct }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        />
      </div>

      {/* Experience + verified/source */}
      <div className="flex items-center justify-between text-[10px] text-[#5e8888]">
        {hasExp ? (
          <span className="flex items-center gap-1 text-[#7da3a3]">
            <Clock size={10} />
            {skill.experience.value} {skill.experience.unit}
          </span>
        ) : (
          <span className="italic opacity-50">No exp. set</span>
        )}
        <div className="flex items-center gap-2">
          {skill.verified ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck size={11} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#5e8888]">
              <ShieldOff size={11} /> Unverified
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded bg-[#022424] border border-[#083535] font-mono text-[#5e8888]">
            {skill.source || 'Manual'}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// ─── EmptyState ────────────────────────────────────────────────────────────────

const EmptyState = memo(function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center
                 rounded-2xl border border-dashed border-[#083535] bg-[#010c0c]/40"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4"
      >
        <PackageOpen size={28} className="text-amber-400" />
      </motion.div>
      <h3 className="text-sm font-bold text-[#e2f1f1] mb-1">No skills added yet</h3>
      <p className="text-xs text-[#5e8888] mb-6 max-w-xs leading-relaxed">
        Showcase your expertise — add your first professional skill to attract recruiters and collaborators.
      </p>
      <button
        onClick={onAdd}
        id="btn-add-skill-empty"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                   bg-gradient-to-r from-amber-500 to-yellow-600
                   hover:from-amber-600 hover:to-yellow-700
                   text-[#011414] font-bold text-xs
                   shadow-md shadow-amber-950/30 active:scale-95 transition-all"
      >
        <Plus size={14} />
        Add Your First Skill
      </button>
    </motion.div>
  );
});

// ─── Skeleton Cards ────────────────────────────────────────────────────────────

function SkillSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl border border-[#083535]/50 bg-[#011414]/30">
          <div className="h-4 w-3/4 bg-[#032e2e] rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-[#032e2e] rounded-lg" />
            <div className="h-6 w-16 bg-[#032e2e] rounded-lg" />
          </div>
          <div className="h-1 w-full bg-[#032e2e] rounded-full" />
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-[#032e2e] rounded" />
            <div className="h-3 w-20 bg-[#032e2e] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * SkillsSection
 * Full-featured skills management section embedded in the Profile page.
 * Handles fetch, add, edit, delete, and surfaces success/error toasts.
 *
 * Props:
 *   profile          {Object}    — current profile (for initial skills data)
 *   onSkillsChange   {function}  — called with updated skills array after each mutation
 */
export default function SkillsSection({ profile, onSkillsChange }) {
  const [skills, setSkills]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editSkill, setEditSkill]   = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [toast, setToast]           = useState(null);

  // ─── Toast ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, []);

  // ─── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    // Use profile-hydrated data if already available — no extra API call
    if (Array.isArray(profile?.skills)) {
      setSkills(profile.skills);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    profileService.getSkills()
      .then((res) => { if (!cancelled && res?.success) setSkills(res.data || []); })
      .catch((err) => { if (!cancelled) showToast('error', err.response?.data?.message || 'Failed to load skills.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [profile]);

  // ─── Propagate to parent ───────────────────────────────────────────────────
  const propagate = useCallback((updated) => {
    setSkills(updated);
    onSkillsChange?.(updated);
  }, [onSkillsChange]);

  // ─── Modal control ─────────────────────────────────────────────────────────
  const openAdd = useCallback(() => {
    setEditSkill(null);
    setModalError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((skill) => {
    setEditSkill(skill);
    setModalError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (saving) return;
    setModalOpen(false);
    setEditSkill(null);
    setModalError(null);
  }, [saving]);

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async (payload) => {
    setSaving(true);
    setModalError(null);
    try {
      let res;
      if (editSkill) {
        res = await profileService.updateSkill(editSkill._id, payload);
        showToast('success', `'${payload.skillName}' updated.`);
      } else {
        res = await profileService.addSkill(payload);
        showToast('success', `'${payload.skillName}' added to your profile.`);
      }
      if (res?.success && res.data) propagate(res.data.skills || []);
      setModalOpen(false);
      setEditSkill(null);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]
        || 'Failed to save skill.';
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  }, [editSkill, propagate, showToast]);

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (skillId) => {
    const target = skills.find((s) => s._id === skillId);
    if (!window.confirm(`Remove '${target?.skillName}'? This cannot be undone.`)) return;
    setDeletingId(skillId);
    try {
      const res = await profileService.deleteSkill(skillId);
      if (res?.success && res.data) {
        propagate(res.data.skills || []);
        showToast('success', `'${target?.skillName}' removed.`);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete skill.');
    } finally {
      setDeletingId(null);
    }
  }, [skills, propagate, showToast]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Code2 size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e2f1f1] tracking-wide">Professional Skills</h2>
            <p className="text-[10px] text-[#5e8888] font-mono">
              {loading ? '...' : `${skills.length} ${skills.length === 1 ? 'skill' : 'skills'} listed`}
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          id="btn-add-skill"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-to-r from-amber-500 to-yellow-600
                     hover:from-amber-600 hover:to-yellow-700
                     text-[#011414] font-bold text-xs
                     shadow-md shadow-amber-950/20 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={14} />
          Add Skill
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium shadow-md ${
              toast.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                : 'border-red-500/30 bg-red-950/20 text-red-400'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle size={16} />
              : <AlertTriangle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <SkillSkeletons />
      ) : skills.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {skills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onEdit={openEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === skill._id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Category stats bar */}
      {!loading && skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 pt-2 border-t border-[#083535]"
        >
          {Object.entries(
            skills.reduce((acc, s) => { acc[s.category] = (acc[s.category] || 0) + 1; return acc; }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7)
            .map(([cat, count]) => (
              <span
                key={cat}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ring-1 ${
                  CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
                }`}
              >
                {cat}
                <span className="opacity-55">×{count}</span>
              </span>
            ))}
        </motion.div>
      )}

      {/* Modal */}
      <SkillModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editSkill={editSkill}
        saving={saving}
        apiError={modalError}
      />
    </div>
  );
}
