import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import InstanceCard from './InstanceCard';
import CreateInstanceModal from './CreateInstanceModal';
import LoadingSpinner, { CardSkeleton } from '../LoadingSpinner';
import styles from './InstancesGrid.module.css';

/**
 * Instances Grid Component - Improved Layout
 * Displays instances in responsive grid with better spacing
 */
export default function InstancesGrid({ searchQuery = '' }) {
  const {
    instances,
    fetchInstances,
    updateInstance,
    deleteInstance,
    generateShareLink,
    isLoading,
  } = useInstanceStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch instances on mount
  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  // Filter instances based on search query
  const filteredInstances = useMemo(() => {
    if (!searchQuery.trim()) {
      return instances;
    }
    const query = searchQuery.toLowerCase();
    return instances.filter((instance) => instance.name.toLowerCase().includes(query));
  }, [searchQuery, instances]);

  const handleRename = useCallback(
    async (id, newName) => {
      await updateInstance(id, { name: newName });
    },
    [updateInstance]
  );

  const handleDelete = useCallback(
    async (id) => {
      await deleteInstance(id);
    },
    [deleteInstance]
  );

  const handleShare = useCallback(
    async (id) => {
      const instance = instances.find((inst) => inst.id === id);
      if (!instance) return;

      const result = await generateShareLink(id, 'instance');
      if (result?.link) {
        try {
          await navigator.clipboard.writeText(result.link);
          alert('Shareable link copied to clipboard!');
        } catch (err) {
          prompt('Copy this shareable link:', result.link);
        }
      } else {
        alert('Failed to generate shareable link');
      }
    },
    [instances, generateShareLink]
  );

  const handleCreateSuccess = useCallback(() => {
    fetchInstances();
  }, [fetchInstances]);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>My Instances</h1>
            <p className={styles.subtitle}>
              {filteredInstances.length} {filteredInstances.length === 1 ? 'instance' : 'instances'}
              {searchQuery && ' found'}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.createButton}
            aria-label="Create new instance"
          >
            <svg
              className={styles.createButtonIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Instance</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && instances.length === 0 && (
        <div className={styles.grid}>
          <CardSkeleton count={6} />
        </div>
      )}

      {/* Empty State with create prompt */}
      {!isLoading && filteredInstances.length === 0 && !searchQuery && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>
              <svg
                className={styles.emptyStateIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>No instances yet</h3>
            <p className={styles.emptyStateText}>
              Get started by creating your first instance to organize your notes and collaborate
              with your team.
            </p>
            <button onClick={() => setIsCreateModalOpen(true)} className={styles.emptyStateButton}>
              <svg
                className={styles.emptyStateButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Instance
            </button>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredInstances.length === 0 && searchQuery && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={`${styles.emptyStateIcon} ${styles.emptyStateIconSecondary}`}>
              <svg
                className={styles.emptyStateIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>No results found</h3>
            <p className={styles.emptyStateText}>
              No instances match "<span className={styles.searchHighlight}>{searchQuery}</span>".
              Try a different search term.
            </p>
          </div>
        </div>
      )}

      {/* Responsive CSS Grid (3 cols desktop, 2 tablet, 1 mobile) with fade-in animation */}
      {!isLoading && filteredInstances.length > 0 && (
        <div className={styles.grid}>
          {filteredInstances.map((instance, index) => (
            <div
              key={instance.id}
              className={styles.gridItem}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <InstanceCard
                instance={instance}
                onRename={handleRename}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Instance Modal */}
      {isCreateModalOpen && (
        <CreateInstanceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
