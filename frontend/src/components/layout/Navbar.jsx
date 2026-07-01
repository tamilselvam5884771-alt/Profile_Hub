import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

/**
 * Navbar Component
 * 
 * Props:
 * @param {function} onToggleSidebar - Callback to open the sidebar drawer (for mobile/tablet screens)
 * @param {Object} currentUser - User information { name, role, avatar }
 */
export default function Navbar({
  onToggleSidebar,
  currentUser = {
    name: 'Alex Morgan',
    role: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  },
}) {
  const [isDark, setIsDark] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for dropdown accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#083030]/60 bg-[#011414]/85 px-6 backdrop-blur-md text-[#e2f1f1]">
      
      {/* Left Section: Sidebar toggle & Hamburger menu */}
      <div className="flex items-center gap-4">
        {/* Toggle Button: visible only on tablet/mobile screens (< lg) */}
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#084848] bg-[#022424]/40 text-emerald-400 hover:bg-[#033c3c]/60 hover:text-amber-400 active:scale-95 transition-all lg:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Small greeting or segment (Visible on desktop) */}
        <div className="hidden lg:block">
          <h1 className="text-sm font-medium text-[#7da3a3]">Welcome back,</h1>
          <p className="text-base font-bold text-[#e2f1f1]">{currentUser.name}</p>
        </div>
      </div>

      {/* Center Section: Large premium responsive Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-[#558888] group-focus-within:text-amber-400 transition-colors duration-200">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search projects, skills, certifications..."
            className="w-full h-11 pl-12 pr-4 rounded-xl border border-[#083535] bg-[#021f1f]/50 text-sm text-[#e2f1f1] placeholder-[#558888] focus:border-amber-500/80 focus:bg-[#021f1f] focus:outline-none focus:ring-1 focus:ring-amber-500/50 group-hover:border-[#0c4e4e] transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile dropdown */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle (Light/Dark Switcher Dummy) */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#083030]/60 bg-[#022424]/20 text-[#94b3b3] hover:border-[#084848] hover:bg-[#022424] hover:text-amber-400 transition-all duration-200"
          aria-label="Toggle Visual Theme Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell with Badge and Hover Animate */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#083030]/60 bg-[#022424]/20 text-[#94b3b3] hover:border-[#084848] hover:bg-[#022424] hover:text-amber-400 transition-all duration-200 group"
          aria-label="View system notifications"
        >
          <Bell size={18} className="group-hover:animate-[wiggle_0.4s_ease-in-out_infinite]" />
          
          {hasNotifications && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </button>

        {/* Horizontal Divider */}
        <div className="h-6 w-px bg-[#083030]/60 mx-1"></div>

        {/* User Profile Info & Dropdown Trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl border border-transparent hover:border-[#083030]/60 hover:bg-[#022424]/25 transition-all duration-200"
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-label="Open User Menu Account Settings"
          >
            {/* User Avatar */}
            <img
              src={currentUser.avatar}
              alt={`${currentUser.name}'s Profile Avatar`}
              className="h-9 w-9 rounded-lg object-cover ring-2 ring-emerald-500/40"
            />
            
            {/* User Details (Hidden on tiny screens) */}
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold text-[#e2f1f1] flex items-center gap-1">
                {currentUser.name}
                <ChevronDown size={14} className={`text-[#7da3a3] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">{currentUser.role}</div>
            </div>
          </button>

          {/* Accessible Dropdown Menu Panel */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              onKeyDown={handleKeyDown}
              className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-[#084848] bg-[#011414] p-2 text-[#e2f1f1] shadow-2xl shadow-black/80 ring-1 ring-black/10 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150"
              role="menu"
              aria-orientation="vertical"
            >
              {/* Header profile info (mobile preview) */}
              <div className="block sm:hidden px-3 py-2 border-b border-[#083030]/50 mb-1">
                <div className="text-sm font-bold text-[#e2f1f1]">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase">{currentUser.role}</div>
              </div>

              {/* Menu Item: My Profile */}
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-[#94b3b3] hover:text-[#f3fbfb] hover:bg-[#032e2e]/50 transition-colors"
                role="menuitem"
              >
                <User size={16} className="text-emerald-400" />
                My Profile
              </button>

              {/* Menu Item: Settings */}
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-[#94b3b3] hover:text-[#f3fbfb] hover:bg-[#032e2e]/50 transition-colors"
                role="menuitem"
              >
                <Settings size={16} className="text-[#7da3a3]" />
                Settings
              </button>

              {/* Horizontal Separator */}
              <div className="my-1.5 h-px bg-[#083030]/50"></div>

              {/* Menu Item: Logout */}
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
                role="menuitem"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Inline animations defined in CSS config style injection */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
      `}</style>
    </header>
  );
}
