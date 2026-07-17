import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Briefcase,
  ChevronDown,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
  Link,
  Github,
  Calendar,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import profileService from '../../../../services/profileService';

const CATEGORIES = [
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'AI / Machine Learning',
  'Data Science',
  'IoT',
  'Blockchain',
  'Open Source',
  'College Project',
  'Hackathon',
  'Other',
];

const STATUSES = ['Planning', 'In Progress', 'Completed', 'Archived'];

const STATUS_META = {
  Planning:    { color: 'text-sky-400',     bg: 'bg-sky-500/10' },
  'In Progress': { color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  Completed:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  Archived:    { color: 'text-gray-400',    bg: 'bg-gray-500/10' },
};

const EMPTY_FORM = {
  title: '',
  tagline: '',
  description: '',
  category: '',
  status: '',
  githubUrl: '',
  liveDemoUrl: '',
  thumbnailUrl: '',
  thumbnailPublicId: '',
  featured: false,
  startDate: '',
  endDate: '',
};

export default function ProjectModal({ isOpen, onClose, onSave, editProject = null, saving = false, apiError = null }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [achInput, setAchInput] = useState('');
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-fill form when editing an existing project
  useEffect(() => {
    if (editProject) {
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          return new Date(dateStr).toISOString().split('T')[0];
        } catch (_) {
          return '';
        }
      };

      setForm({
        title: editProject.title || '',
        tagline: editProject.tagline || '',
        description: editProject.description || '',
        category: editProject.category || '',
        status: editProject.status || '',
        githubUrl: editProject.githubUrl || '',
        liveDemoUrl: editProject.liveDemoUrl || '',
        thumbnailUrl: editProject.thumbnailUrl || '',
        thumbnailPublicId: editProject.thumbnailPublicId || '',
        featured: !!editProject.featured,
        startDate: formatDate(editProject.startDate),
        endDate: formatDate(editProject.endDate),
      });
      setTechStack(editProject.techStack || []);
      setAchievements(editProject.achievements || []);
    } else {
      setForm(EMPTY_FORM);
      setTechStack([]);
      setAchievements([]);
    }
    setErrors({});
    setUploadError(null);
  }, [editProject, isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }, [errors]);

  // ─── Tech Stack Tags ───────────────────────────────────────────────────────
  const handleAddTech = (e) => {
    e.preventDefault();
    const tag = techInput.trim();
    if (tag && !techStack.includes(tag)) {
      setTechStack((prev) => [...prev, tag]);
      setTechInput('');
      if (errors.techStack) setErrors((prev) => ({ ...prev, techStack: null }));
    }
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech(e);
    }
  };

  const handleRemoveTech = (indexToRemove) => {
    setTechStack((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // ─── Achievements ──────────────────────────────────────────────────────────
  const handleAddAchievement = (e) => {
    e.preventDefault();
    const item = achInput.trim();
    if (item && !achievements.includes(item)) {
      setAchievements((prev) => [...prev, item]);
      setAchInput('');
    }
  };

  const handleRemoveAchievement = (indexToRemove) => {
    setAchievements((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // ─── Thumbnail Upload ──────────────────────────────────────────────────────
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const response = await profileService.uploadProjectThumbnail(file);
      if (response && response.success && response.data) {
        setForm((prev) => ({
          ...prev,
          thumbnailUrl: response.data.thumbnailUrl,
          thumbnailPublicId: response.data.thumbnailPublicId,
        }));
      } else {
        throw new Error('Upload response missing success confirmation');
      }
    } catch (err) {
      console.error('[Upload] Failed to upload thumbnail:', err);
      const errMsg = err.response?.data?.message || 'Failed to upload project thumbnail.';
      setUploadError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setForm((prev) => ({
      ...prev,
      thumbnailUrl: '',
      thumbnailPublicId: '',
    }));
    setUploadError(null);
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Project title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.status) errs.status = 'Status is required';

    const isValidUrl = (str) => {
      if (!str) return true;
      try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch (_) {
        return false;
      }
    };

    if (form.githubUrl && !isValidUrl(form.githubUrl)) {
      errs.githubUrl = 'Must be a valid URL (starting with http:// or https://)';
    }
    if (form.liveDemoUrl && !isValidUrl(form.liveDemoUrl)) {
      errs.liveDemoUrl = 'Must be a valid URL (starting with http:// or https://)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      techStack,
      achievements,
      githubUrl: form.githubUrl.trim(),
      liveDemoUrl: form.liveDemoUrl.trim(),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    onSave(payload);
  };

  const selectBase =
    'w-full px-4 py-3 rounded-xl bg-[#010c0c] border text-sm focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer';

  const inputBase =
    'w-full px-4 py-3 rounded-xl bg-[#010c0c] border text-[#e2f1f1] text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-[#3d5f5f]';
  const inputNormal = `${inputBase} border-[#083030] focus:border-[#085a5a] focus:ring-amber-500/40`;
  const inputError  = `${inputBase} border-red-500/50 focus:ring-red-500/40`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Panel Container */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-2xl rounded-3xl border border-[#085a5a] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] shadow-2xl shadow-black/70 overflow-hidden my-8">
              
              {/* Header decoration glow */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-amber-500/6 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/6 blur-3xl" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#083535]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Briefcase size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#e2f1f1] tracking-wide">
                      {editProject ? 'Edit Project Details' : 'Add Professional Project'}
                    </h2>
                    <p className="text-[10px] text-[#5e8888] font-mono">
                      {editProject ? `Editing ID: ${editProject._id}` : 'Create a showcase item for your dashboard'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-[#084848] bg-[#011414] hover:bg-[#033c3c] text-[#7da3a3] hover:text-[#e2f1f1] transition-all active:scale-90"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Error Banners */}
              {apiError && (
                <div className="mx-6 mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="px-6 py-5 space-y-6">

                  {/* Primary Grid: Title + Tagline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Project Title */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-title" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Project Title <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="modal-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. ProfileHub Portal"
                        className={errors.title ? inputError : inputNormal}
                      />
                      {errors.title && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Tagline */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-tagline" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Tagline <span className="text-[#3d5f5f] font-normal normal-case">(brief pitch)</span>
                      </label>
                      <input
                        id="modal-tagline"
                        type="text"
                        name="tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        placeholder="e.g. Modern developer profile aggregator"
                        className={inputNormal}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-description" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Description <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="modal-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Explain features, challenges, and implementation details..."
                      className={errors.description ? `${inputError} resize-none` : `${inputNormal} resize-none`}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                        <AlertTriangle size={11} /> {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category & Status Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Category */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-category" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Category <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="modal-category"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className={`${selectBase} pr-9 ${
                            errors.category
                              ? 'border-red-500/50 text-[#e2f1f1] focus:ring-red-500/40'
                              : 'border-[#083030] text-[#e2f1f1] focus:border-[#085a5a] focus:ring-amber-500/40'
                          }`}
                        >
                          <option value="" disabled className="bg-[#010c0c] text-[#3d5f5f]">Select Category…</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#010c0c]">{cat}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                      </div>
                      {errors.category && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-status" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Status <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="modal-status"
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className={`${selectBase} pr-9 ${
                            errors.status
                              ? 'border-red-500/50 text-[#e2f1f1] focus:ring-red-500/40'
                              : 'border-[#083030] text-[#e2f1f1] focus:border-[#085a5a] focus:ring-amber-500/40'
                          }`}
                        >
                          <option value="" disabled className="bg-[#010c0c] text-[#3d5f5f]">Select Status…</option>
                          {STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-[#010c0c]">{st}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                      </div>
                      {errors.status && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.status}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack Chip Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-techInput" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Tech Stack <span className="text-[#3d5f5f] font-normal normal-case">(Press Enter or Comma to add)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-2.5 min-h-[46px] rounded-xl border border-[#083030] bg-[#010c0c] focus-within:border-[#085a5a] transition-all">
                      <AnimatePresence>
                        {techStack.map((tech, idx) => (
                          <motion.span
                            key={tech}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#022424] border border-[#084848] text-xs font-medium text-[#e2f1f1] select-none"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(idx)}
                              className="text-[#7da3a3] hover:text-red-400 hover:scale-105 active:scale-95 transition-all"
                            >
                              <X size={11} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      <input
                        id="modal-techInput"
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder={techStack.length === 0 ? "e.g. NextJS, Tailwind, Redis" : ""}
                        className="flex-1 bg-transparent border-none text-[#e2f1f1] text-xs focus:outline-none min-w-[120px] placeholder:text-[#3d5f5f] py-0.5"
                      />
                    </div>
                  </div>

                  {/* Achievements List Builder */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-achInput" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Key Accomplishments / Achievements
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="modal-achInput"
                        type="text"
                        value={achInput}
                        onChange={(e) => setAchInput(e.target.value)}
                        placeholder="e.g. Built fully responsive UI reducing loading times by 40%..."
                        className="flex-1 px-4 py-3 rounded-xl bg-[#010c0c] border border-[#083030] text-xs focus:outline-none focus:border-[#085a5a] focus:ring-1 focus:ring-amber-500/20 text-[#e2f1f1] placeholder:text-[#3d5f5f]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAchievement}
                        className="px-4 rounded-xl bg-[#022424] border border-[#084848] text-xs font-bold text-amber-400 hover:bg-[#033c3c] active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>

                    {/* Render bullets */}
                    {achievements.length > 0 && (
                      <ul className="space-y-2 mt-3 p-3 rounded-2xl bg-[#010c0c]/40 border border-[#083535]">
                        {achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-3 text-xs text-[#94b3b3]">
                            <div className="flex gap-2.5 mt-0.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span className="leading-relaxed">{ach}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAchievement(idx)}
                              className="p-1 rounded text-[#7da3a3] hover:text-red-400 transition-colors shrink-0"
                              title="Delete bullet"
                            >
                              <Trash2 size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Date Range Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Start Date */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-startDate" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          id="modal-startDate"
                          type="date"
                          name="startDate"
                          value={form.startDate}
                          onChange={handleChange}
                          className={`${inputNormal} pl-10`}
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-endDate" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        End Date <span className="text-[#3d5f5f] font-normal normal-case">(Leave empty if ongoing)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          id="modal-endDate"
                          type="date"
                          name="endDate"
                          value={form.endDate}
                          onChange={handleChange}
                          className={`${inputNormal} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* URLs Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* GitHub URL */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-githubUrl" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        GitHub Link
                      </label>
                      <div className="relative">
                        <Github size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          id="modal-githubUrl"
                          type="url"
                          name="githubUrl"
                          value={form.githubUrl}
                          onChange={handleChange}
                          placeholder="https://github.com/..."
                          className={errors.githubUrl ? `${inputError} pl-10` : `${inputNormal} pl-10`}
                        />
                      </div>
                      {errors.githubUrl && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.githubUrl}
                        </p>
                      )}
                    </div>

                    {/* Live Demo URL */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-liveDemoUrl" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Live Demo Link
                      </label>
                      <div className="relative">
                        <Link size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          id="modal-liveDemoUrl"
                          type="url"
                          name="liveDemoUrl"
                          value={form.liveDemoUrl}
                          onChange={handleChange}
                          placeholder="https://myportal.com"
                          className={errors.liveDemoUrl ? `${inputError} pl-10` : `${inputNormal} pl-10`}
                        />
                      </div>
                      {errors.liveDemoUrl && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.liveDemoUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Image upload box */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Project Thumbnail
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 rounded-2xl border border-[#083030] bg-[#010c0c] hover:border-[#084848] transition-colors relative">
                      
                      {/* Image Preview Container */}
                      <div className="relative w-36 h-20 rounded-xl bg-[#022424]/30 border border-[#083535] shrink-0 overflow-hidden flex items-center justify-center select-none">
                        {form.thumbnailUrl ? (
                          <img
                            src={form.thumbnailUrl}
                            alt="Project Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[#3d5f5f]">
                            <ImageIcon size={20} />
                            <span className="text-[9px] uppercase font-bold tracking-wider">No Image</span>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 size={16} className="text-amber-400 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            disabled={uploading}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] text-xs font-bold active:scale-95 transition-all shadow-md shadow-amber-950/20 disabled:opacity-50"
                          >
                            <ImageIcon size={13} />
                            {form.thumbnailUrl ? 'Change Image' : 'Upload Image'}
                          </button>
                          {form.thumbnailUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveThumbnail}
                              disabled={uploading}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-900/20 text-xs font-bold text-red-300 active:scale-95 transition-all"
                            >
                              <Trash2 size={13} />
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-[#5e8888] leading-relaxed">
                          Recommended ratio 8:5 (e.g. 800x500). Max size 5 MB. format JPG, PNG, WEBP.
                        </p>
                        {uploadError && (
                          <p className="text-xs text-red-400 font-medium flex items-center gap-1 justify-center sm:justify-start">
                            <AlertTriangle size={11} /> {uploadError}
                          </p>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Featured checkbox widget */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                    <div className="relative flex items-center justify-center w-5 h-5 shrink-0 select-none">
                      <input
                        id="modal-featured"
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                        className="peer w-5 h-5 opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-0 rounded bg-[#010c0c] border border-amber-500/40 peer-checked:bg-amber-500 peer-checked:border-transparent transition-all pointer-events-none flex items-center justify-center">
                        <Check size={12} className="text-[#011414] font-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <label htmlFor="modal-featured" className="flex-1 cursor-pointer select-none">
                      <span className="block text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles size={12} />
                        Feature this project
                      </span>
                      <span className="block text-[10px] text-[#7da3a3] mt-0.5 leading-relaxed">
                        Makes this project display inside the primary Dashboard hero area. Un-features any previously featured project.
                      </span>
                    </label>
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-end gap-3 border-t border-[#083535]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl border border-[#084848] bg-[#011414] hover:bg-[#022424] text-xs font-bold text-[#7da3a3] hover:text-[#e2f1f1] active:scale-95 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] font-bold text-xs shadow-md shadow-amber-950/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        {editProject ? 'Update Project' : 'Save Project'}
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
