import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Code2,
  ChevronDown,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Programming Language',
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'AI / Machine Learning',
  'Mobile',
  'Tools',
  'Soft Skills',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LEVEL_META = {
  Beginner:     { color: 'text-sky-400',     ring: 'ring-sky-500/40',     bg: 'bg-sky-500/10'     },
  Intermediate: { color: 'text-amber-400',   ring: 'ring-amber-500/40',   bg: 'bg-amber-500/10'   },
  Advanced:     { color: 'text-emerald-400', ring: 'ring-emerald-500/40', bg: 'bg-emerald-500/10' },
  Expert:       { color: 'text-purple-400',  ring: 'ring-purple-500/40',  bg: 'bg-purple-500/10'  },
};

const EMPTY_FORM = {
  skillName: '',
  category: '',
  level: '',
  experienceValue: '',
  experienceUnit: 'Months',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SkillModal
 * Renders a premium animated add/edit modal for Professional Skills.
 *
 * Props:
 *   isOpen      {boolean}      — controls visibility
 *   onClose     {function}     — called when user cancels or closes
 *   onSave      {function}     — called with skill payload on submit
 *   editSkill   {Object|null}  — if provided, pre-fills the form for editing
 *   saving      {boolean}      — shows loading state on Save button
 *   apiError    {string|null}  — surface server-side error inside modal
 */
export default function SkillModal({ isOpen, onClose, onSave, editSkill = null, saving = false, apiError = null }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing an existing skill
  useEffect(() => {
    if (editSkill) {
      setForm({
        skillName: editSkill.skillName || '',
        category: editSkill.category || '',
        level: editSkill.level || '',
        experienceValue: editSkill.experience?.value != null ? String(editSkill.experience.value) : '',
        experienceUnit: editSkill.experience?.unit || 'Months',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editSkill, isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }, [errors]);

  const validate = () => {
    const errs = {};
    if (!form.skillName.trim()) errs.skillName = 'Skill name is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.level) errs.level = 'Level is required';
    if (form.experienceValue !== '') {
      const num = Number(form.experienceValue);
      if (isNaN(num) || num < 0) errs.experienceValue = 'Must be a non-negative number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      skillName: form.skillName.trim(),
      category: form.category,
      level: form.level,
      experience: {
        value: form.experienceValue !== '' ? Number(form.experienceValue) : null,
        unit: form.experienceValue !== '' ? form.experienceUnit : null,
      },
    };

    onSave(payload);
  };

  const selectedLevelMeta = LEVEL_META[form.level] || null;

  // ─── Input class helpers ───────────────────────────────────────────────────
  const inputBase =
    'w-full px-4 py-3 rounded-xl bg-[#010c0c] border text-[#e2f1f1] text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-[#3d5f5f]';
  const inputNormal = `${inputBase} border-[#083030] focus:border-[#085a5a] focus:ring-amber-500/40`;
  const inputError  = `${inputBase} border-red-500/50 focus:ring-red-500/40`;

  const selectBase =
    'w-full px-4 py-3 rounded-xl bg-[#010c0c] border text-sm focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer';

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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg rounded-3xl border border-[#085a5a] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] shadow-2xl shadow-black/60 overflow-hidden">
              
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-amber-500/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/8 blur-3xl" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#083535]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Code2 size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#e2f1f1] tracking-wide">
                      {editSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h2>
                    <p className="text-[10px] text-[#5e8888] font-mono">
                      {editSkill ? `Editing: ${editSkill.skillName}` : 'Add a skill to your professional profile'}
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

              {/* Server-side error */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs"
                  >
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-6 py-5 space-y-5">

                  {/* Skill Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-skillName" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Skill Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      id="modal-skillName"
                      type="text"
                      name="skillName"
                      value={form.skillName}
                      onChange={handleChange}
                      placeholder="e.g. React, Python, Kubernetes..."
                      autoFocus
                      className={errors.skillName ? inputError : inputNormal}
                    />
                    {errors.skillName && (
                      <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                        <AlertTriangle size={11} /> {errors.skillName}
                      </p>
                    )}
                  </div>

                  {/* Category + Level row */}
                  <div className="grid grid-cols-2 gap-4">

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
                          <option value="" disabled className="bg-[#010c0c] text-[#3d5f5f]">Select…</option>
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

                    {/* Level */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-level" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Level <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="modal-level"
                          name="level"
                          value={form.level}
                          onChange={handleChange}
                          className={`${selectBase} pr-9 ${
                            errors.level
                              ? 'border-red-500/50 text-[#e2f1f1] focus:ring-red-500/40'
                              : selectedLevelMeta
                                ? `border-[#083030] focus:border-[#085a5a] focus:ring-amber-500/40 ${selectedLevelMeta.color}`
                                : 'border-[#083030] text-[#3d5f5f] focus:border-[#085a5a] focus:ring-amber-500/40'
                          }`}
                        >
                          <option value="" disabled className="bg-[#010c0c] text-[#3d5f5f]">Select…</option>
                          {LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl} className={`bg-[#010c0c] ${LEVEL_META[lvl].color}`}>{lvl}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                      </div>
                      {errors.level && (
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={11} /> {errors.level}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Experience row */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Experience <span className="text-[#3d5f5f] font-normal normal-case">(optional)</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          id="modal-experienceValue"
                          type="number"
                          name="experienceValue"
                          value={form.experienceValue}
                          onChange={handleChange}
                          placeholder="e.g. 2"
                          min="0"
                          step="0.5"
                          className={errors.experienceValue ? inputError : inputNormal}
                        />
                        {errors.experienceValue && (
                          <p className="text-xs text-red-400 font-medium mt-1 flex items-center gap-1">
                            <AlertTriangle size={11} /> {errors.experienceValue}
                          </p>
                        )}
                      </div>
                      <div className="relative w-32 shrink-0">
                        <select
                          id="modal-experienceUnit"
                          name="experienceUnit"
                          value={form.experienceUnit}
                          onChange={handleChange}
                          className={`${selectBase} pr-8 border-[#083030] text-[#e2f1f1] focus:border-[#085a5a] focus:ring-amber-500/40`}
                        >
                          <option value="Months" className="bg-[#010c0c]">Months</option>
                          <option value="Years" className="bg-[#010c0c]">Years</option>
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                      </div>
                    </div>
                  </div>

                  {/* Level preview pill */}
                  {form.level && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ${selectedLevelMeta.bg} ${selectedLevelMeta.color} ${selectedLevelMeta.ring}`}
                    >
                      <Sparkles size={11} />
                      {form.level} level selected
                    </motion.div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3 border-t border-[#083535]">
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
                    disabled={saving}
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
                        {editSkill ? 'Update Skill' : 'Save Skill'}
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
