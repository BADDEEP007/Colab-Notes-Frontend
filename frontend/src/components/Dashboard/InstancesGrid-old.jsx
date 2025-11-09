import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Grid } from 'react-window';
import useInstanceStore from '../../store/useInstanceStore';
import InstanceCard from './InstanceCard';
import CreateInstanceModal from './CreateInstanceModal';
import LoadingSpinner, { CardSkeleton } from '../LoadingSpinner';

/**
 * Instances Grid Component
 * Displays instances in responsive grid with search and create functionality
 * Requirements: 4.2, 4.3, 19.1, 19.2, 19.4
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
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Fetch instances on mount
  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  // Track container width for responsive grid
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Filter instances based on search query - memoized
  const filteredInstances = useMemo(() => {
    if (!searchQuery.trim()) {
      return instances;
    }
    const query = searchQuery.toLowerCase();
    return instances.filter((instance) => instance.name.toLowerCase().includes(query));
  }, [searchQuery, instances]);

  // Calculate grid dimensions based on screen size
  const gridConfig = useMemo(() => {
    const gap = 24; // 6 * 4px (gap-6)
    let columnCount = 1;

    if (containerWidth >= 1280) {
      columnCount = 4; // xl
    } else if (containerWidth >= 1024) {
      columnCount = 3; // lg
    } else if (containerWidth >= 640) {
      columnCount = 2; // sm
    }

    const columnWidth = Math.floor((containerWidth - gap * (columnCount - 1)) / columnCount);
    const rowHeight = 220; // Approximate height of InstanceCard
    const rowCount = Math.ceil(filteredInstances.length / columnCount);

    return { columnCount, columnWidth, rowHeight, rowCount };
  }, [containerWidth, filteredInstances.length]);

  // Use virtual scrolling only for large lists (>20 items)
  const useVirtualization = filteredInstances.length > 20;

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

      // Generate shareable link with Viewer role by default
      const result = await generateShareLink(id, 'Viewer');

      if (result.success) {
        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(result.link);
          alert('Shareable link copied to clipboard!');
        } catch (err) {
          // Fallback: show link in prompt
          prompt('Copy this shareable link:', result.link);
        }
      } else {
        alert('Failed to generate shareable link');
      }
    },
    [instances, generateShareLink]
  );

  const handleCreateSuccess = useCallback(() => {
    // Refresh instances list
    fetchInstances();
  }, [fetchInstances]);

  // Cell renderer for virtual grid
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * gridConfig.columnCount + columnIndex;
      if (index >= filteredInstances.length) return null;

      const instance = filteredInstances[index];
      return (
        <div style={{ ...style, padding: '12px' }}>
          <InstanceCard
            instance={instance}
            onRename={handleRename}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        </div>
      );
    },
    [filteredInstances, gridConfig.columnCount, handleRename, handleDelete, handleShare]
  );

  return (
    <div className="w-full" ref={containerRef}>
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Instances
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredInstances.length} {filteredInstances.length === 1 ? 'instance' : 'instances'}
            {searchQuery && ' found'}
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors touch-manipulation min-h-[44px]"
          aria-label="Create new instance"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Instance
        </button>
      </div>

      {/* Loading State */}
      {isLoading && instances.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardSkeleton count={4} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredInstances.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No instances yet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get started by creating your first instance.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Instance
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredInstances.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No instances found
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No instances match &quot;{searchQuery}&quot;. Try a different search term.
          </p>
        </div>
      )}

      {/* Instances Grid */}
      {!isLoading && filteredInstances.length > 0 && (
        <>
          {useVirtualization && containerWidth > 0 ? (
            // Virtual scrolling for large lists
            <Grid
              columnCount={gridConfig.columnCount}
              columnWidth={gridConfig.columnWidth}
              defaultHeight={Math.min(800, gridConfig.rowHeight * gridConfig.rowCount)}
              rowCount={gridConfig.rowCount}
              rowHeight={gridConfig.rowHeight}
              defaultWidth={containerWidth}
              className="scrollbar-thin"
              cellComponent={Cell}
            />
          ) : (
            // Regular grid for smaller lists
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              role="list"
            >
              {filteredInstances.map((instance) => (
                <InstanceCard
                  key={instance.id}
                  instance={instance}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Instance Modal */}
      <CreateInstanceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
