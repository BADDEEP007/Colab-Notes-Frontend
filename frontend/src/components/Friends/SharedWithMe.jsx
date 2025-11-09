import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNoteStore from '../../store/useNoteStore';
import useSocketStore from '../../store/useSocketStore';
import styles from './SharedWithMe.module.css';

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
      navigate(`/instance/${note.instanceId}/container/${note.containerId}/note/${note.id}`);
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

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Editor':
        return styles.roleEditor;
      case 'Viewer':
        return styles.roleViewer;
      default:
        return styles.roleViewer;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search shared notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <svg
          className={styles.searchIcon}
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
      <div className={styles.header}>
        <p className={styles.count}>
          {sortedNotes.length} {sortedNotes.length === 1 ? 'note' : 'notes'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Shared Notes List */}
      {sortedNotes.length === 0 ? (
        <div className={styles.empty}>
          <svg
            className={styles.emptyIcon}
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
          <h3 className={styles.emptyTitle}>
            {searchQuery ? 'No notes found' : 'No shared notes'}
          </h3>
          <p className={styles.emptyDescription}>
            {searchQuery
              ? 'Try a different search term'
              : 'Notes shared with you by friends will appear here'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {sortedNotes.map((note) => {
            const sharedInfo = note.sharedWith?.[0] || {};
            const role = sharedInfo.role || 'Viewer';
            const sharedDate = sharedInfo.sharedAt || note.updatedAt;

            return (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={styles.noteCard}
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
                <div className={styles.noteContent}>
                  {/* Note Info */}
                  <div className={styles.noteInfo}>
                    <div className={styles.noteHeader}>
                      <h3 className={styles.noteTitle}>{note.title || 'Untitled Note'}</h3>
                      <span className={`${styles.roleBadge} ${getRoleBadgeClass(role)}`}>
                        {role}
                      </span>
                    </div>

                    {/* Note Preview */}
                    {note.content && <p className={styles.notePreview}>{note.content}</p>}

                    {/* Shared Info */}
                    <div className={styles.noteMetadata}>
                      <div className={styles.metadataItem}>
                        <svg
                          className={styles.metadataIcon}
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
                        <span>{note.authorName || note.authorEmail || 'Unknown'}</span>
                      </div>
                      <div className={styles.metadataItem}>
                        <svg
                          className={styles.metadataIcon}
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
                  <div className={styles.arrow}>
                    <svg
                      className={styles.arrowIcon}
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
