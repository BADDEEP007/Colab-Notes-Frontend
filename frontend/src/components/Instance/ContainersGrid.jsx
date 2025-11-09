import { useState, useEffect } from 'react';
import ContainerCard from './ContainerCard';
import useInstanceStore from '../../store/useInstanceStore';
import styles from './ContainersGrid.module.css';

/**
 * Containers Grid Component
 * Displays containers in a grid layout with create functionality
 * Requirements: 7.1, 7.2, 7.5, 19.2, 19.3, 19.5
 */
export default function ContainersGrid({ instanceId, canEdit = true, searchQuery = '' }) {
  const { containers, fetchContainers, createContainer, isLoading } = useInstanceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newContainerName, setNewContainerName] = useState('');
  const [error, setError] = useState('');
  const [filteredContainers, setFilteredContainers] = useState([]);

  useEffect(() => {
    if (instanceId) {
      fetchContainers(instanceId);
    }
  }, [instanceId, fetchContainers]);

  // Filter containers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContainers(containers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = containers.filter((container) =>
        container.name.toLowerCase().includes(query)
      );
      setFilteredContainers(filtered);
    }
  }, [searchQuery, containers]);

  const handleCreateContainer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newContainerName.trim()) {
      setError('Container name is required');
      return;
    }

    setIsCreating(true);
    const result = await createContainer(instanceId, newContainerName.trim());
    setIsCreating(false);

    if (result.success) {
      setNewContainerName('');
      setError('');
    } else {
      setError(result.error || 'Failed to create container');
    }
  };

  const handleCancelCreate = () => {
    setNewContainerName('');
    setError('');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header with Create Button */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Containers</h2>
          {searchQuery && (
            <p className={styles.searchResults}>
              {filteredContainers.length}{' '}
              {filteredContainers.length === 1 ? 'container' : 'containers'} found
            </p>
          )}
        </div>
        {canEdit && (
          <button
            onClick={() => setNewContainerName(' ')}
            className={styles.createButton}
            aria-label="Create new container"
          >
            <svg
              className={styles.createIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Container
          </button>
        )}
      </div>

      {/* Create Container Form */}
      {newContainerName !== '' && canEdit && (
        <div className={styles.createForm}>
          <form onSubmit={handleCreateContainer}>
            <label htmlFor="container-name" className={styles.formLabel}>
              Container Name
            </label>
            <div className={styles.formInputGroup}>
              <input
                type="text"
                id="container-name"
                value={newContainerName}
                onChange={(e) => setNewContainerName(e.target.value)}
                placeholder="Enter container name..."
                className={styles.formInput}
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={isCreating || !newContainerName.trim()}
                className={styles.formButton}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={handleCancelCreate} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
            {error && <p className={styles.formError}>{error}</p>}
          </form>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredContainers.length === 0 && searchQuery && (
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
          <h3 className={styles.emptyTitle}>No containers found</h3>
          <p className={styles.emptyDescription}>
            No containers match &quot;{searchQuery}&quot;. Try a different search term.
          </p>
        </div>
      )}

      {/* Containers Grid */}
      {filteredContainers.length === 0 && !searchQuery ? (
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className={styles.emptyTitle}>No containers yet</h3>
          <p className={styles.emptyDescription}>
            {canEdit
              ? 'Get started by creating your first container to organize your notes.'
              : 'This instance has no containers yet.'}
          </p>
          {canEdit && (
            <button onClick={() => setNewContainerName(' ')} className={styles.emptyButton}>
              <svg
                className={styles.emptyButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create First Container
            </button>
          )}
        </div>
      ) : filteredContainers.length > 0 ? (
        <div className={styles.grid}>
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              instanceId={instanceId}
              canEdit={canEdit}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
