import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Hexagon, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering with:', formData);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#021d1e] via-[#042c2e] to-[#073630] flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Background Decorative Tech Glow Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#0b3c33]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Split */}
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-4 lg:gap-12 items-center z-10">
        
        {/* LEFT SIDE: Re-arranged Logo, Side Tree & Bottom Quote */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full h-full min-h-[450px] flex flex-col justify-between p-6 md:p-8"
        >
          {/* Main Layout Group: Hexagon Badge on Left, Tree Graphic on Right */}
          <div className="flex flex-row items-center justify-between w-full relative mt-8">
            
            {/* ProfileHub Custom Central Hexagon Logo (Left Aligned) */}
            <div className="flex flex-col items-start space-y-4 z-10">
              <div className="relative w-36 h-36 flex items-center justify-center text-amber-400 drop-shadow-[0_4px_12px_rgba(212,175,55,0.2)]">
                <Hexagon className="absolute w-full h-full stroke-[1.5]" />
                {/* Node dots on the hexagon corners */}
                <div className="absolute -top-1 w-4 h-4 bg-amber-400 rounded-full border border-teal-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-teal-950 rounded-full" />
                </div>
                <div className="absolute bottom-3 -left-1 w-4 h-4 bg-amber-400 rounded-full border border-teal-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-teal-950 rounded-full" />
                </div>
                <div className="absolute bottom-3 -right-1 w-4 h-4 bg-amber-400 rounded-full border border-teal-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-teal-950 rounded-full" />
                </div>
                <UserPlus className="w-14 h-14 stroke-[1.2]" />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-md font-sans">
                PROFILEHUB
              </h1>
            </div>

            {/* Digital Network Tree (Right Aligned next to Logo) */}
            <div className="absolute right-0 top-[-40px] w-64 h-80 opacity-80 md:opacity-100 pointer-events-none flex items-center justify-end">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M90,100 C80,80 85,50 65,40 C55,35 45,30 40,15" strokeWidth="2" strokeLinecap="round"/>
                <path d="M85,100 C78,75 70,60 55,55 C45,50 35,45 28,30" strokeWidth="1.5"/>
                <path d="M65,40 C50,30 35,35 25,25" />
                <path d="M55,55 C40,48 30,55 15,50" />
                <path d="M40,15 C35,8 20,5 10,12" />
                <path d="M65,40 C75,25 65,10 50,5" />
                <circle cx="25" cy="25" r="2" fill="currentColor" />
                <circle cx="15" cy="50" r="2" fill="currentColor" />
                <circle cx="10" cy="12" r="1.5" fill="currentColor" />
                <circle cx="50" cy="5" r="2" fill="currentColor" />
                <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                <circle cx="45" cy="20" r="2" fill="currentColor" />
                <circle cx="35" cy="45" r="1.5" fill="currentColor" />
                <circle cx="20" cy="35" r="1" fill="currentColor" />
                <line x1="25" y1="25" x2="30" y2="30" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="15" y1="50" x2="35" y2="45" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="45" y1="20" x2="40" y2="15" strokeWidth="0.5" strokeDasharray="1,1" />
              </svg>
            </div>
          </div>

          {/* Inspirational Quote at the Bottom Left */}
          <div className="mt-12 max-w-md">
            <p className="text-xl md:text-2xl font-light tracking-wide text-amber-200/90 italic font-serif leading-relaxed">
              "To succeed in your mission, you must have single-minded devotion to your goal."
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Perfect Premium Glassmorphic Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto bg-gradient-to-b from-teal-950/40 to-emerald-950/60 rounded-2xl p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-amber-500/20 backdrop-blur-xl relative group"
        >
          {/* Glowing Aura Effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-amber-500/10 rounded-2xl opacity-100 blur-sm pointer-events-none" />

          {/* Card Header */}
          <div className="text-center mb-6 relative">
            <h2 className="text-2xl md:text-3xl font-medium tracking-widest bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent">
              CREATE ACCOUNT
            </h2>
            <p className="text-xs text-teal-300/50 mt-1 tracking-wider font-mono">
              Powered by ProfileHub & Gemini Intelligence
            </p>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            
            {/* Full Name Field Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/60 font-medium pl-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-400/60">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 bg-teal-950/60 border border-teal-800/60 rounded-xl text-amber-100 placeholder-teal-400/20 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Email Field Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/60 font-medium pl-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-400/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="enter your registered email"
                  className="w-full pl-10 pr-4 py-2.5 bg-teal-950/60 border border-teal-800/60 rounded-xl text-amber-100 placeholder-teal-400/20 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Password Field Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/60 font-medium pl-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-400/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-teal-950/60 border border-teal-800/60 rounded-xl text-amber-100 placeholder-teal-400/20 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-teal-400/40 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/60 font-medium pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-400/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-teal-950/60 border border-teal-800/60 rounded-xl text-amber-100 placeholder-teal-400/20 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-teal-400/40 hover:text-amber-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Agree Terms Checkbox */}
            <div className="flex items-start gap-2 text-xs pt-1 select-none">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="accent-amber-400 rounded bg-teal-950 border-teal-800 mt-0.5 focus:ring-0"
              />
              <label htmlFor="agreeTerms" className="text-teal-300/60 cursor-pointer">
                I agree to the{' '}
                <a href="#terms" className="text-amber-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" className="text-amber-400 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Styled Access Button with Inner Glow styling */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-teal-950 font-bold tracking-widest uppercase rounded-xl shadow-lg border border-amber-300/20 text-xs"
            >
              CREATE MY HUB
            </motion.button>

            {/* Bottom Login Redirect Link */}
            <div className="text-center text-xs text-teal-300/50 pt-2 border-t border-teal-900/40">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:underline font-medium ml-1">
                Log In
              </Link>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
}
