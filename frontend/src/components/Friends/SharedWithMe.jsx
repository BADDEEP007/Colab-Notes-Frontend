import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNoteStore from '../../store/useNoteStore';
import useSocketStore from '../../store/useSocketStore';

/**
 * Shared With Me Component
 * Displays notes that have been shared by friends
 * Requirements: 12.3, 12.4
 */
export default function SharedWithMe() {
  const navigate = useNavigate();
  const { notes, fetchNotes, isLoading, error } = useNoteStore();
  const { on, off } = useSocketStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();

    // Listen for note sharing events via WebSocket
    const handleNoteShare = (data) => {
      useNoteStore.getState().handleSharedNote(data);
    };

    on('note:share', handleNoteShare);

    return () => {
      off('note:share', handleNoteShare);
    };
  }, [fetchNotes, on, off]);

  // Filter notes that are shared with the current user
  const sharedNotes = notes.filter((note) => {
    return note.sharedWith && note.sharedWith.length > 0;
  });

  // Filter by search query
  const filteredNotes = sharedNotes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const title = note.title?.toLowerCase() || '';
    const content = note.content?.toLowerCase() || '';
    return title.includes(query) || content.includes(query);
  });

  // Sort by shared date (most recent first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const aDate = a.sharedWith?.[0]?.sharedAt || a.updatedAt;
    const bDate = b.sharedWith?.[0]?.sharedAt || b.updatedAt;
    return new Date(bDate) - new Date(aDate);
  });

  const handleNoteClick = (note) => {
    // Navigate to the note
    // Assuming note has containerId and instanceId
    if (note.containerId && note.instanceId) {
      navigate(
        `/instance/${note.instanceId}/container/${note.containerId}/note/${note.id}`
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search shared notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Notes Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {sortedNotes.length} {sortedNotes.length === 1 ? 'note' : 'notes'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Shared Notes List */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {searchQuery ? 'No notes found' : 'No shared notes'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try a different search term'
              : 'Notes shared with you by friends will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => {
            const sharedInfo = note.sharedWith?.[0] || {};
            const role = sharedInfo.role || 'Viewer';
            const sharedDate = sharedInfo.sharedAt || note.updatedAt;

            return (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNoteClick(note);
                  }
                }}
                aria-label={`Open note ${note.title}`}
              >
                <div className="flex items-start justify-between">
                  {/* Note Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(role)}`}
                      >
                        {role}
                      </span>
                    </div>

                    {/* Note Preview */}
                    {note.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {note.content}
                      </p>
                    )}

                    {/* Shared Info */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>
                          {note.authorName || note.authorEmail || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Shared {formatDate(sharedDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
