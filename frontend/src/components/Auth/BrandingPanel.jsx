import React from 'react';

/**
 * BrandingPanel Component
 * 
 * Displays branding, features, and testimonials for the authentication pages.
 * Content changes based on whether user is on login or signup mode.
 * 
 * @param {Object} props
 * @param {boolean} props.isLogin - Whether the current mode is login (vs signup)
 */
const BrandingPanel = ({ isLogin }) => {
  return (
    <div className="glass-container p-10 xl:p-14 fade-in">
      {/* Logo & Title */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold" style={{ 
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Collab Notes
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </h2>
        <p className="text-slate-600">
          {isLogin
            ? 'Continue your collaborative journey'
            : 'Start collaborating with your team'}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-8">
        <div className="flex items-start gap-5 slide-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Real-time Collaboration</h3>
            <p className="text-sm text-slate-600">Work together seamlessly with your team in real-time</p>
          </div>
        </div>

        <div className="flex items-start gap-5 slide-in delay-100">
          <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Interactive Whiteboards</h3>
            <p className="text-sm text-slate-600">Draw, sketch, and brainstorm visually together</p>
          </div>
        </div>

        <div className="flex items-start gap-5 slide-in delay-200">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md" 
            style={{
              background: 'linear-gradient(135deg, rgba(179, 229, 252, 0.8) 0%, rgba(255, 224, 178, 0.8) 100%)'
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">AI-Powered Assistance</h3>
            <p className="text-sm text-slate-600">Get smart summaries and intelligent suggestions</p>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="mt-10 pt-10 border-t border-white/30">
        <p className="text-sm text-slate-600 italic">
          "The best collaboration tool we've ever used. Simple, powerful, and beautiful."
        </p>
        <p className="text-xs text-slate-500 mt-2">— Happy User</p>
      </div>
    </div>
  );
};

export default BrandingPanel;
