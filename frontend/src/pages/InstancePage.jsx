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
  const instance = currentInstance || instances.find(inst => inst.id === instanceId);

  // Determine user's role in the instance
  const getUserRole = useCallback(() => {
    if (!instance || !user) return 'Viewer';
    
    // Check if user is the owner
    if (instance.ownerId === user.id) return 'Owner';
    
    // Check member role
    const member = instance.members?.find(m => m.userId === user.id);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading instance...</p>
        </div>
      </div>
    );
  }

  // Instance not found
  if (!instance && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardNavbar showSearch={false} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Instance Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The instance you're looking for doesn't exist or you don't have access to it.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-2"
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
    <div className="min-h-screen relative">
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
      <div className="flex flex-col lg:flex-row relative z-base">

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Notes Panel */}
            <section aria-label="Notes panel">
              <NotesPanel instanceId={instanceId} containerId={null} searchQuery={debouncedSearchQuery} />
            </section>

            {/* Containers Grid */}
            <section aria-label="Containers">
              <ContainersGrid instanceId={instanceId} canEdit={canEdit} searchQuery={debouncedSearchQuery} />
            </section>
          </div>
        </main>

        {/* Friends Online Panel - Hidden on mobile, collapsible on tablet */}
        <div className="hidden lg:block">
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
