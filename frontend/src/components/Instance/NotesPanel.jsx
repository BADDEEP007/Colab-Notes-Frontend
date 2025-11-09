import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNoteStore from '../../store/useNoteStore';
import useAuthStore from '../../store/useAuthStore';
import styles from './NotesPanel.module.css';
import clsx from 'clsx';

/**
 * Notes Panel Component
 * Displays tabs for "My Notes" and "Collaborated Notes"
 * Requirements: 12.3, 12.4, 19.2, 19.3, 19.5
 */
export default function NotesPanel({ instanceId, containerId, searchQuery = '' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-notes');
  const { notes, fetchNotes, isLoading } = useNoteStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (containerId) {
      fetchNotes(containerId);
    }
  }, [containerId, fetchNotes]);

  // Filter notes created by the current user
  const myNotes = notes.filter((note) => note.authorId === user?.id);

  // Filter notes shared with the current user (collaborated notes)
  const collaboratedNotes = notes.filter((note) => {
    // Check if note is shared with current user
    const isShared = note.sharedWith?.some((share) => share.userId === user?.id);
    // Exclude notes created by current user
    const isNotAuthor = note.authorId !== user?.id;
    return isShared && isNotAuthor;
  });

  // Apply search filter to notes
  const filterNotesBySearch = (notesList) => {
    if (!searchQuery.trim()) {
      return notesList;
    }
    const query = searchQuery.toLowerCase();
    return notesList.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(query);
      const contentMatch = note.content?.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
  };

  const filteredMyNotes = filterNotesBySearch(myNotes);
  const filteredCollaboratedNotes = filterNotesBySearch(collaboratedNotes);

  // Highlight matching text in search results
  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleNoteClick = (noteId) => {
    if (instanceId && containerId) {
      navigate(`/instance/${instanceId}/container/${containerId}/note/${noteId}`);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
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

  const renderNotesList = (notesList, emptyMessage) => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      );
    }

    if (notesList.length === 0) {
      return (
        <div className={styles.emptyState}>
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
          <p className={styles.emptyText}>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={styles.notesList}>
        {notesList.map((note) => (
          <div
            key={note.id}
            onClick={() => handleNoteClick(note.id)}
            className={styles.noteItem}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNoteClick(note.id);
              }
            }}
            aria-label={`Open note ${note.title}`}
          >
            <div className={styles.noteHeader}>
              <div className={styles.noteInfo}>
                <h4 className={styles.noteTitle}>
                  {searchQuery ? highlightText(note.title, searchQuery) : note.title}
                </h4>
                {note.content && (
                  <p className={styles.noteContent}>
                    {searchQuery
                      ? highlightText(note.content.substring(0, 100), searchQuery)
                      : note.content.substring(0, 100)}
                  </p>
                )}
              </div>
              <div className={styles.noteArrow}>
                <svg
                  className={styles.noteArrowIcon}
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
            <div className={styles.noteMeta}>
              <svg
                className={styles.noteMetaIcon}
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
              <span>Updated {formatDate(note.updatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Tab Headers */}
      <div className={styles.tabsHeader}>
        <nav className={styles.tabsNav} aria-label="Notes tabs">
          <button
            onClick={() => setActiveTab('my-notes')}
            className={clsx(styles.tab, activeTab === 'my-notes' && styles.active)}
            aria-current={activeTab === 'my-notes' ? 'page' : undefined}
          >
            <div className={styles.tabContent}>
              <svg
                className={styles.tabIcon}
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
              My Notes
              {(searchQuery ? filteredMyNotes : myNotes).length > 0 && (
                <span className={styles.tabBadge}>
                  {searchQuery ? filteredMyNotes.length : myNotes.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('collaborated')}
            className={clsx(styles.tab, activeTab === 'collaborated' && styles.active)}
            aria-current={activeTab === 'collaborated' ? 'page' : undefined}
          >
            <div className={styles.tabContent}>
              <svg
                className={styles.tabIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Collaborated Notes
              {(searchQuery ? filteredCollaboratedNotes : collaboratedNotes).length > 0 && (
                <span className={styles.tabBadge}>
                  {searchQuery ? filteredCollaboratedNotes.length : collaboratedNotes.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className={styles.panelContent}>
        {activeTab === 'my-notes' && (
          <div role="tabpanel" aria-labelledby="my-notes-tab">
            {searchQuery && filteredMyNotes.length === 0 && myNotes.length > 0 ? (
              <div className={styles.emptyState}>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className={styles.emptyText}>No notes match &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              renderNotesList(
                filteredMyNotes,
                'No notes yet. Create your first note to get started!'
              )
            )}
          </div>
        )}
        {activeTab === 'collaborated' && (
          <div role="tabpanel" aria-labelledby="collaborated-tab">
            {searchQuery &&
            filteredCollaboratedNotes.length === 0 &&
            collaboratedNotes.length > 0 ? (
              <div className={styles.emptyState}>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className={styles.emptyText}>No notes match &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              renderNotesList(
                filteredCollaboratedNotes,
                'No collaborated notes yet. Notes shared with you will appear here.'
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
