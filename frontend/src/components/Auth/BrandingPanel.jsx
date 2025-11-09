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
    <div className="glass-container p-10 sm:p-12 lg:p-16 h-full flex flex-col min-h-[700px]">
      {/* Logo & Title */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Collab Notes
          </h1>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </h2>
        <p className="text-slate-700 text-xl font-medium leading-relaxed">
          {isLogin ? 'Continue your collaborative journey' : 'Start collaborating with your team'}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-12 flex-1">
        <div className="flex items-start gap-6 slide-in">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-md">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 mb-3 text-xl">Real-time Collaboration</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Collaborate with your team in real-time with seamless synchronization
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6 slide-in delay-100">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(179, 229, 252, 0.8) 0%, rgba(255, 224, 178, 0.8) 100%)',
            }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 mb-3 text-xl">AI-Powered Assistance</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Smart summaries and intelligent suggestions to boost productivity
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6 slide-in delay-200">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 224, 178, 0.8) 0%, rgba(255, 171, 145, 0.8) 100%)',
            }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 mb-3 text-xl">Secure & Private</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Enterprise-grade security to keep your data safe and protected
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="mt-16 pt-12 border-t border-white/30">
        <p className="text-lg text-slate-700 italic font-medium leading-relaxed">
          "The best collaboration tool we've ever used. Simple, powerful, and beautiful."
        </p>
        <p className="text-base text-slate-600 mt-5 font-medium">— Happy User</p>
      </div>
    </div>
  );
};

export default BrandingPanel;
