import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard/Navbar';
import FriendsList from '../components/Friends/FriendsList';
import FriendRequests from '../components/Friends/FriendRequests';
import SharedWithMe from '../components/Friends/SharedWithMe';
import ShareNoteModal from '../components/Friends/ShareNoteModal';
import useFriendStore from '../store/useFriendStore';
import styles from './FriendsPage.module.css';

/**
 * Friends Page Component
 * Main page for managing friends, requests, and shared notes
 * Requirements: 11.1, 11.2, 11.3, 11.5
 */
export default function FriendsPage() {
  const navigate = useNavigate();
  const { sendFriendRequest } = useFriendStore();
  const [activeTab, setActiveTab] = useState('friends');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isShareNoteModalOpen, setIsShareNoteModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendEmail, setFriendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: 'friends', label: 'Friends', icon: 'users' },
    { id: 'requests', label: 'Requests', icon: 'user-add' },
    { id: 'shared', label: 'Shared with Me', icon: 'document' },
  ];

  const handleSendFriendRequest = async () => {
    if (!friendEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await sendFriendRequest(friendEmail.trim());

      if (result.success) {
        setSuccess(true);
        setFriendEmail('');
        setTimeout(() => {
          setSuccess(false);
          setIsAddFriendModalOpen(false);
        }, 1500);
      } else {
        setError(result.error || 'Failed to send friend request');
      }
    } catch (err) {
      setError('An error occurred while sending the request');
    } finally {
      setIsSending(false);
    }
  };

  const handleShareNote = (friendId) => {
    const friend = useFriendStore.getState().friends.find((f) => f.id === friendId);
    setSelectedFriend(friend);
    setIsShareNoteModalOpen(true);
  };

  const getTabIcon = (iconType) => {
    switch (iconType) {
      case 'users':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        );
      case 'user-add':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        );
      case 'document':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <Navbar title="Friends" />

      {/* Main Content */}
      <main id="main-content" className={styles.main} role="main">
        {/* Header with Add Friend Button */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Friends</h1>
            <p>Manage your connections and shared notes</p>
          </div>
          <button onClick={() => setIsAddFriendModalOpen(true)} className={styles.addButton}>
            <svg
              className={styles.addButtonIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Friend
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <nav className={styles.tabsNav} aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <svg
                  className={styles.tabIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {getTabIcon(tab.icon)}
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'friends' && <FriendsList onShareNote={handleShareNote} />}
          {activeTab === 'requests' && <FriendRequests />}
          {activeTab === 'shared' && <SharedWithMe />}
        </div>
      </main>

      {/* Add Friend Modal */}
      {isAddFriendModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddFriendModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Friend</h2>
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className={styles.modalCloseButton}
                aria-label="Close modal"
              >
                <svg
                  className={styles.modalCloseIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className={styles.modalBody}>
              {success && (
                <div className={`${styles.alert} ${styles.success}`}>
                  <div className={styles.alertContent}>
                    <svg
                      className={styles.alertIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className={styles.alertText}>Friend request sent successfully!</p>
                  </div>
                </div>
              )}

              {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                  <p className={styles.alertText}>{error}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="friend-email" className={styles.label}>
                  Friend's Email
                </label>
                <input
                  type="email"
                  id="friend-email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className={styles.input}
                  disabled={isSending || success}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendFriendRequest();
                    }
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className={`${styles.modalButton} ${styles.secondary}`}
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendFriendRequest}
                className={`${styles.modalButton} ${styles.primary}`}
                disabled={isSending || success}
              >
                {isSending ? (
                  <>
                    <svg
                      className={styles.loadingSpinner}
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className={styles.spinnerCircle}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className={styles.spinnerPath}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Note Modal */}
      {isShareNoteModalOpen && selectedFriend && (
        <ShareNoteModal
          isOpen={isShareNoteModalOpen}
          onClose={() => {
            setIsShareNoteModalOpen(false);
            setSelectedFriend(null);
          }}
          friendId={selectedFriend.friendId || selectedFriend.id}
          friendName={selectedFriend.name || selectedFriend.email}
        />
      )}
    </div>
  );
}
