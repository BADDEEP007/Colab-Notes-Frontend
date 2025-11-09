import { useState, useCallback } from 'react';
import DashboardNavbar from '../components/Dashboard/Navbar';
import OnlineUsersSidebar from '../components/Dashboard/OnlineUsersSidebar';
import InstancesGrid from '../components/Dashboard/InstancesGrid';
import ProductivityToolbar from '../components/Dashboard/ProductivityToolbar';
import AnimatedBackground from '../components/AnimatedBackground';
import useNotifications from '../hooks/useNotifications';
import styles from './DashboardPage.module.css';

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
    <div className={styles.container}>
      {/* AnimatedBackground with dashboard variant */}
      <AnimatedBackground variant="dashboard" intensity={1} />

      {/* Navbar at top with glass effect */}
      <div className={styles.navbarWrapper}>
        <DashboardNavbar onSearch={handleSearch} showSearch={true} />
      </div>

      {/* Main Content Area - Responsive layout */}
      <div className={styles.layout}>
        {/* Main Content - InstancesGrid */}
        <main id="main-content" className={`${styles.main} fade-in`} role="main">
          <div className={styles.mainContent}>
            <InstancesGrid searchQuery={searchQuery} />
          </div>
        </main>

        {/* OnlineUsersSidebar - Collapsible on mobile */}
        <OnlineUsersSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      </div>

      {/* ProductivityToolbar at bottom */}
      <ProductivityToolbar />
    </div>
  );
}
