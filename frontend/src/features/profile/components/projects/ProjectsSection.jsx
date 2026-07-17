import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Github,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  PackageOpen,
  Tag,
  Clock,
} from 'lucide-react';
import profileService from '../../../../services/profileService';
import ProjectModal from './ProjectModal';

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_META = {
  Planning:    { color: 'text-sky-400',     bg: 'bg-sky-500/10',     ring: 'ring-sky-500/30' },
  'In Progress': { color: 'text-amber-400',   bg: 'bg-amber-500/10',   ring: 'ring-amber-500/30' },
  Completed:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30' },
  Archived:    { color: 'text-gray-400',    bg: 'bg-gray-500/10',    ring: 'ring-gray-500/30' },
};

const CATEGORY_COLORS = {
  'Web Application':      'text-cyan-400 bg-cyan-500/10 ring-cyan-500/25',
  'Mobile Application':   'text-pink-400 bg-pink-500/10 ring-pink-500/25',
  'Desktop Application':  'text-indigo-400 bg-indigo-500/10 ring-indigo-500/25',
  'AI / Machine Learning': 'text-purple-400 bg-purple-500/10 ring-purple-500/25',
  'Data Science':         'text-violet-400 bg-violet-500/10 ring-violet-500/25',
  'IoT':                  'text-rose-400 bg-rose-500/10 ring-rose-500/25',
  'Blockchain':           'text-orange-400 bg-orange-500/10 ring-orange-500/25',
  'Open Source':          'text-teal-400 bg-teal-500/10 ring-teal-500/25',
  'College Project':      'text-blue-400 bg-blue-500/10 ring-blue-500/25',
  'Hackathon':            'text-yellow-400 bg-yellow-500/10 ring-yellow-500/25',
  'Other':                'text-slate-400 bg-slate-500/10 ring-slate-500/25',
};

// Framer Motion stagger container / item variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:    { opacity: 0, scale: 0.93, y: -10, transition: { duration: 0.2 } },
};

// ─── ProjectCard (memoized) ──────────────────────────────────────────────────────

