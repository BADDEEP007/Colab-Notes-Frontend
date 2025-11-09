import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard/Navbar';
import FriendsList from '../components/Friends/FriendsList';
import FriendRequests from '../components/Friends/FriendRequests';
import SharedWithMe from '../components/Friends/SharedWithMe';
import ShareNoteModal from '../components/Friends/ShareNoteModal';
import useFriendStore from '../store/useFriendStore';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar title="Friends" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Add Friend Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Friends
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your connections and shared notes
            </p>
          </div>
          <button
            onClick={() => setIsAddFriendModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Friend
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <svg
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${
                      activeTab === tab.id
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }
                  `}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === 'friends' && <FriendsList onShareNote={handleShareNote} />}
          {activeTab === 'requests' && <FriendRequests />}
          {activeTab === 'shared' && <SharedWithMe />}
        </div>
      </div>

      {/* Add Friend Modal */}
      {isAddFriendModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsAddFriendModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Friend
              </h2>
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
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
            <div className="p-6 space-y-4">
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
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
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Friend request sent successfully!
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="friend-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Friend's Email
                </label>
                <input
                  type="email"
                  id="friend-email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendFriendRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSending || success}
              >
                {isSending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
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
