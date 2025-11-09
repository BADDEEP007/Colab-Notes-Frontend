import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import InstanceHeader from '../components/Instance/InstanceHeader';
import {
  ContainersGrid,
  InviteModal,
  ShareModal,
  NotesPanel,
  FriendsOnlinePanel,
  AIToolbar,
} from '../components/Instance';
import useInstanceStore from '../store/useInstanceStore';
import useAuthStore from '../store/useAuthStore';
import styles from './InstancePage.module.css';

/**
 * Instance Page Component
 * Main instance view combining all instance-related components
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export default function InstancePage() {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentInstance, instances, setCurrentInstance, isLoading } = useInstanceStore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set current instance when component mounts or instanceId changes
  useEffect(() => {
    if (instanceId) {
      setCurrentInstance(instanceId);
    }
  }, [instanceId, setCurrentInstance]);

  // Get the instance to display
  const instance = currentInstance || instances.find((inst) => inst.id === instanceId);

  // Determine user's role in the instance
  const getUserRole = useCallback(() => {
    if (!instance || !user) return 'Viewer';

    // Check if user is the owner
    if (instance.ownerId === user.id) return 'Owner';

    // Check member role
    const member = instance.members?.find((m) => m.userId === user.id);
    return member?.role || 'Viewer';
  }, [instance, user]);

  const userRole = getUserRole();
  const canEdit = userRole === 'Owner' || userRole === 'Editor';

  // Handle modal toggles
  const handleOpenInviteModal = () => setIsInviteModalOpen(true);
  const handleCloseInviteModal = () => setIsInviteModalOpen(false);
  const handleOpenShareModal = () => setIsShareModalOpen(true);
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Handle search with debounce
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading instance...</p>
        </div>
      </div>
    );
  }

  // Instance not found
  if (!instance && !isLoading) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundInner}>
            <svg
              className={styles.notFoundIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className={styles.notFoundTitle}>Instance Not Found</h2>
            <p className={styles.notFoundMessage}>
              The instance you're looking for doesn't exist or you don't have access to it.
            </p>
            <button onClick={handleBackToDashboard} className={styles.backButton}>
              <svg
                className={styles.backIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <AnimatedBackground variant="minimal" />

      {/* Instance Header */}
      <InstanceHeader
        instance={instance}
        userRole={userRole}
        user={user}
        onOpenInviteModal={handleOpenInviteModal}
        onOpenShareModal={handleOpenShareModal}
      />

      {/* Main Content Area - Remove old navbar */}
      <div className={styles.layout}>
        {/* Main Content */}
        <main id="main-content" className={styles.main} role="main">
          <div className={styles.mainContent}>
            {/* Notes Panel */}
            <section aria-label="Notes panel">
              <NotesPanel
                instanceId={instanceId}
                containerId={null}
                searchQuery={debouncedSearchQuery}
              />
            </section>

            {/* Containers Grid */}
            <section aria-label="Containers">
              <ContainersGrid
                instanceId={instanceId}
                canEdit={canEdit}
                searchQuery={debouncedSearchQuery}
              />
            </section>
          </div>
        </main>

        {/* Friends Online Panel - Hidden on mobile, collapsible on tablet */}
        <div className={styles.friendsPanel}>
          <FriendsOnlinePanel instanceId={instanceId} />
        </div>
      </div>

      {/* AI Toolbar */}
      <AIToolbar instanceId={instanceId} />

      {/* Modals */}
      <InviteModal
        instanceId={instanceId}
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
      />
      <ShareModal
        instanceId={instanceId}
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
      />
    </div>
  );
}
