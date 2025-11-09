import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Container Card Component
 * Displays container information with navigation to container page
 * Requirements: 7.3, 7.4, 8.6
 */
const ContainerCard = memo(function ContainerCard({ container, instanceId, canEdit = true }) {
  const navigate = useNavigate();

  const { id, name, notes = [], updatedAt } = container;
  const noteCount = notes.length || 0;

  const handleCardClick = useCallback(() => {
    if (canEdit) {
      navigate(`/instance/${instanceId}/container/${id}`);
    }
  }, [canEdit, navigate, instanceId, id]);

  // Format date - memoized
  const formattedDate = useMemo(() => {
    if (!updatedAt) return 'Never';
    const date = new Date(updatedAt);
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
  }, [updatedAt]);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative glass-container p-6 transition-all duration-300 fade-in ${
        canEdit
          ? 'cursor-pointer hover-scale'
          : 'cursor-not-allowed opacity-60'
      }`}
      role="button"
      tabIndex={canEdit ? 0 : -1}
      onKeyDown={(e) => {
        if (canEdit && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${canEdit ? 'Open' : 'View'} container ${name}`}
      aria-disabled={!canEdit}
    >
      {/* Container Icon and Title */}
      <div className="flex items-start mb-4">
        <div className="shrink-0 mr-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold truncate transition-colors"
            style={{ color: 'var(--color-muted-navy)' }}
          >
            {name}
          </h3>
        </div>
      </div>

      {/* Container Info */}
      <div className="space-y-2">
        {/* Note Count */}
        <div 
          className="flex items-center text-sm"
          style={{ color: 'var(--color-muted-navy)', opacity: 0.8 }}
        >
          <svg
            className="h-4 w-4 mr-1.5"
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
          <span>
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </span>
        </div>

        {/* Last Modified */}
        <div 
          className="flex items-center text-sm"
          style={{ color: 'var(--color-muted-navy)', opacity: 0.6 }}
        >
          <svg
            className="h-4 w-4 mr-1.5"
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
          <span>Updated {formattedDate}</span>
        </div>
      </div>

      {/* Disabled State Indicator */}
      {!canEdit && (
        <div className="absolute top-4 right-4">
          <div 
            className="text-xs px-2 py-1 rounded"
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--color-light-coral)',
            }}
          >
            View Only
          </div>
        </div>
      )}

      {/* Hover indicator (only when editable) */}
      {canEdit && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-lg"
          style={{ background: 'var(--gradient-primary)' }}
        ></div>
      )}
    </div>
  );
});

export default ContainerCard;