const ProjectCard = memo(function ProjectCard({ project, onEdit, onDelete, isDeleting }) {
  const statusMeta = STATUS_META[project.status] || STATUS_META.Planning;
  const catColor   = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.Other;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const options = { month: 'short', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (_) {
      return '';
    }
  };

  const dateText = project.startDate
    ? `${formatDate(project.startDate)} — ${project.endDate ? formatDate(project.endDate) : 'Present'}`
    : '';

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative flex flex-col rounded-3xl border border-[#083535]
                 bg-gradient-to-br from-[#011c1c] via-[#011414] to-[#010c0c]
                 hover:border-[#0c5f5f] hover:shadow-[0_0_32px_rgba(16,185,129,0.06)]
                 transition-all duration-300 overflow-hidden cursor-default"
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-44 bg-[#022424]/40 border-b border-[#083535] overflow-hidden select-none">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#234b4b] gap-2">
            <Briefcase size={36} className="opacity-40" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">ProfileHub Project</span>
          </div>
        )}

        {/* Featured Ribbon Badge */}
        {project.featured && (
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-[#011414] text-[10px] font-black tracking-wide shadow border border-amber-400/25">
            <Sparkles size={11} className="fill-current" />
            FEATURED
          </div>
        )}

        {/* Actions Overlay — Top Right */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(project)}
            title="Edit project"
            className="p-2 rounded-xl border border-[#084848] bg-[#011414]/90 backdrop-blur-sm
                       hover:bg-[#033c3c] hover:border-amber-500/40
                       text-[#7da3a3] hover:text-amber-400
                       transition-all duration-200 active:scale-90"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(project._id)}
            title="Delete project"
            disabled={isDeleting}
            className="p-2 rounded-xl border border-[#084848] bg-[#011414]/90 backdrop-blur-sm
                       hover:bg-red-950/30 hover:border-red-500/40
                       text-[#7da3a3] hover:text-red-400
                       transition-all duration-200 active:scale-90 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        
        {/* Title + Tagline */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-[#e2f1f1] leading-snug tracking-wide group-hover:text-amber-400 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>
          {project.tagline && (
            <p className="text-xs text-[#7da3a3] line-clamp-1 leading-relaxed">
              {project.tagline}
            </p>
          )}
        </div>

        {/* Badges Container */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold tracking-wide uppercase ring-1 ${catColor}`}>
            <Tag size={9} />
            {project.category}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold tracking-wide uppercase ring-1 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.ring}`}>
            <span className="w-1 h-1 rounded-full bg-current shrink-0" />
            {project.status}
          </span>
        </div>

        {/* Description body */}
        <p className="text-xs text-[#5e8888] leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Date Display */}
        {dateText && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#5e8888] font-mono">
            <Clock size={11} />
            {dateText}
          </div>
        )}

        {/* Tech Stack list */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-lg bg-[#022424]/40 border border-[#083535] text-[10px] text-[#7da3a3]"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className="px-2 py-0.5 rounded-lg bg-[#010c0c] border border-[#083030] text-[9px] text-[#5e8888] font-mono">
                +{project.techStack.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Achievements Preview */}
        {project.achievements?.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#010c0c]/40 border border-[#083535] space-y-1">
            <span className="block text-[9px] uppercase font-bold tracking-wider text-[#7da3a3]">
              Key Achievement
            </span>
            <p className="text-xs text-[#94b3b3] leading-relaxed line-clamp-2">
              {project.achievements[0]}
            </p>
          </div>
        )}

        {/* Bottom Actions Links Area */}
        <div className="flex items-center gap-3 pt-2 mt-auto border-t border-[#083030]/60">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#022424] border border-[#084848] text-xs font-bold text-[#7da3a3] hover:text-[#e2f1f1] hover:bg-[#033c3c] active:scale-95 transition-all"
            >
              <Github size={13} />
              Repository
            </a>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#083030]/30 bg-[#010c0c]/40 text-xs font-bold text-[#5e8888]/40 cursor-not-allowed select-none">
              <Github size={13} />
              Private Repo
            </span>
          )}

          {project.liveDemoUrl ? (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] text-xs font-bold active:scale-95 transition-all shadow-sm shadow-amber-950/10"
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#083030]/30 bg-[#010c0c]/40 text-xs font-bold text-[#5e8888]/40 cursor-not-allowed select-none">
              <ExternalLink size={13} />
              No Demo
            </span>
          )}
        </div>

      </div>
    </motion.div>
  );
});

// ─── EmptyState ────────────────────────────────────────────────────────────────

const EmptyState = memo(function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center
                 rounded-3xl border border-dashed border-[#083535] bg-[#010c0c]/40"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5"
      >
        <PackageOpen size={30} className="text-amber-400" />
      </motion.div>
      <h3 className="text-sm font-bold text-[#e2f1f1] mb-1">No projects yet. Build something amazing.</h3>
      <p className="text-xs text-[#5e8888] mb-6 max-w-sm leading-relaxed">
        Upload screenshots, tag your tech stacks, and showcase your best code accomplishments to draw employers.
      </p>
      <button
        onClick={onAdd}
        id="btn-add-project-empty"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                   bg-gradient-to-r from-amber-500 to-yellow-600
                   hover:from-amber-600 hover:to-yellow-700
                   text-[#011414] font-bold text-xs
                   shadow-md shadow-amber-950/30 active:scale-95 transition-all"
      >
        <Plus size={14} />
        Add Your First Project
      </button>
    </motion.div>
  );
});

// ─── ProjectSkeletons ──────────────────────────────────────────────────────────

function ProjectSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col rounded-3xl border border-[#083535]/50 bg-[#011414]/30 overflow-hidden h-[460px]">
          <div className="h-44 w-full bg-[#032e2e]/60" />
          <div className="p-5 space-y-4 flex-1">
            <div className="h-5 w-3/4 bg-[#032e2e] rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-[#032e2e] rounded-lg" />
              <div className="h-6 w-16 bg-[#032e2e] rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#032e2e] rounded" />
              <div className="h-3 w-5/6 bg-[#032e2e] rounded" />
              <div className="h-3 w-2/3 bg-[#032e2e] rounded" />
            </div>
            <div className="h-10 w-full bg-[#032e2e] rounded-xl mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProjectsSection({ profile, onProjectsChange }) {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editProject, setEditProject] = useState(null);
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

  // ─── Fetch / Populate on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (Array.isArray(profile?.projects)) {
      setProjects(profile.projects);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    profileService.getProjects()
      .then((res) => { if (!cancelled && res?.success) setProjects(res.data || []); })
      .catch((err) => { if (!cancelled) showToast('error', err.response?.data?.message || 'Failed to load projects.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [profile]);

  // ─── Propagate to parent ───────────────────────────────────────────────────
  const propagate = useCallback((updated) => {
    setProjects(updated);
    onProjectsChange?.(updated);
  }, [onProjectsChange]);

  // ─── Modal Actions ─────────────────────────────────────────────────────────
  const openAdd = useCallback(() => {
    setEditProject(null);
    setModalError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((project) => {
    setEditProject(project);
    setModalError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (saving) return;
    setModalOpen(false);
    setEditProject(null);
    setModalError(null);
  }, [saving]);

  // ─── Save / Create / Update ────────────────────────────────────────────────
  const handleSave = useCallback(async (payload) => {
    setSaving(true);
    setModalError(null);
    try {
      let res;
      if (editProject) {
        res = await profileService.updateProject(editProject._id, payload);
        showToast('success', `'${payload.title}' project updated.`);
      } else {
        res = await profileService.addProject(payload);
        showToast('success', `'${payload.title}' project added.`);
      }
      if (res?.success && res.data) propagate(res.data.projects || []);
      setModalOpen(false);
      setEditProject(null);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]
        || 'Failed to save project details.';
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  }, [editProject, propagate, showToast]);

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (projectId) => {
    const target = projects.find((p) => p._id === projectId);
    if (!window.confirm(`Remove '${target?.title}'? All thumbnail images associated will be deleted permanently.`)) return;
    setDeletingId(projectId);
    try {
      const res = await profileService.deleteProject(projectId);
      if (res?.success && res.data) {
        propagate(res.data.projects || []);
        showToast('success', `'${target?.title}' deleted.`);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  }, [projects, propagate, showToast]);

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Briefcase size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e2f1f1] tracking-wide">Projects Showcase</h2>
            <p className="text-[10px] text-[#5e8888] font-mono">
              {loading ? '...' : `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} published`}
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          id="btn-add-project"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-to-r from-amber-500 to-yellow-600
                     hover:from-amber-600 hover:to-yellow-700
                     text-[#011414] font-bold text-xs
                     shadow-md shadow-amber-950/20 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium shadow-md ${
              toast.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                : 'border-red-500/30 bg-red-950/20 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid View */}
      {loading ? (
        <ProjectSkeletons />
      ) : projects.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((proj) => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onEdit={openEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === proj._id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project modal form */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editProject={editProject}
        saving={saving}
        apiError={modalError}
      />

    </div>
  );
}
