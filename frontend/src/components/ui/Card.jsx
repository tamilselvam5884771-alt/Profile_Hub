import React from 'react';

/**
 * Reusable Card Component
 * 
 * Provides a standardized visual panel matching ProfileHub's premium dark emerald theme.
 * 
 * Props:
 * @param {React.ReactNode} children - Core contents of the card panel
 * @param {string} title - Optional title text for the header
 * @param {string} subtitle - Optional secondary label text below the title
 * @param {React.ReactNode} action - Optional button or element rendered in the header's right corner
 * @param {string} className - Optional Tailwind class overrides
 * @param {string} padding - Controls inner content padding ('sm' | 'md' | 'lg')
 * @param {boolean} hoverEffect - Toggle elevation and border highlighting on mouse hover
 */
export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = 'md',
  hoverEffect = true,
  ...props
}) {
  // Padding dimensions map
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        rounded-[20px] 
        bg-gradient-to-br from-[#011414] to-[#010a0a] 
        border border-[#083030]/60 
        shadow-lg shadow-black/30 
        text-[#e2f1f1] 
        transition-all duration-200 ease-in-out
        ${hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 hover:border-[#0c4e4e]' : ''}
        ${paddingMap[padding] || paddingMap.md}
        ${className}
      `}
      {...props}
    >
      {/* Optional Header Layout: Render if Title, Subtitle, or Action is provided */}
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-[#083030]/30">
          <div className="space-y-1">
            {title && (
              <h3 className="text-base font-bold tracking-wide text-[#e2f1f1]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#7da3a3] font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="flex items-center shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Card Content Wrapper */}
      <div className="text-sm leading-relaxed text-[#c1d9d9]">
        {children}
      </div>
    </div>
  );
}
