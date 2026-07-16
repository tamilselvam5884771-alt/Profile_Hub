import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Code2,
  Briefcase,
  Award,
  FileText,
  BarChart3,
  Settings,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

/**
 * Menu item array for scalability and reuse.
 * Holds name, path, and Lucide icon component.
 */
const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Coding Profiles', path: '/coding-profiles', icon: Code2 },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Certifications', path: '/certifications', icon: Award },
  { name: 'Resume', path: '/resume', icon: FileText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

/**
 * Sidebar Component
 * 
 * Props:
 * @param {boolean} isOpen - Controls visibility on mobile drawer mode
 * @param {function} onClose - Callback to close the mobile drawer
 * @param {number} profileCompletion - Percentage of profile completion (0 to 100)
 */
export default function Sidebar({ isOpen, onClose, profileCompletion = 70 }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior programmatically
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsMobile(true);
        setIsCollapsed(false);
      } else if (width >= 768 && width < 1024) {
        setIsMobile(false);
        setIsCollapsed(true); // Default collapsed on tablet
      } else {
        setIsMobile(false);
        setIsCollapsed(false); // Default expanded on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Circular progress dimensions
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  return (
    <>
      {/* 1. Backdrop Overlay for Mobile Drawer */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 2. Main Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-[#011414] to-[#010c0c] border-r border-[#083030] text-[#e2f1f1] transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
        `}
      >
        {/* Collapse Button (Only shown on Desktop/Tablet) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-6 -right-3.5 flex items-center justify-center w-7 w-7 rounded-full bg-[#022424] hover:bg-[#033c3c] border border-[#084848] text-amber-500 shadow-md shadow-black/40 hover:scale-105 transition-all duration-200"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Top Header Section: Logo + Brand Name */}
        <div className={`flex items-center px-6 py-6 border-b border-[#083030]/60 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            {/* Styled Shield/Hexagon Logo using Inline SVG */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-950/40">
              <div className="flex items-center justify-center w-full h-full rounded-[10px] bg-[#011414]">
                <svg
                  className="w-5 h-5 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="12" y1="12" x2="22" y2="8.5" />
                  <line x1="12" y1="12" x2="2" y2="8.5" />
                </svg>
              </div>
              {/* Pulsing indicator */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#011414] animate-pulse" />
            </div>

            {/* Brand Title (Hidden when collapsed) */}
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-[#e2f1f1] to-amber-200 bg-clip-text text-transparent">
                Profile<span className="text-amber-500 font-extrabold">Hub</span>
              </span>
            )}
          </div>

          {/* Close button inside mobile drawer */}
          {isMobile && isOpen && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-400 hover:bg-[#032e2e]/50 hover:text-amber-400 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Middle Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium tracking-wide transition-all duration-200 ease-in-out group
                  ${isCollapsed ? 'justify-center px-0' : ''}
                  ${isActive
                    ? 'bg-gradient-to-r from-[#032e2e]/80 to-[#011b1b]/20 border-l-[3.5px] border-amber-500 text-amber-400 font-semibold shadow-[inset_4px_0_12px_rgba(245,158,11,0.05)] shadow-amber-950/20'
                    : 'text-[#94b3b3] hover:text-[#f3fbfb] hover:bg-[#032e2e]/45 hover:translate-x-0.5 border-l-[3.5px] border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={20}
                      className={`transition-colors duration-200
                        ${isActive ? 'text-amber-400' : 'text-[#7da3a3] group-hover:text-emerald-400'}
                      `}
                    />
                    
                    {!isCollapsed && <span>{item.name}</span>}

                    {/* Tooltip on Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-20 z-50 scale-0 group-hover:scale-100 px-3 py-1.5 rounded-lg bg-[#022424] border border-[#084848] text-amber-200 text-xs font-semibold tracking-wide whitespace-nowrap shadow-lg shadow-black/50 transition-all duration-150 origin-left">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Profile Completion Card */}
        <div className={`p-4 border-t border-[#083030]/60 ${isCollapsed ? 'flex justify-center py-6' : ''}`}>
          {isCollapsed ? (
            // Collapsed view: mini circular progress with hover details
            <div className="relative group flex items-center justify-center cursor-pointer">
              <svg className="w-12 h-12 transform -rotate-90">
                {/* Background track */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="transparent"
                  stroke="#042a2a"
                  strokeWidth="3.5"
                />
                {/* Active progress */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="transparent"
                  stroke="url(#goldGradient)"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={2 * Math.PI * 19 - (profileCompletion / 100) * (2 * Math.PI * 19)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-amber-400">{profileCompletion}%</span>

              {/* Tooltip on Hover */}
              <div className="absolute left-20 bottom-2 z-50 scale-0 group-hover:scale-100 p-4 rounded-xl bg-[#022424] border border-[#084848] text-xs shadow-xl shadow-black/60 transition-all duration-150 origin-bottom-left w-48">
                <div className="font-semibold text-[#e2f1f1] mb-1">Profile Strength</div>
                <div className="text-amber-400 font-bold mb-2">{profileCompletion}% Completed</div>
                <Link 
                  to="/profile" 
                  className="block w-full text-center py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] font-bold text-[10px] transition-all"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          ) : (
            // Expanded view: premium strength progress card
            <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#022424] to-[#011d1d] border border-[#084848] shadow-lg shadow-black/30">
              {/* Decorative radial overlay */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-4">
                {/* Circular Progress Circle SVG */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    {/* Background Track */}
                    <circle
                      cx="28"
                      cy="28"
                      r={radius}
                      fill="transparent"
                      stroke="#042a2a"
                      strokeWidth={strokeWidth}
                    />
                    {/* Accent Path */}
                    <circle
                      cx="28"
                      cy="28"
                      r={radius}
                      fill="transparent"
                      stroke="url(#goldGradient)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Inside Center Text */}
                  <span className="absolute text-xs font-black text-[#e2f1f1]">{profileCompletion}%</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#e2f1f1]">Setup Profile</h4>
                  <p className="text-xs text-[#7da3a3] mt-0.5">Increases search visibility</p>
                </div>
              </div>

              {/* Action Call-to-action button */}
              <Link 
                to="/profile" 
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-[#011414] font-bold text-xs shadow-md shadow-amber-950/20 hover:shadow-amber-500/10 active:scale-95 transition-all duration-200"
              >
                Complete Profile
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
