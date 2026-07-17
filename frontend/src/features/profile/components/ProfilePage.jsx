import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  MapPin,
  FileText,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Mail,
  Code2,
  ArrowRight,
  Lock,
  Camera,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import profileService from '../../../services/profileService';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import SkillsSection from './skills/SkillsSection';
import ProjectsSection from './projects/ProjectsSection';

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

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Layout states (matching Dashboard)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Photo upload states
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [photoSuccess, setPhotoSuccess] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  // Form fields state
  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    bio: '',
  });

  // Client-side inline validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Tab state
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await profileService.getMyProfile();
        if (response && response.success && response.data) {
          setProfile(response.data);
          setFormData({
            headline: response.data.headline || '',
            location: response.data.location || '',
            bio: response.data.bio || '',
          });
          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setIsNewProfile(true);
        } else {
          console.error('[ProfilePage] Error fetching profile:', err);
          setApiError(err.response?.data?.message || err.message || 'Failed to load profile details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Helper to retrieve initials for avatar fallback
  const getInitials = () => {
    const name = authUser?.name || 'Developer';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Trigger hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle local file validation and Cloudinary uploading
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoSuccess(null);

    // 1. Client-side Format Validation (JPG, JPEG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Invalid image format. Only JPG, JPEG, PNG, and WEBP are accepted.');
      return;
    }

    // 2. Client-side Size Validation (Max 5 MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setPhotoError('Image is too large. Maximum allowed size is 5 MB.');
      return;
    }

    // 3. Set local preview immediately for slick responsive feedback
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    setUploading(true);

    try {
      // Send request to profileService helper
      const response = await profileService.uploadAvatar(file);
      if (response && response.success && response.data) {
        setProfile(response.data); // Immediately update profile state to sync Navbar and local components
        setPhotoSuccess('Photo uploaded successfully!');
        setTimeout(() => setPhotoSuccess(null), 3000);
      }
    } catch (err) {
      console.error('[ProfilePage] Avatar upload failed:', err);
      setPhotoError(err.response?.data?.message || err.message || 'Failed to upload photo.');
      setLocalPreviewUrl(null); // Revert local preview on error
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle deleting the avatar
  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    setPhotoError(null);
    setPhotoSuccess(null);
    setUploading(true);

    try {
      const response = await profileService.removeAvatar();
      if (response && response.success && response.data) {
        setProfile(response.data); // Clear avatarUrl locally to update preview/Navbar in real time
        setLocalPreviewUrl(null);
        setPhotoSuccess('Photo removed successfully.');
        setTimeout(() => setPhotoSuccess(null), 3000);
      }
    } catch (err) {
      console.error('[ProfilePage] Avatar removal failed:', err);
      setPhotoError(err.response?.data?.message || err.message || 'Failed to remove photo.');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.headline || formData.headline.trim() === '') {
      errors.headline = 'Professional headline is required';
    } else if (formData.headline.trim().length < 3) {
      errors.headline = 'Headline must be at least 3 characters';
    }

    if (!formData.location || formData.location.trim() === '') {
      errors.location = 'Location is required';
    }

    if (!formData.bio || formData.bio.trim() === '') {
      errors.bio = 'Professional biography is required';
    } else if (formData.bio.trim().length < 10) {
      errors.bio = 'Bio must be at least 10 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Called by SkillsSection after any CRUD operation.
   * Merges the updated skills array back into local profile state so that
   * completion % and Navbar data stay in sync without a full page reload.
   */
  const handleSkillsChange = useCallback((updatedSkills) => {
    setProfile((prev) => prev ? { ...prev, skills: updatedSkills } : prev);
  }, []);

  /** Propagates project mutations back to local profile state so Dashboard stats stay in sync. */
  const handleProjectsChange = useCallback((updatedProjects) => {
    setProfile((prev) => prev ? { ...prev, projects: updatedProjects } : prev);
  }, []);

  const handleSave = async (redirectAfterSave = false) => {
    setApiError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return false;
    }

    setSaving(true);
    try {
      let result;
      const payload = {
        headline: formData.headline.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
      };

      if (isNewProfile) {
        result = await profileService.createProfile(payload);
        setIsNewProfile(false);
      } else {
        result = await profileService.updateProfile(payload);
      }

      if (result && result.success) {
        setProfile(result.data);
        setSuccessMessage('Profile saved successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);

        if (redirectAfterSave) {
          navigate('/dashboard');
        }
        return true;
      }
    } catch (err) {
      console.error('[ProfilePage] Error saving profile:', err);
      const errMsg = err.response?.data?.message || 'Failed to save profile.';
      const errList = err.response?.data?.errors;
      setApiError(errList && Array.isArray(errList) ? errList.join(', ') : errMsg);
    } finally {
      setSaving(false);
    }
    return false;
  };

  const tabItems = [
    { id: 'basic',          name: 'Basic Info',      icon: User,        locked: loading },
    { id: 'skills',         name: 'Skills',          icon: Code2,       locked: loading || isNewProfile },
    { id: 'projects',       name: 'Projects',        icon: Briefcase,   locked: loading || isNewProfile },
    { id: 'certifications', name: 'Certifications',  icon: CheckCircle, locked: true },
  ];

  const avatarUrl = localPreviewUrl || profile?.avatarUrl || profile?.profileImage;

  return (
    <div className="flex min-h-screen bg-[#021d1e] text-[#e2f1f1] overflow-hidden selection:bg-amber-500 selection:text-black">
      
      {/* 1. Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} profileCompletion={calculateCompletion(profile)} />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-20 lg:pl-72 transition-all duration-300 ease-in-out min-w-0">
        
        {/* Sticky Header Navbar (synchronizes state via profile prop) */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} profile={profile} />

        {/* Scrollable Layout Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Header section with back button */}
          <div className="flex items-center justify-between pb-4 border-b border-[#083030]/60">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl border border-[#084848] bg-[#011414] hover:bg-[#033c3c] text-amber-500 hover:scale-105 active:scale-95 transition-all duration-200"
                title="Back to Dashboard"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  {isNewProfile ? 'Create Profile' : 'Edit Profile'}
                </h1>
                <p className="text-xs text-[#7da3a3] font-mono">
                  {isNewProfile ? 'Step 1: Set up your base card' : 'Step 1: Keep details up to date'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-[#084848] bg-[#011414] hover:bg-[#022424] text-xs font-bold text-[#7da3a3] hover:text-[#e2f1f1] rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Alert Notifications */}
          <div className="space-y-3">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-sm shadow-md"
              >
                <CheckCircle size={18} />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-sm shadow-md"
              >
                <AlertTriangle size={18} />
                <span>{apiError}</span>
              </motion.div>
            )}
          </div>

          {/* Outer Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* LEFT Column: Tab Navigation */}
            <nav className="space-y-2 lg:col-span-1">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    disabled={tab.locked}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left text-sm font-medium tracking-wide transition-all border
                      ${isActive
                        ? 'bg-gradient-to-r from-[#032e2e] to-[#011414] border-amber-500/40 text-amber-400 shadow-md shadow-amber-950/10'
                        : tab.locked
                          ? 'bg-[#011414]/30 border-transparent text-[#5e7c7c] cursor-not-allowed opacity-60'
                          : 'bg-[#011414]/60 border-transparent text-[#94b3b3] hover:text-[#f3fbfb] hover:bg-[#032e2e]/40'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon size={18} className={isActive ? 'text-amber-400' : 'text-[#7da3a3]'} />
                      <span>{tab.name}</span>
                    </div>
                    {tab.locked && <Lock size={12} className="text-[#5e7c7c]" />}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT Column: Profile Forms */}
            <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl border border-[#083535] bg-gradient-to-br from-[#011414] via-[#011b1b] to-[#010909] shadow-xl relative overflow-hidden space-y-8">
              
              {loading ? (
                /* Glowing Skeleton of the form area */
                <div className="space-y-8 animate-pulse">
                  {/* Photo area skeleton */}
                  <div className="p-6 rounded-2xl border border-[#084848]/60 bg-[#022424]/10 space-y-4">
                    <div className="h-4 w-24 bg-[#032e2e] rounded" />
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[#032e2e]" />
                      <div className="flex-1 space-y-3 w-full">
                        <div className="h-10 w-36 bg-[#032e2e] rounded-xl" />
                        <div className="h-3 w-full max-w-sm bg-[#032e2e] rounded" />
                      </div>
                    </div>
                  </div>
                  {/* Fields skeletons */}
                  <div className="space-y-6">
                    <div className="h-6 w-36 bg-[#032e2e] rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="h-12 bg-[#032e2e] rounded-xl" />
                      <div className="h-12 bg-[#032e2e] rounded-xl" />
                      <div className="h-12 bg-[#032e2e] rounded-xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-12 bg-[#032e2e] rounded-xl" />
                      <div className="h-12 bg-[#032e2e] rounded-xl" />
                    </div>
                    <div className="h-32 bg-[#032e2e] rounded-xl" />
                  </div>
                </div>
              ) : (
                <>
                  {/* ── SKILLS TAB ─────────────────────────────────────────── */}
                  {activeTab === 'skills' && (
                    <SkillsSection
                      profile={profile}
                      onSkillsChange={handleSkillsChange}
                    />
                  )}

                  {/* ── PROJECTS TAB ────────────────────────────────────────── */}
                  {activeTab === 'projects' && (
                    <ProjectsSection
                      profile={profile}
                      onProjectsChange={handleProjectsChange}
                    />
                  )}

                  {/* ── BASIC TAB CONTENT ─────────────────────────────────────── */}
                  {activeTab === 'basic' && (
                  <>
              {/* PROFILE PHOTO SECTION */}
              <div className="p-6 rounded-2xl border border-[#084848] bg-[#022424]/10 backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-bold text-[#e2f1f1] uppercase tracking-wider">Profile Photo</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Photo Preview Container */}
                  <div className="relative group shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile Avatar Preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/40 shadow-lg group-hover:brightness-90 transition-all"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-teal-950 font-black flex items-center justify-center text-3xl border-2 border-amber-500/30 select-none shadow-lg">
                        {getInitials()}
                      </div>
                    )}

                    {/* Progress overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      
                      {/* Upload / Change Button */}
                      <button
                        type="button"
                        disabled={uploading || isNewProfile}
                        onClick={triggerFileInput}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 border
                          ${isNewProfile 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500/40 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] border-transparent shadow'
                          }
                        `}
                        title={isNewProfile ? 'Please fill & save basic profile info below before uploading photo' : ''}
                      >
                        <Camera size={14} />
                        {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                      </button>

                      {/* Remove Button */}
                      {avatarUrl && (
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-900/20 text-xs font-bold text-red-300 active:scale-95 transition-all"
                        >
                          <Trash2 size={14} />
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {/* Form Guidance */}
                    {isNewProfile ? (
                      <p className="text-[10px] text-amber-500/70 font-mono">
                        * Create and save your basic profile below before uploading an avatar.
                      </p>
                    ) : (
                      <p className="text-[10px] text-[#7da3a3] leading-relaxed">
                        Supports JPG, JPEG, PNG, or WEBP formats. Maximum upload size is 5 MB.
                      </p>
                    )}

                    {/* photo upload response feedback */}
                    {photoError && (
                      <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                        <AlertTriangle size={12} />
                        {photoError}
                      </p>
                    )}
                    {photoSuccess && (
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                        <CheckCircle size={12} />
                        {photoSuccess}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
              </div>

              {/* ── BASIC INFORMATION FORM ───────────────────────────── */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-[#e2f1f1] flex items-center gap-2.5">
                    <User size={20} className="text-amber-500" />
                    Basic Information
                  </h2>
                  <p className="text-xs text-[#7da3a3] mt-1 leading-relaxed">
                    Provide your primary branding and professional metadata for search queries.
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Read-Only Prefilled Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl border border-[#084848] bg-[#022424]/20 backdrop-blur-sm">
                    
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#010c0c]/80 border border-[#083030] text-[#94b3b3] text-sm select-none">
                        <User size={14} className="text-[#7da3a3]" />
                        <span>{authUser?.name || 'Developer'}</span>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Username
                      </label>
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#010c0c]/80 border border-[#083030] text-[#94b3b3] text-sm select-none">
                        <span className="text-[#7da3a3] font-mono">@</span>
                        <span>{authUser?.username || 'developer'}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#010c0c]/80 border border-[#083030] text-[#94b3b3] text-xs font-mono select-none">
                        <Mail size={14} className="text-[#7da3a3]" />
                        <span className="truncate">{authUser?.email || 'dev@profilehub.com'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editable Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Headline */}
                    <div className="space-y-2">
                      <label htmlFor="headline" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Professional Headline <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          type="text"
                          id="headline"
                          name="headline"
                          value={formData.headline}
                          onChange={handleInputChange}
                          placeholder="e.g. Senior Full-Stack Engineer @ Google"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#010c0c] border text-[#e2f1f1] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all
                            ${validationErrors.headline ? 'border-red-500/50 focus:ring-red-500' : 'border-[#083030] focus:border-[#085a5a]'}
                          `}
                        />
                      </div>
                      {validationErrors.headline && (
                        <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.headline}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                        Location <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7da3a3]" />
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g. San Francisco, CA (or Remote)"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#010c0c] border text-[#e2f1f1] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all
                            ${validationErrors.location ? 'border-red-500/50 focus:ring-red-500' : 'border-[#083030] focus:border-[#085a5a]'}
                          `}
                        />
                      </div>
                      {validationErrors.location && (
                        <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-xs font-bold text-[#7da3a3] uppercase tracking-wider">
                      Biography <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-4 top-4 text-[#7da3a3]" />
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us about your professional story, key technologies you love, and recent career highlights..."
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#010c0c] border text-[#e2f1f1] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none
                          ${validationErrors.bio ? 'border-red-500/50 focus:ring-red-500' : 'border-[#083030] focus:border-[#085a5a]'}
                        `}
                      />
                    </div>
                    {validationErrors.bio && (
                      <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.bio}</p>
                    )}
                  </div>
                </div>

                {/* Form Save Actions */}
                <div className="pt-6 border-t border-[#083030]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#084848] bg-[#011414] hover:bg-[#022424] text-xs font-bold text-[#7da3a3] hover:text-[#e2f1f1] active:scale-95 transition-all text-center"
                  >
                    Cancel & Back
                  </button>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                    
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSave(false)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#085a5a] bg-[#022424] hover:bg-[#033c3c] text-xs font-bold text-emerald-400 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed transition-all"
                    >
                      <Save size={14} />
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSave(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] font-bold text-xs shadow-md shadow-amber-950/20 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed transition-all"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                 </div>
               </div>
              </>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  </div>
</div>
  );
}
