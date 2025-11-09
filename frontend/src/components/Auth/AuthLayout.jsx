import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../AnimatedBackground';
import BrandingPanel from './BrandingPanel';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthLayout = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();

  const handleSwitchToSignup = () => {
    setMode('signup');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Branding Panel - Order changes based on mode */}
          <div 
            className={`hidden lg:block transition-all ${isLogin ? 'lg:order-1' : 'lg:order-2'}`}
            style={{ 
              transitionDuration: '0.8s',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <BrandingPanel isLogin={isLogin} />
          </div>

          {/* Form Panel - Order changes based on mode */}
          <div 
            className={`transition-all ${isLogin ? 'lg:order-2' : 'lg:order-1'}`}
            style={{ 
              transitionDuration: '0.8s',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="glass-container p-8 sm:p-12 lg:p-14 scale-in">
              {isLogin ? (
                <LoginForm
                  onSwitchToSignup={handleSwitchToSignup}
                  onForgotPassword={handleForgotPassword}
                />
              ) : (
                <SignupForm onSwitchToLogin={handleSwitchToLogin} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Branding - Compact version */}
        <div className="lg:hidden text-center mt-10 glass-container p-8 fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold" style={{ 
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Collab Notes
            </h1>
          </div>
          <p className="text-sm text-slate-600">Collaborate in real-time with your team</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
