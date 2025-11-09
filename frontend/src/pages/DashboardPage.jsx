import { useState, useCallback } from 'react';
import DashboardNavbar from '../components/Dashboard/Navbar';
import OnlineUsersSidebar from '../components/Dashboard/OnlineUsersSidebar';
import InstancesGrid from '../components/Dashboard/InstancesGrid';
import ProductivityToolbar from '../components/Dashboard/ProductivityToolbar';
import AnimatedBackground from '../components/AnimatedBackground';
import useNotifications from '../hooks/useNotifications';

/**
 * Dashboard Page Component
 * Main dashboard view combining all dashboard components
 * Requirements: 4.1, 4.2, 4.4, 4.5, 4.6
 */
export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize notifications hook to listen for socket events
  useNotifications();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-bg">
      {/* AnimatedBackground with dashboard variant */}
      <AnimatedBackground variant="dashboard" intensity={1} />

      {/* Navbar at top with glass effect */}
      <div className="relative z-sticky">
        <DashboardNavbar onSearch={handleSearch} showSearch={true} />
      </div>

      {/* Main Content Area - Responsive layout */}
      <div className="flex relative z-base min-h-screen">
        {/* Main Content - InstancesGrid */}
        <main 
          id="main-content" 
          className="flex-1 p-6 sm:p-8 lg:p-12 pb-32 overflow-y-auto fade-in" 
          role="main"
          style={{ marginTop: '80px' }}
        >
          <div className="max-w-[1600px] mx-auto">
            <InstancesGrid searchQuery={searchQuery} />
          </div>
        </main>

        {/* OnlineUsersSidebar - Collapsible on mobile */}
        <OnlineUsersSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* ProductivityToolbar at bottom */}
      <ProductivityToolbar />
    </div>
  );
}
